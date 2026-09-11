import { exec } from 'child_process';
import fs from 'fs/promises';
import http from 'http';
import path from 'path';
import { authFailureHtml, authSuccessHtml } from './auth-html';

const TOKEN_CACHE_DIR = path.join(process.cwd(), 'cache', 'secrets-manager');
const TOKEN_CACHE_FILE = path.join(TOKEN_CACHE_DIR, 'token.json');
const AUTH_TIMEOUT_MS = 120000;

interface CachedToken {
  token: string;
  expiresAt: number;
}

export const getCachedToken = async (): Promise<string | null> => {
  try {
    const cached: CachedToken = JSON.parse(await fs.readFile(TOKEN_CACHE_FILE, 'utf8'));
    return cached.expiresAt > Date.now() ? cached.token : null;
  } catch {
    return null;
  }
};

export const clearCachedToken = async (): Promise<void> => {
  try {
    await fs.unlink(TOKEN_CACHE_FILE);
  } catch {
    /* nothing cached */
  }
};

export const cacheToken = async (token: string, expiresInSeconds: number): Promise<void> => {
  await fs.mkdir(TOKEN_CACHE_DIR, { recursive: true });
  const cached: CachedToken = { token, expiresAt: Date.now() + expiresInSeconds * 1000 };
  await fs.writeFile(TOKEN_CACHE_FILE, JSON.stringify(cached), 'utf8');
};

const exchangeClerkToken = async (serviceUrl: string, clerkToken: string): Promise<{ token: string; expiresIn: number }> => {
  const res = await fetch(`${serviceUrl}/token/clerk`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${clerkToken}`, 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error(`Token exchange failed: ${res.status} ${res.statusText}`);
  return (await res.json()) as { token: string; expiresIn: number };
};

const openCommand = (): string => {
  if (process.platform === 'darwin') return 'open';
  if (process.platform === 'win32') return 'start';
  return 'xdg-open';
};

const handleCallback = async (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  server: http.Server,
  serviceUrl: string,
  resolve: (token: string) => void
): Promise<void> => {
  const clerkToken = new URL(req.url || '', 'http://localhost').searchParams.get('token');

  if (!clerkToken) {
    res.writeHead(400);
    res.end('Missing token');
    return;
  }

  try {
    const { token, expiresIn } = await exchangeClerkToken(serviceUrl, clerkToken);
    await cacheToken(token, expiresIn);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(authSuccessHtml);
    server.close();
    resolve(token);
  } catch (err) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(authFailureHtml((err as Error).message));
    server.close();
  }
};

const openBrowser = (serviceUrl: string, port: number, switchAccount: boolean): void => {
  const callback = encodeURIComponent(`http://localhost:${port}/callback`);
  const url = `${serviceUrl}/auth/login?callback=${callback}${switchAccount ? '&switch=true' : ''}`;
  console.log('\nOpening browser for authentication...');
  console.log(`If the browser doesn't open, visit: ${url}\n`);
  exec(`${openCommand()} "${url}"`);
};

/** Developer path: spin up a loopback server, let Clerk redirect back with a token. */
export const authenticateWithClerk = async (serviceUrl: string, switchAccount = false): Promise<string> => {
  if (switchAccount) await clearCachedToken();

  const cached = await getCachedToken();
  if (cached) {
    console.log('Using cached authentication token');
    return cached;
  }

  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      handleCallback(req, res, server, serviceUrl, resolve);
    });

    server.listen(0, () => {
      openBrowser(serviceUrl, (server.address() as { port: number }).port, switchAccount);
      setTimeout(() => {
        server.close();
        reject(new Error('Authentication timed out after 2 minutes'));
      }, AUTH_TIMEOUT_MS);
    });
  });
};

/** CI uses SECRETS_MANAGER_API_KEY; developers get the browser flow. */
export const getAuthToken = async (serviceUrl: string, serviceId: string): Promise<string> => {
  const apiKey = process.env['SECRETS_MANAGER_API_KEY'];
  if (apiKey) {
    console.log('Using API key authentication (CI mode)');
    const { getTokenFromApiKey } = await import('./api-client');
    return getTokenFromApiKey(serviceUrl, apiKey, serviceId);
  }
  console.log('Using browser authentication (developer mode)');
  return authenticateWithClerk(serviceUrl);
};

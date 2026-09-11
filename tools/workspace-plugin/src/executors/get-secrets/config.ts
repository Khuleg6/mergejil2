import fs from 'fs';
import path from 'path';

/**
 * Points at your own deployed secrets-manager-service — there is no default URL
 * baked in anywhere.
 *
 * `.secrets-env` (gitignored, workspace root) holds named environments:
 *
 *   { "current": "testing",
 *     "environments": { "testing": "https://...", "production": "https://..." } }
 *
 * Older versions wrote a bare URL string; that is still read, and upgraded on
 * the next save.
 */
export const SECRETS_ENV_FILE = path.join(process.cwd(), '.secrets-env');

export const DEFAULT_ENVIRONMENT = 'testing';

export interface SecretsConfig {
  current: string;
  environments: Record<string, string>;
}

const emptyConfig = (): SecretsConfig => ({ current: DEFAULT_ENVIRONMENT, environments: {} });

const normalizeUrl = (url: string): string => url.trim().replace(/\/+$/, '');

/** Accepts the modern JSON shape or a legacy bare URL. */
export const parseConfig = (raw: string): SecretsConfig => {
  const text = (raw || '').trim();
  if (!text) return emptyConfig();

  if (!text.startsWith('{')) {
    return { current: DEFAULT_ENVIRONMENT, environments: { [DEFAULT_ENVIRONMENT]: normalizeUrl(text) } };
  }

  try {
    const parsed = JSON.parse(text) as Partial<SecretsConfig>;
    const environments = parsed.environments ?? {};
    const current = parsed.current && environments[parsed.current] ? parsed.current : Object.keys(environments)[0] ?? DEFAULT_ENVIRONMENT;
    return { current, environments };
  } catch {
    return emptyConfig();
  }
};

export const readConfig = (): SecretsConfig => {
  try {
    return parseConfig(fs.readFileSync(SECRETS_ENV_FILE, 'utf8'));
  } catch {
    return emptyConfig();
  }
};

export const writeConfig = (config: SecretsConfig): void => {
  fs.writeFileSync(SECRETS_ENV_FILE, JSON.stringify(config, null, 2) + '\n', 'utf8');
};

export const setEnvironmentUrl = (config: SecretsConfig, name: string, url: string): SecretsConfig => ({
  current: name,
  environments: { ...config.environments, [name]: normalizeUrl(url) },
});

export const removeEnvironment = (config: SecretsConfig, name: string): SecretsConfig => {
  const environments = { ...config.environments };
  delete environments[name];
  const current = config.current === name ? Object.keys(environments)[0] ?? DEFAULT_ENVIRONMENT : config.current;
  return { current, environments };
};

export class MissingServiceUrlError extends Error {
  constructor() {
    super(
      [
        'No secrets service configured.',
        '',
        'Run `bun secrets` and choose "Manage environments", or set',
        'SECRETS_MANAGER_URL to your deployed secrets-manager-service.',
      ].join('\n')
    );
    this.name = 'MissingServiceUrlError';
  }
}

/**
 * Resolution order:
 *   1. explicit argument (executor option)
 *   2. SECRETS_MANAGER_URL          — CI
 *   3. SECRETS_MANAGER_ENV          — pick a named environment from the file
 *   4. the file's `current` environment
 */
export const resolveServiceUrl = (explicitUrl?: string): string => {
  if (explicitUrl) return normalizeUrl(explicitUrl);
  if (process.env['SECRETS_MANAGER_URL']) return normalizeUrl(process.env['SECRETS_MANAGER_URL'] as string);

  const config = readConfig();
  const name = process.env['SECRETS_MANAGER_ENV'] || config.current;
  const url = config.environments[name];
  if (!url) throw new MissingServiceUrlError();
  return url;
};

export const resolveEnvironmentName = (): string => {
  if (process.env['SECRETS_MANAGER_URL']) return process.env['SECRETS_MANAGER_ENV'] || 'env';
  return process.env['SECRETS_MANAGER_ENV'] || readConfig().current;
};

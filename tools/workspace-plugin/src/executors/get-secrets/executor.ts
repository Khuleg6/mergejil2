import fs from 'fs/promises';
import path from 'path';
import { readGroupWithRetry } from './api-client';
import { clearCachedToken, getAuthToken } from './clerk-auth';
import { resolveEnvironmentName, resolveServiceUrl } from './config';
import { assertNotEmpty, serialize } from './env-format';
import { GetSecretsExecutorSchema } from './schema';

const SERVICE_ID = 'nx-get-secrets';

const toGroupList = (secrets: string | string[]): string[] => (Array.isArray(secrets) ? secrets : [secrets]);

export const fetchAllGroups = async (serviceUrl: string, token: string, secrets: string | string[]): Promise<Record<string, string>> => {
  const groups = toGroupList(secrets);
  const results = await Promise.all(groups.map((name) => readGroupWithRetry(serviceUrl, token, name)));
  return Object.assign({}, ...results) as Record<string, string>;
};

/** A cached token can outlive its grant; on 403 we re-auth once and retry. */
const fetchWithReauth = async (serviceUrl: string, secrets: string | string[]): Promise<Record<string, string>> => {
  const token = await getAuthToken(serviceUrl, SERVICE_ID);
  try {
    return await fetchAllGroups(serviceUrl, token, secrets);
  } catch (error) {
    const is403 = (error as Error).message?.includes('403');
    if (!is403 || process.env['SECRETS_MANAGER_API_KEY']) throw error;

    console.log('Token rejected (403). Re-authenticating...');
    await clearCachedToken();
    const freshToken = await getAuthToken(serviceUrl, SERVICE_ID);
    return fetchAllGroups(serviceUrl, freshToken, secrets);
  }
};

export const writeEnvFile = async (secrets: Record<string, string>, outputDir: string, filename: string): Promise<string> => {
  await fs.mkdir(outputDir, { recursive: true });
  const filePath = path.join(outputDir, filename);
  await fs.writeFile(filePath, serialize(secrets, filename), 'utf8');
  return filePath;
};

export const executeGetSecrets = async (options: GetSecretsExecutorSchema): Promise<{ success: boolean }> => {
  try {
    const { secrets, path: outputDir = '.', filename = '.env', serviceUrl: override } = options;
    const serviceUrl = resolveServiceUrl(override);

    console.log(`Fetching ${toGroupList(secrets).join(', ')} from [${resolveEnvironmentName()}] ${serviceUrl}`);
    const fetched = await fetchWithReauth(serviceUrl, secrets);
    assertNotEmpty(fetched);

    const filePath = await writeEnvFile(fetched, outputDir, filename);
    console.log(`Wrote ${Object.keys(fetched).length} secrets to ${filePath}`);

    return { success: true };
  } catch (error) {
    console.error((error as Error).message);
    return { success: false };
  }
};

export default executeGetSecrets;

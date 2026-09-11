/**
 * Self-contained env-file helpers. The pinecone-monorepo original imported these
 * from its AWS Secrets Manager executor, which dragged in @aws-sdk and lodash.
 * Nothing here needs either.
 */

const needsQuoting = (value: string): boolean => /[\s"'#]/.test(value);

const escapeValue = (value: string): string => (needsQuoting(value) ? `"${value.replace(/"/g, '\\"')}"` : value);

export const formatAsEnvFile = (secrets: Record<string, string>): string =>
  Object.entries(secrets)
    .map(([key, value]) => `${key}=${escapeValue(String(value ?? ''))}`)
    .join('\n')
    .concat('\n');

export const formatAsJson = (secrets: Record<string, string>): string => JSON.stringify(secrets, null, 2) + '\n';

export const assertNotEmpty = (secrets: Record<string, string>): void => {
  if (!secrets || Object.keys(secrets).length === 0) {
    throw new Error('No secrets fetched — check the group name and your access.');
  }
};

export const serialize = (secrets: Record<string, string>, filename: string): string =>
  filename.split('.').at(-1) === 'json' ? formatAsJson(secrets) : formatAsEnvFile(secrets);

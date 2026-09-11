const jsonHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
});

const assertOk = async (res: Response, action: string): Promise<void> => {
  if (res.ok) return;
  throw new Error(`${action} failed: ${res.status} ${res.statusText}`);
};

/** The service scopes a group member as `group:key`. */
export const scopedKey = (group: string, key: string): string => `${group}:${key}`;

/** CI path: exchange a long-lived admin key for a short-lived service token. */
export const getTokenFromApiKey = async (serviceUrl: string, apiKey: string, serviceId: string): Promise<string> => {
  const res = await fetch(`${serviceUrl}/token`, {
    method: 'POST',
    headers: { 'X-Admin-Key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ serviceId }),
  });
  await assertOk(res, 'Token request');
  return ((await res.json()) as { token: string }).token;
};

/** GET /groups returns group names. (GET /secrets returns individual keys.) */
export const listGroups = async (serviceUrl: string, token: string): Promise<string[]> => {
  const res = await fetch(`${serviceUrl}/groups`, { headers: jsonHeaders(token) });
  await assertOk(res, 'Listing secret groups');
  const body = (await res.json()) as { groups?: string[] };
  return [...new Set(body.groups ?? [])].sort();
};

export const readGroup = async (serviceUrl: string, token: string, group: string): Promise<Record<string, string>> => {
  const res = await fetch(`${serviceUrl}/secrets/${encodeURIComponent(group)}`, {
    headers: jsonHeaders(token),
  });
  await assertOk(res, `Reading group "${group}"`);
  return (await res.json()) as Record<string, string>;
};

/** Writes the whole group; callers merge with the existing contents first. */
export const writeGroup = async (serviceUrl: string, token: string, group: string, secrets: Record<string, string>): Promise<void> => {
  const res = await fetch(`${serviceUrl}/secrets/${encodeURIComponent(group)}`, {
    method: 'POST',
    headers: jsonHeaders(token),
    body: JSON.stringify(secrets),
  });
  await assertOk(res, `Writing group "${group}"`);
};

/** Deletes one member of a group. */
export const deleteSecret = async (serviceUrl: string, token: string, group: string, key: string): Promise<void> => {
  const res = await fetch(`${serviceUrl}/secret/${encodeURIComponent(scopedKey(group, key))}`, {
    method: 'DELETE',
    headers: jsonHeaders(token),
  });
  await assertOk(res, `Deleting "${key}"`);
};

/** Deletes a whole group: all members, its manifest and its registry entry. */
export const deleteGroup = async (serviceUrl: string, token: string, group: string): Promise<number> => {
  const res = await fetch(`${serviceUrl}/secrets/${encodeURIComponent(group)}`, {
    method: 'DELETE',
    headers: jsonHeaders(token),
  });
  await assertOk(res, `Deleting group "${group}"`);
  const body = (await res.json()) as { deleted?: number };
  return body.deleted ?? 0;
};

const RETRYABLE = (status: number) => status >= 500 || status === 429;
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const readGroupWithRetry = async (serviceUrl: string, token: string, group: string, maxRetries = 3): Promise<Record<string, string>> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const res = await fetch(`${serviceUrl}/secrets/${encodeURIComponent(group)}`, {
      headers: jsonHeaders(token),
    });
    if (res.ok) return (await res.json()) as Record<string, string>;

    if (RETRYABLE(res.status) && attempt < maxRetries) {
      console.log(`Retrying "${group}" (${res.status}, attempt ${attempt}/${maxRetries})...`);
      await delay(1000 * attempt);
      continue;
    }
    throw new Error(`Failed to fetch secret group "${group}": ${res.status} ${res.statusText}`);
  }
  throw new Error(`Failed to fetch secret group "${group}" after ${maxRetries} attempts`);
};

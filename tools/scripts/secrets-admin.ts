#!/usr/bin/env bun
/**
 * Secrets Manager CLI  —  `bun secrets`
 *
 * Developers authenticate through the browser (Clerk); CI uses
 * SECRETS_MANAGER_API_KEY. Environments (testing / production) are stored in
 * .secrets-env, which is gitignored.
 */
import Enquirer from 'enquirer';
import fs from 'fs';
import path from 'path';
import { deleteGroup, deleteSecret, listGroups, readGroup, writeGroup } from '../workspace-plugin/src/executors/get-secrets/api-client';
import { getAuthToken } from '../workspace-plugin/src/executors/get-secrets/clerk-auth';
import {
  DEFAULT_ENVIRONMENT,
  MissingServiceUrlError,
  readConfig,
  removeEnvironment,
  resolveServiceUrl,
  SecretsConfig,
  setEnvironmentUrl,
  writeConfig,
} from '../workspace-plugin/src/executors/get-secrets/config';

const enquirer = new Enquirer();
const SERVICE_ID = 'secrets-admin';

const ask = <T>(question: Record<string, unknown>): Promise<T> => enquirer.prompt(question as never) as Promise<T>;

interface Session {
  url: string;
  env: string;
  token: string;
}

// ---------------------------------------------------------------- environments

const addEnvironment = async (config: SecretsConfig): Promise<SecretsConfig> => {
  const { name } = await ask<{ name: string }>({
    type: 'input',
    name: 'name',
    message: 'Environment name',
    initial: Object.keys(config.environments).length === 0 ? DEFAULT_ENVIRONMENT : 'production',
  });
  const { url } = await ask<{ url: string }>({
    type: 'input',
    name: 'url',
    message: `Service URL for "${name}"`,
    initial: config.environments[name] ?? 'https://',
  });

  const next = setEnvironmentUrl(config, name.trim(), url);
  writeConfig(next);
  console.log(`Saved "${name}" and made it current (.secrets-env is gitignored).`);
  return next;
};

const manageEnvironments = async (config: SecretsConfig): Promise<SecretsConfig> => {
  const names = Object.keys(config.environments);
  const { action } = await ask<{ action: string }>({
    type: 'select',
    name: 'action',
    message: `Environments (current: ${config.current})`,
    choices: [...names.map((n) => `Switch to ${n}`), 'Add or update an environment', ...(names.length ? ['Remove an environment'] : []), 'Back'],
  });

  if (action === 'Back') return config;
  if (action === 'Add or update an environment') return addEnvironment(config);

  if (action === 'Remove an environment') {
    const { name } = await ask<{ name: string }>({ type: 'select', name: 'name', message: 'Remove which?', choices: names });
    const next = removeEnvironment(config, name);
    writeConfig(next);
    console.log(`Removed "${name}".`);
    return next;
  }

  const target = action.replace(/^Switch to /, '');
  const next = { ...config, current: target };
  writeConfig(next);
  console.log(`Now using "${target}".`);
  return next;
};

const ensureConfigured = async (): Promise<SecretsConfig> => {
  let config = readConfig();
  while (!config.environments[config.current]) {
    console.log('No environment configured yet.\n');
    config = await addEnvironment(config);
  }
  return config;
};

// ---------------------------------------------------------------------- groups

const pickGroup = async (s: Session, message = 'Which group?'): Promise<string | null> => {
  const groups = await listGroups(s.url, s.token);
  if (groups.length === 0) {
    console.log('No secret groups exist yet. Use "Create a group" first.\n');
    return null;
  }
  const { group } = await ask<{ group: string }>({ type: 'select', name: 'group', message, choices: groups });
  return group;
};

const showGroups = async (s: Session): Promise<void> => {
  const groups = await listGroups(s.url, s.token);
  console.log(groups.length ? `\n  ${groups.join('\n  ')}\n` : '\nNo groups yet.\n');
};

const viewGroup = async (s: Session): Promise<void> => {
  const group = await pickGroup(s);
  if (!group) return;

  const secrets = await readGroup(s.url, s.token, group);
  const keys = Object.keys(secrets);
  console.log(`\n${group} — ${keys.length} key(s)\n`);
  keys.forEach((k) => console.log(`  ${k}=${secrets[k]}`));
  console.log('');
};

/** Collects key=value pairs until the user submits an empty key. */
const promptEntries = async (existing: Record<string, string> = {}): Promise<Record<string, string>> => {
  const entries: Record<string, string> = {};
  console.log('Enter key/value pairs. Leave the key blank to finish.\n');

  for (;;) {
    const { key } = await ask<{ key: string }>({ type: 'input', name: 'key', message: 'Key' });
    if (!key.trim()) break;

    const { value } = await ask<{ value: string }>({
      type: 'input',
      name: 'value',
      message: `Value for ${key.trim()}`,
      initial: existing[key.trim()] ?? '',
    });
    entries[key.trim()] = value;
  }
  return entries;
};

const createGroup = async (s: Session): Promise<void> => {
  const existing = await listGroups(s.url, s.token);
  const { group } = await ask<{ group: string }>({ type: 'input', name: 'group', message: 'New group name' });
  const name = group.trim();
  if (!name) return;

  if (existing.includes(name)) {
    console.log(`"${name}" already exists — use "Set a secret" to add keys to it.\n`);
    return;
  }

  const entries = await promptEntries();
  if (Object.keys(entries).length === 0) {
    console.log('No keys entered; nothing created.\n');
    return;
  }

  await writeGroup(s.url, s.token, name, entries);
  console.log(`Created "${name}" with ${Object.keys(entries).length} key(s).\n`);
};

const removeGroup = async (s: Session): Promise<void> => {
  const group = await pickGroup(s, 'Delete which group?');
  if (!group) return;

  const secrets = await readGroup(s.url, s.token, group);
  const count = Object.keys(secrets).length;

  // Deleting a group is unrecoverable, so require the name to be retyped.
  const { typed } = await ask<{ typed: string }>({
    type: 'input',
    name: 'typed',
    message: `This deletes ${count} secret(s) permanently. Type "${group}" to confirm`,
  });
  if (typed.trim() !== group) {
    console.log('Name did not match; nothing deleted.\n');
    return;
  }

  const deleted = await deleteGroup(s.url, s.token, group);
  console.log(`Deleted "${group}" (${deleted} secret(s)).\n`);
};

// --------------------------------------------------------------------- secrets

const setSecret = async (s: Session): Promise<void> => {
  const groups = await listGroups(s.url, s.token);
  if (groups.length === 0) {
    console.log('No groups yet — use "Create a group" first.\n');
    return;
  }

  const { group } = await ask<{ group: string }>({ type: 'select', name: 'group', message: 'Which group?', choices: groups });
  const existing = await readGroup(s.url, s.token, group);
  const entries = await promptEntries(existing);

  if (Object.keys(entries).length === 0) {
    console.log('Nothing entered.\n');
    return;
  }

  // The service replaces the whole group, so merge before writing.
  await writeGroup(s.url, s.token, group, { ...existing, ...entries });
  console.log(`Updated ${Object.keys(entries).length} key(s) in "${group}".\n`);
};

const removeSecret = async (s: Session): Promise<void> => {
  const group = await pickGroup(s);
  if (!group) return;

  const secrets = await readGroup(s.url, s.token, group);
  const keys = Object.keys(secrets);
  if (keys.length === 0) {
    console.log('Group is empty.\n');
    return;
  }

  const { key } = await ask<{ key: string }>({ type: 'select', name: 'key', message: 'Delete which key?', choices: keys });
  const { confirmed } = await ask<{ confirmed: boolean }>({
    type: 'confirm',
    name: 'confirmed',
    message: `Delete ${key} from ${group}?`,
    initial: false,
  });
  if (!confirmed) return;

  await deleteSecret(s.url, s.token, group, key);
  console.log(`Deleted ${key}.\n`);
};

const exportGroup = async (s: Session): Promise<void> => {
  const group = await pickGroup(s, 'Export which group?');
  if (!group) return;

  const { target } = await ask<{ target: string }>({
    type: 'input',
    name: 'target',
    message: 'Write to which file?',
    initial: `apps/${group}/.env`,
  });

  const secrets = await readGroup(s.url, s.token, group);
  const body = Object.entries(secrets)
    .map(([k, v]) => `${k}=${/[\s"'#]/.test(v) ? `"${v.replace(/"/g, '\\"')}"` : v}`)
    .join('\n');

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, body + '\n', 'utf8');
  console.log(`Wrote ${Object.keys(secrets).length} secret(s) to ${target}\n`);
};

// ------------------------------------------------------------------------ menu

const ACTIONS: Record<string, (s: Session) => Promise<void>> = {
  'List groups': showGroups,
  'View a group': viewGroup,
  'Create a group': createGroup,
  'Set a secret': setSecret,
  'Delete a secret': removeSecret,
  'Delete a group': removeGroup,
  'Export a group to .env': exportGroup,
};

const mainMenu = async (session: Session): Promise<'continue' | 'reconnect' | 'quit'> => {
  const { action } = await ask<{ action: string }>({
    type: 'select',
    name: 'action',
    message: `secrets [${session.env}] ${session.url}`,
    choices: [...Object.keys(ACTIONS), 'Manage environments', 'Quit'],
  });

  if (action === 'Quit') return 'quit';
  if (action === 'Manage environments') {
    const before = readConfig().current;
    const after = await manageEnvironments(readConfig());
    // Switching environments means a different service and a different token.
    return after.current === before ? 'continue' : 'reconnect';
  }

  try {
    await ACTIONS[action](session);
  } catch (error) {
    console.error(`\n${(error as Error).message}\n`);
  }
  return 'continue';
};

const connect = async (): Promise<Session> => {
  const config = await ensureConfigured();
  const url = resolveServiceUrl();
  const token = await getAuthToken(url, SERVICE_ID);
  return { url, env: config.current, token };
};

const main = async (): Promise<void> => {
  let session = await connect();

  for (;;) {
    const next = await mainMenu(session);
    if (next === 'quit') return;
    if (next === 'reconnect') session = await connect();
  }
};

main().catch((error) => {
  if (error instanceof MissingServiceUrlError) {
    console.error(`\n${error.message}`);
    process.exit(1);
  }
  // Enquirer throws an empty string when the user hits Ctrl-C.
  if (!error || (typeof error === 'string' && error === '')) process.exit(0);
  console.error(`\n${(error as Error).message ?? error}`);
  process.exit(1);
});

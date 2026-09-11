# intern-4a — Guide Sheet

Nx monorepo. **Bun** is the package manager. Frontend deploys to **Vercel**, database is **Cloudflare D1**.

---

## 1. Project init

```bash
bun install                                  # once, after cloning
bunx nx g @nx/next:app apps/my-project       # generate
bun install                                  # new app = new workspace member
bunx nx dev @intern-4a/my-project
```

Defaults come from `nx.json` — Tailwind, ESLint, Jest, Playwright. No flags needed.
Your app is named `@intern-4a/my-project`; the scope is derived from the root `package.json`.

### Targets

| Command | What |
|---|---|
| `bunx nx dev @intern-4a/<app>` | dev server |
| `bunx nx build @intern-4a/<app>` | production build |
| `bunx nx test @intern-4a/<app>` | Jest unit tests |
| `bunx nx e2e @intern-4a/<app>-e2e` | Playwright |
| `bunx nx lint @intern-4a/<app>` | ESLint |
| `bunx nx typecheck @intern-4a/<app>` | tsc |

### Rules

- **Always generate, never copy an app from another monorepo.** Older Pinecone repos ship `project.json` + `.eslintrc.json`; a single unresolvable executor in a `project.json` breaks the project graph for *everyone*.
- Every app needs its own `package.json`. That's what makes it a workspace member.
- App dependencies go in `apps/<app>/package.json`, then `bun install` at the root.
- After changing `nx.json`, dependencies, or targets: `bun install && bunx nx reset`.

---

## 2. Secrets

Secrets live in a hosted **secrets-manager-service**. Nothing sensitive is ever committed.

### One-time setup

```bash
bun secrets        # "Manage environments" → add one, paste the service URL
```

That writes `.secrets-env` (gitignored). Your browser opens for sign-in with the
account on the service's allowlist; the token is cached under `cache/secrets-manager/`.

### Managing secrets

```bash
bun secrets
```

The prompt shows which environment you're on: `secrets [testing] https://...`

| Action | What it does |
|---|---|
| List groups | every group on this environment |
| View a group | prints keys **and values** in plaintext |
| Create a group | new group + its first keys |
| Set a secret | add or update keys in an existing group |
| Delete a secret | remove one key |
| Delete a group | removes the group and every key in it |
| Export a group to .env | writes a group straight to a file |
| Manage environments | switch, add, or remove an environment |

Secrets are organised into **groups** — one group per app by convention.
When entering keys, submit a blank key to finish.

Deleting a group asks you to retype its name. It removes every secret in the
group and cannot be undone.

### Environments

`.secrets-env` holds named environments and which one you're using:

```json
{
  "current": "testing",
  "environments": {
    "testing": "https://secrets-test.<you>.workers.dev",
    "production": "https://secrets.<you>.workers.dev"
  }
}
```

Switching environments re-authenticates — a token from one service isn't valid
at the other. `nx get-secrets` prints the environment it pulled from, so check
that line before wondering why a value looks wrong.

Override without editing the file:

```bash
SECRETS_MANAGER_ENV=production bunx nx get-secrets @intern-4a/my-project
```

### Pulling secrets into an app

Declare a `get-secrets` target in your app's `package.json`:

```json
{
  "name": "@intern-4a/my-project",
  "nx": {
    "targets": {
      "get-secrets": {
        "executor": "@intern-4a/workspace-plugin:get-secrets",
        "options": {
          "path": "./apps/my-project/",
          "filename": ".env",
          "secrets": ["my-project"]
        }
      }
    }
  }
}
```

Then:

```bash
bunx nx get-secrets @intern-4a/my-project
```

Use `"filename": ".dev.vars"` instead of `.env` for Cloudflare Workers.
`secrets` accepts a list — groups merge left-to-right, so later groups win.

In CI, set `SECRETS_MANAGER_API_KEY` and `SECRETS_MANAGER_URL`; the executor skips the browser flow automatically.

---

## 3. Cloudflare D1

D1 is Cloudflare's SQLite. We access it with **Drizzle**.

> **Architecture note.** A Next.js app on Vercel *cannot* use a D1 binding — bindings only exist inside the Cloudflare runtime. Either put your API on Cloudflare Workers and call it from the Vercel frontend, or talk to D1 over its HTTP API. Don't expect `env.DB` to exist on Vercel.

### Create the database

```bash
bunx wrangler login
bunx wrangler d1 create my-project-db
```

Copy the returned `database_id` into `apps/my-project/wrangler.jsonc`:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "my-project",
  "compatibility_date": "2026-05-18",
  "compatibility_flags": ["nodejs_compat"],
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "my-project-db",
      "database_id": "<paste-id-here>"
    }
  ]
}
```

The `database_id` is not a secret. Your **API token** is — keep it in the secrets manager.

### Schema

`apps/my-project/src/db/schema/index.ts`:

```ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  isActive: integer('isActive', { mode: 'boolean' }).default(true),
});
```

SQLite types only — no `serial`, no `jsonb`, no `timestamp`.

### Drizzle config

`apps/my-project/drizzle.config.ts`:

```ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
    token: process.env.CLOUDFLARE_API_TOKEN!,
  },
  schema: 'apps/my-project/src/db/schema/index.ts',
  out: 'apps/my-project/drizzle',
});
```

Those three values come from `bunx nx get-secrets`. Never hardcode them.

### Migrations

```bash
bunx drizzle-kit generate --config apps/my-project/drizzle.config.ts   # write SQL
bunx wrangler d1 migrations apply my-project-db --local                # local
bunx wrangler d1 migrations apply my-project-db --remote               # production
```

Review the generated SQL before applying it remotely. `drizzle-kit push` skips migration files — fine locally, avoid it against production.

### Client

```ts
import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

export const getDb = (env: { DB: D1Database }) => drizzle(env.DB, { schema });
```

Pass the binding in from the request context rather than reaching for a module-level singleton — Workers isolates don't share state the way a Node server does.

### Local development

```bash
bunx wrangler dev                                        # local D1, no network
bunx wrangler d1 execute my-project-db --local --command "SELECT * FROM users"
```

Local D1 state lives in `.wrangler/` — gitignored, safe to delete to reset.

---

## 4. A GraphQL API on D1

This is the pattern the main Pinecone monorepo uses: a Next.js app whose only
job is a GraphQL endpoint, deployed to **Cloudflare** (not Vercel) so it can bind
to D1 directly.

```
apps/my-api/
├── src/
│   ├── app/api/graphql/route.ts   # the endpoint
│   ├── db/
│   │   ├── drizzle.ts             # client bound to env.DB
│   │   ├── index.ts               # re-exports schemas
│   │   └── user.schema.ts
│   └── graphql/
│       ├── index.ts               # merged typeDefs + resolvers
│       ├── schema/
│       └── resolvers/
│           ├── queries/
│           └── mutations/
├── drizzle.config.ts
└── wrangler.jsonc
```

### 1. Generate and set up D1

```bash
bunx nx g @nx/next:app apps/my-api
bunx wrangler d1 create my-api-testing
```

`apps/my-api/wrangler.jsonc` — note the per-environment names:

```jsonc
{
  "name": "my-api",
  "main": "worker/index.ts",
  "compatibility_date": "2026-02-12",
  "compatibility_flags": ["nodejs_compat"],
  "d1_databases": [
    { "binding": "DB", "database_id": "<id>", "database_name": "my-api-testing" }
  ],
  "env": {
    "testing": { "name": "my-api-test" },
    "production": { "name": "my-api-prod" }
  }
}
```

### 2. Schema

`src/db/user.schema.ts`:

```ts
import { sql } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const User = sqliteTable('user', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
  createdAt: text('createdAt').default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

export type UserTable = typeof User.$inferSelect;
```

`src/db/index.ts` re-exports every schema file:

```ts
export * from './user.schema';
```

### 3. Database client

`src/db/drizzle.ts`:

```ts
import { env } from 'cloudflare:workers';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from './index';

export const runtime = 'edge';

export const DB = drizzle(env.DB, { schema });
```

`cloudflare:workers` is the current way to reach bindings — it works at module
scope, so you don't have to thread a request context through every resolver.

### 4. GraphQL endpoint

`src/app/api/graphql/route.ts`:

```ts
import { resolvers, typeDefs } from '@/graphql';
import { buildASTSchema, graphql } from 'graphql';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

type GraphqlRequest = {
  query: string;
  variables?: Record<string, unknown>;
  operationName?: string;
};

const handler = async (req: NextRequest) => {
  // A GET in the browser opens Apollo Sandbox against this endpoint.
  if (req.method !== 'POST') {
    return NextResponse.redirect(
      `https://studio.apollographql.com/sandbox/explorer?endpoint=${req.url}`,
      302
    );
  }

  const { query, variables, operationName } = (await req.json()) as GraphqlRequest;

  const response = await graphql({
    schema: buildASTSchema(typeDefs),
    source: query,
    rootValue: { ...resolvers.Query, ...resolvers.Mutation },
    variableValues: variables,
    operationName,
  });

  return NextResponse.json(response);
};

export const GET = handler;
export const POST = handler;
```

This calls `graphql()` from graphql-js directly rather than running an Apollo
Server instance — it's much lighter, which matters on the edge runtime.

### 5. Schema and resolvers

`src/graphql/schema/user.schema.ts`:

```ts
import gql from 'graphql-tag';

export const userTypeDefs = gql`
  type User {
    id: String!
    email: String!
    createdAt: String!
  }

  type Query {
    getUsers: [User!]!
  }

  type Mutation {
    createUser(email: String!): User!
  }
`;
```

`src/graphql/resolvers/queries/get-users.ts`:

```ts
import { DB } from '@/db/drizzle';
import { User } from '@/db';

export const getUsers = async () => DB.select().from(User).all();
```

`src/graphql/index.ts` merges everything:

```ts
import { mergeTypeDefs } from '@graphql-tools/merge';
import { userTypeDefs } from './schema/user.schema';
import { getUsers } from './resolvers/queries/get-users';
import { createUser } from './resolvers/mutations/create-user';

export const typeDefs = mergeTypeDefs([userTypeDefs]);
export const resolvers = {
  Query: { getUsers },
  Mutation: { createUser },
};
```

Because the route passes resolvers as `rootValue`, each resolver's **first**
argument is the GraphQL arguments object — not `parent`. This trips people up:

```ts
export const createUser = async ({ email }: { email: string }) => { ... };
```

### 6. Migrations

`apps/my-api/drizzle.config.ts`:

```ts
import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';
import { resolve } from 'path';

config({ path: resolve(__dirname, '.dev.vars') });

export default defineConfig({
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: process.env.ACCOUNT_ID!,
    databaseId: process.env.DATABASE_ID!,
    token: process.env.TOKEN!,
  },
  schema: 'apps/my-api/src/db/index.ts',
  out: 'apps/my-api/drizzle',
});
```

`ACCOUNT_ID`, `DATABASE_ID` and `TOKEN` come from the secrets manager into
`.dev.vars` — never hardcode them:

```json
"get-secrets": {
  "executor": "@intern-4a/workspace-plugin:get-secrets",
  "options": { "path": "./apps/my-api/", "filename": ".dev.vars", "secrets": ["my-api"] }
}
```

```bash
bunx nx get-secrets @intern-4a/my-api
bunx drizzle-kit generate --config apps/my-api/drizzle.config.ts
bunx wrangler d1 migrations apply my-api-testing --local     # local first
bunx wrangler d1 migrations apply my-api-testing --remote
```

### 7. Run it

```bash
bunx nx dev @intern-4a/my-api      # http://localhost:3000/api/graphql
```

Open that URL in a browser and it redirects to Apollo Sandbox. Query with:

```graphql
query { getUsers { id email createdAt } }
```

### Gotchas

- **`env.DB` is undefined on Vercel.** Bindings only exist in the Cloudflare
  runtime. A GraphQL API on D1 deploys to Cloudflare; your frontend on Vercel
  calls it over HTTP.
- **SQLite types only** — no `serial`, `jsonb` or `timestamp`. Use
  `text` with `sql\`(CURRENT_TIMESTAMP)\`` for times.
- **`export const runtime = 'edge'`** on the route, or the build pulls in Node
  APIs that don't exist on Workers.
- **Apply migrations `--local` before `--remote`.** Local D1 lives in
  `.wrangler/`, so a mistake costs nothing; delete the folder to start over.

---

## 5. Vercel deployment

Frontend only. Three projects per app: `<app>-dev`, `<app>-testing`, `<app>-prod`.

| Setting | Value |
|---|---|
| Build command | `bunx nx build --skip-nx-cache @intern-4a/<app>` |
| Output directory | `dist/apps/<app>/.next` |
| Install command | `bun install` |
| Root directory | repository root (**not** the app folder) |

Root directory must stay at the repo root — Nx needs the whole workspace to resolve the project graph.

Environment variables go in the Vercel dashboard, not in `.env`. Pull them from the secrets manager and paste, or script it with the Vercel CLI. Anything named `NEXT_PUBLIC_*` ships to the browser — never put a secret behind that prefix.

---

## Troubleshooting

**`Cannot find configuration for task <project>:<target>`**
The plugin providing that target isn't installed, or the cache is stale. Nx silently skips plugins it can't resolve. Run `bun install && bunx nx reset`.

**`No secrets service configured`**
Run `bun secrets` → "Manage environments", or set `SECRETS_MANAGER_URL`.

**403 from the secrets service**
Either your cached token expired, or your address isn't on the service's allowlist. Delete `cache/secrets-manager/token.json` and sign in again. If it persists, whoever runs the service can check `wrangler tail` — the Worker logs the specific reason, which the 403 deliberately doesn't reveal.

**Secrets look wrong, or belong to another environment**
Check the environment line `nx get-secrets` printed, then `bun secrets` → "Manage environments" to see which one is current.

**App doesn't appear in `bunx nx show projects`**
It's missing a `package.json`, or it has a `project.json` referencing an executor that doesn't exist here.

**`env.DB is undefined` in a resolver**
The app is running somewhere without a D1 binding — Vercel, or `nx dev` without Wrangler. Use `bunx wrangler dev` for anything that touches the database.

**`no such table` after adding a schema**
Migrations weren't applied. `drizzle-kit generate` only writes the SQL; `wrangler d1 migrations apply` runs it — and `--local` and `--remote` are separate databases.

**A resolver's arguments are undefined**
The route passes resolvers as `rootValue`, so the first parameter is the arguments object, not `parent`. See section 4.

**D1 binding is undefined on Vercel**
Expected — see the architecture note in section 3.

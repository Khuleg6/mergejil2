# intern-4a — Гарын авлага

Nx monorepo. Багц удирдагч нь **Bun**. Frontend нь **Vercel** дээр deploy хийгддэг, өгөгдлийн сан нь **Cloudflare D1**.

> Энэ бол [GUIDE.md](./GUIDE.md)-ийн монгол орчуулга. Тушаал, код нь ижил.

---

## 1. Төсөл эхлүүлэх

```bash
bun install                                  # clone хийсний дараа нэг удаа
bunx nx g @nx/next:app apps/my-project       # шинэ app үүсгэх
bun install                                  # шинэ app = шинэ workspace гишүүн
bunx nx dev @intern-4a/my-project
```

Тохиргоо нь `nx.json`-оос ирнэ — Tailwind, ESLint, Jest, Playwright. Нэмэлт flag шаардлагагүй.
App-ийн нэр `@intern-4a/my-project` болно; scope нь үндсэн `package.json`-оос гарна.

### Target-ууд

| Тушаал | Юу хийдэг |
|---|---|
| `bunx nx dev @intern-4a/<app>` | dev server |
| `bunx nx build @intern-4a/<app>` | production build |
| `bunx nx test @intern-4a/<app>` | Jest unit тест |
| `bunx nx e2e @intern-4a/<app>-e2e` | Playwright |
| `bunx nx lint @intern-4a/<app>` | ESLint |
| `bunx nx typecheck @intern-4a/<app>` | tsc |

### Дүрэм

- **Үргэлж generator ашиглаж үүсгэ, өөр monorepo-оос app хуулж болохгүй.** Хуучин Pinecone repo-нууд `project.json` болон `.eslintrc.json`-той ирдэг; `project.json` доторх нэг л шийдэгдэхгүй executor нь **бүх хүний** project graph-ийг эвддэг.
- App бүрд өөрийн `package.json` заавал хэрэгтэй. Энэ нь түүнийг workspace гишүүн болгодог.
- App-ийн dependency-г `apps/<app>/package.json`-д нэмээд, дараа нь үндсэн хавтаст `bun install` ажиллуул.
- `nx.json`, dependency эсвэл target өөрчилсний дараа: `bun install && bunx nx reset`.

---

## 2. Нууц утгууд (Secrets)

Нууц утгууд нь hosted **secrets-manager-service** дээр хадгалагдана. Ямар ч нууц зүйлийг git-д commit хийдэггүй.

### Анхны тохиргоо (нэг удаа)

```bash
bun secrets        # "Manage environments" → нэг нэмээд, service URL-ээ оруул
```

Энэ нь `.secrets-env` файл үүсгэнэ (gitignore-д байгаа). Browser нээгдэж, service-ийн зөвшөөрөгдсөн жагсаалтад байгаа хаягаараа нэвтэрнэ; token нь `cache/secrets-manager/` дор хадгалагдана.

### Нууц утгуудыг удирдах

```bash
bun secrets
```

Prompt дээр аль environment дээр байгааг харуулна: `secrets [testing] https://...`

| Үйлдэл | Юу хийдэг |
|---|---|
| List groups | энэ environment дэх бүх группыг харуулна |
| View a group | key болон **утгыг** ил харуулна |
| Create a group | шинэ групп + эхний key-үүд |
| Set a secret | байгаа группд key нэмэх/шинэчлэх |
| Delete a secret | нэг key устгах |
| Delete a group | группыг бүх key-тэй нь устгах |
| Export a group to .env | группыг шууд файл руу бичих |
| Manage environments | environment солих, нэмэх, устгах |

Нууц утгуудыг **групп**-ээр зохион байгуулна — ерөнхийдөө app тутамд нэг групп.
Key оруулж байхдаа хоосон key илгээвэл дуусна.

Групп устгахад нэрийг нь дахин бичихийг шаардана. Энэ нь группын бүх нууц утгыг устгах бөгөөд **буцаах боломжгүй**.

### Environment-ууд

`.secrets-env` файл нь нэрлэсэн environment-уудыг болон аль нь идэвхтэй байгааг хадгална:

```json
{
  "current": "testing",
  "environments": {
    "testing": "https://secrets-test.<you>.workers.dev",
    "production": "https://secrets.<you>.workers.dev"
  }
}
```

Environment солиход дахин нэвтрэх шаардлагатай — нэг service-ийн token нөгөө дээр нь ажиллахгүй. `nx get-secrets` нь аль environment-оос татсанаа хэвлэдэг тул утга буруу санагдвал эхлээд тэр мөрийг шалга.

Файлыг өөрчлөхгүйгээр дарж бичих:

```bash
SECRETS_MANAGER_ENV=production bunx nx get-secrets @intern-4a/my-project
```

### Нууц утгуудыг app руу татах

App-ийнхаа `package.json`-д `get-secrets` target зарла:

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

Дараа нь:

```bash
bunx nx get-secrets @intern-4a/my-project
```

Cloudflare Worker-ийн хувьд `.env`-ийн оронд `"filename": ".dev.vars"` ашигла.
`secrets` нь жагсаалт хүлээж авдаг — группууд зүүнээс баруун тийш нийлдэг тул сүүлийнх нь давамгайлна.

CI дээр `SECRETS_MANAGER_API_KEY` болон `SECRETS_MANAGER_URL`-ийг тохируул; executor нь browser-ээр нэвтрэх алхмыг автоматаар алгасна.

---

## 3. Cloudflare D1

D1 бол Cloudflare-ийн SQLite. Бид үүнд **Drizzle**-ээр хандана.

> **Архитектурын анхааруулга.** Vercel дээрх Next.js app нь D1 binding ашиглаж **чадахгүй** — binding нь зөвхөн Cloudflare runtime дотор л оршдог. API-гаа Cloudflare Workers дээр байрлуулж Vercel frontend-ээсээ дуудах, эсвэл D1-тэй HTTP API-аар харилцах хэрэгтэй. Vercel дээр `env.DB` байна гэж бүү найд.

### Өгөгдлийн сан үүсгэх

```bash
bunx wrangler login
bunx wrangler d1 create my-project-db
```

Буцаж ирсэн `database_id`-г `apps/my-project/wrangler.jsonc` руу хуул:

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

`database_id` нь нууц биш. Харин таны **API token** нууц — түүнийг secrets manager-т хадгал.

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

Зөвхөн SQLite төрлүүд — `serial`, `jsonb`, `timestamp` байхгүй.

### Drizzle тохиргоо

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

Эдгээр гурван утга нь `bunx nx get-secrets`-ээс ирнэ. Хэзээ ч кодод шууд бичиж болохгүй.

### Migration

```bash
bunx drizzle-kit generate --config apps/my-project/drizzle.config.ts   # SQL үүсгэх
bunx wrangler d1 migrations apply my-project-db --local                # локал
bunx wrangler d1 migrations apply my-project-db --remote               # production
```

Remote дээр ажиллуулахаасаа өмнө үүссэн SQL-ээ шалга. `drizzle-kit push` нь migration файл алгасдаг — локал дээр зүгээр ч production дээр бүү ашигла.

### Client

```ts
import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

export const getDb = (env: { DB: D1Database }) => drizzle(env.DB, { schema });
```

Binding-ийг module-level singleton болгохын оронд request context-оос дамжуул — Workers isolate нь Node server шиг төлөвөө хуваалцдаггүй.

### Локал хөгжүүлэлт

```bash
bunx wrangler dev                                        # локал D1, интернэт шаардахгүй
bunx wrangler d1 execute my-project-db --local --command "SELECT * FROM users"
```

Локал D1 өгөгдөл нь `.wrangler/` дотор байрлана — gitignore-д байгаа, дахин эхлүүлэхийн тулд устгаж болно.

---

## 4. D1 дээр ажиллах GraphQL API

Энэ бол үндсэн Pinecone monorepo-д ашигладаг загвар: зөвхөн GraphQL endpoint-ийн үүрэгтэй Next.js app бөгөөд D1-тэй шууд холбогдохын тулд **Cloudflare** дээр (Vercel биш) deploy хийгддэг.

```
apps/my-api/
├── src/
│   ├── app/api/graphql/route.ts   # endpoint
│   ├── db/
│   │   ├── drizzle.ts             # env.DB-тэй холбогдсон client
│   │   ├── index.ts               # schema-уудыг re-export хийнэ
│   │   └── user.schema.ts
│   └── graphql/
│       ├── index.ts               # нэгтгэсэн typeDefs + resolvers
│       ├── schema/
│       └── resolvers/
│           ├── queries/
│           └── mutations/
├── drizzle.config.ts
└── wrangler.jsonc
```

### 1. App үүсгээд D1 тохируулах

```bash
bunx nx g @nx/next:app apps/my-api
bunx wrangler d1 create my-api-testing
```

`apps/my-api/wrangler.jsonc` — environment тус бүрийн нэрийг анхаар:

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

`src/db/index.ts` нь schema файл бүрийг re-export хийнэ:

```ts
export * from './user.schema';
```

### 3. Өгөгдлийн сангийн client

`src/db/drizzle.ts`:

```ts
import { env } from 'cloudflare:workers';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from './index';

export const runtime = 'edge';

export const DB = drizzle(env.DB, { schema });
```

`cloudflare:workers` бол binding-д хандах одоогийн арга — module scope дээр ажилладаг тул resolver бүрээр request context дамжуулах шаардлагагүй.

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
  // Browser дээр GET хийвэл энэ endpoint рүү Apollo Sandbox нээнэ.
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

Энэ нь Apollo Server ажиллуулахын оронд graphql-js-ийн `graphql()`-ийг шууд дуудаж байна — хамаагүй хөнгөн бөгөөд edge runtime дээр энэ нь чухал.

### 5. Schema болон resolver-ууд

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

`src/graphql/index.ts` нь бүгдийг нэгтгэнэ:

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

Route нь resolver-уудыг `rootValue` болгож дамжуулдаг тул resolver бүрийн **эхний** параметр нь GraphQL-ийн argument объект байна — `parent` **биш**. Энд ихэнх хүн эндүүрдэг:

```ts
export const createUser = async ({ email }: { email: string }) => { ... };
```

### 6. Migration

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

`ACCOUNT_ID`, `DATABASE_ID`, `TOKEN` нь secrets manager-ээс `.dev.vars` руу ирнэ — хэзээ ч кодод шууд бичиж болохгүй:

```json
"get-secrets": {
  "executor": "@intern-4a/workspace-plugin:get-secrets",
  "options": { "path": "./apps/my-api/", "filename": ".dev.vars", "secrets": ["my-api"] }
}
```

```bash
bunx nx get-secrets @intern-4a/my-api
bunx drizzle-kit generate --config apps/my-api/drizzle.config.ts
bunx wrangler d1 migrations apply my-api-testing --local     # эхлээд локал
bunx wrangler d1 migrations apply my-api-testing --remote
```

### 7. Ажиллуулах

```bash
bunx nx dev @intern-4a/my-api      # http://localhost:3000/api/graphql
```

Энэ URL-ийг browser дээр нээвэл Apollo Sandbox руу шилжинэ. Дараах байдлаар query хий:

```graphql
query { getUsers { id email createdAt } }
```

### Түгээмэл алдаанууд

- **Vercel дээр `env.DB` нь undefined байна.** Binding нь зөвхөн Cloudflare runtime дотор оршдог. D1 ашигладаг GraphQL API нь Cloudflare дээр deploy хийгддэг; Vercel дээрх frontend нь түүнийг HTTP-ээр дууддаг.
- **Зөвхөн SQLite төрлүүд** — `serial`, `jsonb`, `timestamp` байхгүй. Цаг хугацаанд `text` дээр `` sql`(CURRENT_TIMESTAMP)` `` ашигла.
- **Route дээр `export const runtime = 'edge'`** бич, эс бөгөөс build нь Workers дээр байхгүй Node API-уудыг татаж орж ирнэ.
- **Migration-г `--remote`-оос өмнө `--local` дээр ажиллуул.** Локал D1 нь `.wrangler/` дотор байдаг тул алдаа гаргах нь юу ч алдахгүй; дахин эхлэхийн тулд тэр хавтсыг устга.

---

## 5. Vercel deploy

Зөвхөн frontend. App тутамд гурван project: `<app>-dev`, `<app>-testing`, `<app>-prod`.

| Тохиргоо | Утга |
|---|---|
| Build command | `bunx nx build --skip-nx-cache @intern-4a/<app>` |
| Output directory | `dist/apps/<app>/.next` |
| Install command | `bun install` |
| Root directory | repo-гийн үндсэн хавтас (**app-ийн хавтас биш**) |

Root directory нь repo-гийн үндсэн хавтас хэвээр байх ёстой — Nx нь project graph-ийг шийдэхийн тулд бүх workspace-ийг шаарддаг.

Environment хувьсагчдыг `.env`-д биш Vercel dashboard дээр оруул. Secrets manager-ээс татаад хуулах эсвэл Vercel CLI-аар script бич. `NEXT_PUBLIC_*` нэртэй бүх зүйл browser руу очдог — нууц утгыг хэзээ ч энэ угтвартай бүү нэрлэ.

---

## Асуудал шийдвэрлэх

**`Cannot find configuration for task <project>:<target>`**
Тухайн target-ийг өгдөг plugin суугаагүй, эсвэл cache хуучирсан байна. Nx нь шийдэж чадахгүй plugin-ыг чимээгүй алгасдаг. `bun install && bunx nx reset` ажиллуул.

**`No secrets service configured`**
`bun secrets` → "Manage environments" сонго, эсвэл `SECRETS_MANAGER_URL`-ийг тохируул.

**Secrets service-ээс 403 ирж байна**
Cache-д хадгалсан token хугацаа дууссан, эсвэл таны хаяг зөвшөөрөгдсөн жагсаалтад байхгүй байна. `cache/secrets-manager/token.json`-ийг устгаад дахин нэвтэр. Хэвээр байвал service-ийг ажиллуулж буй хүн `wrangler tail`-аар шалгаж болно — Worker нь тодорхой шалтгааныг лог руу бичдэг, харин 403 хариу нь зориудаар үүнийг харуулдаггүй.

**Secrets буруу байна, эсвэл өөр environment-ийнх юм шиг байна**
`nx get-secrets` хэвлэсэн environment мөрийг шалгаад, `bun secrets` → "Manage environments" дээр аль нь идэвхтэй байгааг хар.

**`bunx nx show projects` дээр app харагдахгүй байна**
`package.json` дутуу байна, эсвэл энд байхгүй executor-ыг зааж буй `project.json` байна.

**Resolver дотор `env.DB is undefined`**
App нь D1 binding байхгүй газар ажиллаж байна — Vercel дээр, эсвэл Wrangler-гүйгээр `nx dev` хийсэн байна. Өгөгдлийн сан хөндөх бүх зүйлд `bunx wrangler dev` ашигла.

**Schema нэмсний дараа `no such table` гарч байна**
Migration ажиллаагүй байна. `drizzle-kit generate` нь зөвхөн SQL бичдэг; `wrangler d1 migrations apply` нь түүнийг ажиллуулдаг — мөн `--local` болон `--remote` нь тусдаа өгөгдлийн сан гэдгийг санаарай.

**Resolver-ийн argument нь undefined байна**
Route нь resolver-уудыг `rootValue` болгож дамжуулдаг тул эхний параметр нь `parent` биш, argument объект юм. 4-р хэсгийг үз.

**Vercel дээр D1 binding нь undefined байна**
Ийм байх ёстой — 3-р хэсэг дэх архитектурын анхааруулгыг үз.

# AGENTS.md

Instructions for AI coding agents working in this repository.
Human-facing docs: [GUIDE.md](./GUIDE.md) · [GUIDE-MNG.md](./GUIDE-MNG.md)

This is a **shared teaching monorepo**. Several interns work in it at once, and a
mistake in a shared file breaks everyone's build, not just the one you're helping.
Prefer the narrow change over the clever one.

---

## Facts about this repo

| | |
|---|---|
| Monorepo tool | Nx 22 |
| Package manager | **Bun** — never npm or yarn |
| Framework | Next.js 16, App Router, React 19 |
| Unit tests | Jest |
| E2E | Playwright (**not** Cypress — it was removed) |
| Styling | Tailwind (except `apps/documentation`, which uses MUI) |
| Database | Cloudflare D1 via Drizzle |
| Frontend deploy | Vercel |
| API deploy | Cloudflare Workers |
| Lint | ESLint **flat config** (`eslint.config.mjs`) |
| Package scope | `@intern-4a/*`, derived from the root `package.json` name |

Targets are **inferred by Nx plugins**, not declared. There are no `project.json`
files and there should never be one.

---

## Hard rules

Violating any of these breaks the workspace for every intern.

### Never create a `project.json`

Nx resolves targets from plugins listed in `nx.json`. A `project.json` that names
an executor which isn't installed makes project-graph construction fail for the
**entire workspace** — every intern gets `Cannot find configuration for task`,
and the error never mentions the file that caused it.

If a project needs a custom target, add it to that app's `package.json`:

```json
{
  "name": "@intern-4a/my-app",
  "nx": {
    "targets": {
      "get-secrets": { "executor": "@intern-4a/workspace-plugin:get-secrets", "options": {} }
    }
  }
}
```

### Never create `.eslintrc.json` or `.eslintrc.*`

This repo uses flat config. Legacy configs are silently ignored at best, and at
worst extend a file that doesn't exist. Each app has an `eslint.config.mjs`;
copy that shape.

### Never copy an app from another monorepo

Older Pinecone repos (`pinecone-monorepo`, previous intern cohorts) use a
different Nx generation. Their apps carry `project.json`, `.eslintrc.json`, and
executors like `@pinecone-intern-monorepo/secrets:get` that don't exist here.
**Always generate:**

```bash
bunx nx g @nx/next:app apps/<name>
```

### Never commit secrets or build output

Already gitignored — do not add them back, and do not `git add -f` them:

```
.env  .env.local  .dev.vars  .secrets-env  /cache
.next  .vercel  .wrangler  .open-next  dist
```

Secrets belong in the secrets manager. If you need a value like
`CLOUDFLARE_API_TOKEN`, wire up a `get-secrets` target — never inline it, never
put it in `wrangler.jsonc`, never echo it into a file you're committing.

### Never use npm or yarn

`bun install`, `bunx nx ...`. Mixing package managers produces a competing
lockfile and a dependency tree that disagrees with everyone else's.

### Never touch another intern's app

`apps/` is shared. Only modify the app you were asked about, plus files clearly
belonging to it. Editing someone else's app is destructive even when the change
looks like an improvement.

---

## Ask before doing

Stop and ask the human first. These are shared or irreversible:

- Editing `nx.json`, the root `package.json`, `tsconfig.base.json`,
  `eslint.config.mjs`, or anything in `tools/`
- Adding a dependency to the **root** `package.json` (app deps go in the app's own)
- `wrangler d1 migrations apply --remote` — production data
- `wrangler delete`, `wrangler secret put`, deleting a KV namespace
- Deleting a secret group, or any `bun secrets` destructive action
- `git push`, force-pushing, rebasing shared branches, `git reset --hard`
- Deleting or renaming files you didn't create
- Anything that would change behaviour for other apps in the workspace

---

## Doing work correctly

### Creating an app

```bash
bunx nx g @nx/next:app apps/my-app   # generator only
bun install                          # new workspace member
bunx nx dev @intern-4a/my-app
```

Defaults (Tailwind, ESLint, Jest, Playwright) come from `nx.json` — don't pass
flags to override them without being asked.

### After changing config or dependencies

```bash
bun install && bunx nx reset
```

Nx caches the project graph aggressively. A stale cache produces errors that
look like missing code but are just old state. When something inexplicable
happens, reset before debugging further.

### Before saying you're finished

Run the checks, and report real output rather than assuming:

```bash
bunx nx lint      @intern-4a/<app>
bunx nx test      @intern-4a/<app>
bunx nx typecheck @intern-4a/<app>
bunx nx build     @intern-4a/<app>
```

If a check fails, **fix the code**. Do not:

- add `// eslint-disable` to silence a rule
- weaken or delete an assertion to make a test pass
- add `as any`, `@ts-ignore`, or `!` to get past a type error
- mark a test `.skip`

Any of these turn a real problem into a hidden one. If a rule genuinely
shouldn't apply, say so and ask.

---

## Domain rules that cause real bugs

### `env.DB` does not exist on Vercel

D1 bindings only exist inside the Cloudflare runtime. A Next.js app deployed to
Vercel cannot reach D1. If code needs the database, it belongs in a Cloudflare
Worker; the Vercel frontend calls it over HTTP. Never "fix" a missing binding by
adding a fallback that silently returns empty data.

### Use `bunx wrangler dev` for anything touching D1

`nx dev` has no bindings, so `env.DB` will be undefined. This is the single most
common cause of "the database isn't working".

### SQLite types only

Drizzle schemas here target SQLite: `text`, `integer`, `real`, `blob`.
No `serial`, `jsonb`, `timestamp`. For times use
``text('createdAt').default(sql`(CURRENT_TIMESTAMP)`)``.

### GraphQL resolvers receive args first

The route passes resolvers as `rootValue`, so a resolver's **first** parameter is
the arguments object, not `parent`:

```ts
export const createUser = async ({ email }: { email: string }) => { ... };
```

Writing `(_parent, { email })` gives you undefined arguments.

### `export const runtime = 'edge'`

Required on API routes and the D1 client module. Without it the build pulls in
Node APIs that don't exist on Workers, and it fails at deploy rather than locally.

### Migrations: `--local` before `--remote`

`drizzle-kit generate` only writes SQL. `wrangler d1 migrations apply` runs it.
Local and remote are separate databases. Read the generated SQL before applying
it remotely — a bad migration against remote is not undoable.

---

## Things that have actually gone wrong here

Real failures from setting this repo up. Recognise them rather than re-deriving.

**`Cannot find configuration for task X:Y`**
The plugin providing that target isn't installed, or the cache is stale. Nx
silently skips plugins it can't resolve, so the error names the task rather than
the cause. `bun install && bunx nx reset`.

**An app doesn't appear in `nx show projects`**
It has no `package.json`, or a `project.json` referencing a missing executor.

**A dependency "isn't installed" after editing `package.json`**
The install didn't actually run. Check timestamps: if `bun.lock` is older than
`package.json`, nothing was re-resolved. `rm -rf bun.lock node_modules && bun install`.

**Wrangler secrets vanish after renaming a worker**
Secrets are scoped to the worker `name` in `wrangler.jsonc`. Renaming leaves them
attached to the old worker and deploys a second one. `wrangler secret list`.

**Peer dependency conflicts on a clean install**
Bun tolerates mismatches npm rejects. `@cloudflare/workers-types` must match
wrangler's peer range (v5 for wrangler 4).

---

## How to find things out

Don't guess — this repo has specifics that differ from defaults:

- **What's installed** → read `package.json`. Don't assume a library is available.
- **What targets exist** → `bunx nx show project @intern-4a/<app>`
- **How something is done here** → read `GUIDE.md`, then look at `apps/sample`
  (the reference scaffold) or `apps/documentation` (a real app).
- **What an API returns** → call it once and look, rather than assuming a shape.
- **Why a request failed** → `bunx wrangler tail` for Worker logs.

When guide and code disagree, **the code is the truth** — and say so, so the
guide gets fixed.

---

## Style

- Named exports for components: `export const UserCard = () => {}`.
  Next.js pages and layouts are the exception and use default exports.
- Arrow-function components.
- PascalCase component files, camelCase hooks starting with `use`.
- Tests are `*.spec.ts` / `*.spec.tsx`.
- Keep files small and functions shallow. If a change makes a file much longer
  or more deeply nested, that's a sign to split it.
- Match the surrounding code. Consistency beats personal preference in a repo
  a dozen people are learning from.

---

## Working with the interns

These are students. Prefer explaining to silently fixing.

- When you correct something, say what was wrong and why — the point is that
  they learn the codebase, not that the diff is right.
- Prefer the smallest change that solves the problem.
- Don't refactor unrelated code you happened to notice. Mention it instead.
- If a request is ambiguous, ask. A wrong guess in a shared repo costs more
  than a question.
- If you're unsure whether something is safe, it belongs in "Ask before doing".

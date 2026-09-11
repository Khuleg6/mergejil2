# CLAUDE.md

Read [AGENTS.md](./AGENTS.md) — it is the single source of truth for how agents
should work in this repository. Everything in it applies here.

Human-facing documentation: [GUIDE.md](./GUIDE.md) (English) ·
[GUIDE-MNG.md](./GUIDE-MNG.md) (Монгол).

Quick reminders, all expanded in AGENTS.md:

- **Bun only.** `bun install`, `bunx nx ...` — never npm or yarn.
- **Generate apps**, never hand-create or copy from another monorepo.
- **No `project.json`, no `.eslintrc.json`** — one bad executor reference breaks
  the project graph for every intern.
- **Never commit** `.env`, `.dev.vars`, `.secrets-env`, `/cache`, or build output.
- **Ask first** before touching `nx.json`, the root `package.json`, `tools/`,
  or anything that runs against production.
- **Verify before claiming done**: `nx lint`, `nx test`, `nx typecheck`, `nx build`.
  Never silence a check to make it pass.
- This is a **shared teaching repo** — only modify the app you were asked about.
- **Strict Scope Limit:** Work exclusively within your assigned app directory (e.g., `apps/your-app-name`). Never modify, refactor, or touch code, configurations, or files belonging to other teams or shared components outside your specific app.
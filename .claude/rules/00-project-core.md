# project core

> Aabtaab stack, paths, agent config, and universal coding principles

**Always apply:** yes

# Project Core

## Stack

* **Runtime:** Node.js **24.17.0** (`.nvmrc`, engine requirements ≥22.12.0)
* **Framework:** **Next.js 16.2.12** (App Router, RSC, ISR, React Compiler 1.0)
* **UI:** **React 19.2.8** + **Inter** (`next/font`, LTR `en`)
* **Styling:** **Tailwind CSS v4.3.3** (single CSS entrypoint in `app/globals.css`)
* **CMS:** **Sanity 6.7** (embedded Studio at `/studio`)
* **Language:** **TypeScript 6.0.3** (primary) + **TypeScript 7.0.2** side-by-side (`typecheck:ts7`)
* **Linting:** **ESLint 10.8** + `eslint-config-next` 16.2.12
* **Validation:** **Zod**
* **Email:** **Resend** with **Nodemailer** fallback
* **Rate limiting:** **Upstash Redis** (distributed)
* **Spam Protection:** **Cloudflare Turnstile** (validated on backend)
* **Monitoring:** **Sentry**
* **Testing:** **Vitest** (unit) and **Playwright** (E2E)
* **Hosting:** **Hetzner VPS** (PM2 fork `aabtaab-next`, port **3000**)
* **Proxy / CDN:** **Cloudflare** + Apache → `127.0.0.1:3000`
* **CI/CD:** **GitHub Actions**

Full reference: [techstack.md](file:///Users/syedaalin/Documents/aabtaab/techstack.md) (dependencies, SEO, production, env vars).

## Paths

| Area | Location |
|------|----------|
| Site pages | `app/(site)/` |
| CMS schemas | `sanity/schemaTypes/` |
| CMS queries | `sanity/lib/queries/`, `lib/cms/queries.ts` |
| API routes | `app/api/` (contact, revalidate, draft) |
| Shared UI | `components/content/`, `components/layout/` |
| Design system | `app/globals.css` |
| Production port | `server.config.cjs` → 3000 |

## Agent config (single source of truth)

| Tool | Rules | Skills |
|------|-------|--------|
| Cursor | `.cursor/rules/` | `.cursor/skills/` |
| Antigravity | `.agents/rules/` | `.agents/skills/` |
| Claude Code | `.claude/rules/` + `CLAUDE.md` | `.claude/skills/` |

Edit **only** `.cursor/rules/` and `.cursor/skills/`, then run `npm run sync:agents`.

## Universal principles

1. **Minimize scope** — smallest correct diff; no drive-by refactors.
2. **Match existing patterns** — read surrounding code before adding abstractions.
3. **Use `@/` imports** — no deep relative paths when alias works.
4. **Verify** — run `npm run lint`, `npm run test`, and `npm run build` after substantive changes.
5. **No git commits/push** unless the user explicitly asks.
6. **Pull Request Rules:** Every PR must have one clear purpose, explain impact, include tests, pass CI, avoid unrelated formatting, and explicitly mention env/Sanity schema updates.
7. **AI Coding Assistant Rules:** Read files before proposing changes, preserve stack, do not invent variables/schemas without implementation, produce type-safe code, never write placeholders like "implement later", and make the smallest safe change.

## Definition of Done

A feature is complete only when it works on desktop and mobile, TypeScript/lint checks pass without unsafe suppressions, inputs are validated on the server, public endpoints are rate-limited, feedback/loading/empty states are handled, accessibility is satisfied, metadata/JSON-LD/image optimizations are implemented, unit/E2E tests cover critical paths, Sentry records exceptions without PII, and CI passes.

## Prohibited Practices

* **Never** use `any` to bypass typing, or disable strict TypeScript flags.
* **Never** expose server tokens (`SANITY_API_TOKEN`) to Client Components.
* **Never** trust client-side validation alone.
* **Never** render raw CMS HTML or use unparameterized queries with user input.
* **Never** store rate limits in local process memory (use Redis).
* **Never** log secrets, passwords, or complete sensitive form payloads.
* **Never** return internal stack traces / error details to users.
* **Never** make entire pages Client Components unnecessarily.
* **Never** suppress failing tests or bypass CI/CD checks for production.

## Rule index (applied by file type)

| Rule file | When |
|-----------|------|
| `01-nextjs-react.mdc` | `app/`, `components/`, `lib/` |
| `02-tailwind-design-system.mdc` | `*.tsx`, `*.css` |
| `03-sanity-cms.mdc` | `sanity/`, `lib/cms/` |
| `04-typescript-seo.mdc` | `*.ts`, `*.tsx` |
| `05-dependencies-upgrade.mdc` | `package.json`, CI, deploy config |
| `06-file-structure.mdc` | Always — folder layout |
| `07-naming-policy.mdc` | `*.ts`, `*.tsx`, scripts |
| `08-dry-policy.mdc` | Always — deduplication standards |
| `09-security.mdc` | Security-related changes, forms, env config |
| `10-performance.mdc` | Caching, dynamic components, layouts, CWV |
| `11-error-handling-observability.mdc` | Telemetry, logging, Sentry, error boundaries |
| `12-testing.mdc` | Test suites, Vitest, Playwright configs |

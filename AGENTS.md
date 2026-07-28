# Aabtaab — Agent Instructions

**Source of truth:** `.cursor/rules/` and `.cursor/skills/` → run `npm run sync:agents` to mirror.  
**Tech stack reference:** [techstack.md](techstack.md)

## Rules (13)

| File | Scope |
|------|--------|
| `00-project-core` | Always — stack, paths, principles |
| `01-nextjs-react` | `app/`, `components/`, `lib/` |
| `02-tailwind-design-system` | `*.tsx`, `*.css` |
| `03-sanity-cms` | `sanity/`, `lib/cms/` |
| `04-typescript-seo` | `*.ts`, `*.tsx` |
| `05-dependencies-upgrade` | `package.json`, CI, deploy config |
| `06-file-structure` | Always — folder layout |
| `07-naming-policy` | Files, symbols, CMS fields |
| `08-dry-policy` | Always — deduplication / SSOT table |
| `09-security` | Security, forms, env (`lib/env.ts`) |
| `10-performance` | Caching, images, fonts, CWV |
| `11-error-handling-observability` | Errors, logging, Sentry |
| `12-testing` | Vitest + Playwright (unit + E2E) |

## Skills (16)

| Skill | When to use |
|-------|-------------|
| `nextjs-react` | App Router pages, RSC fetch, metadata, images, API routes |
| `tailwind-ui` | Styling, `globals.css`, className refactors |
| `sanity-cms` | Schemas, GROQ, migrations, draft preview |
| `content-sections` | Course/service sections, shells, CTA + contact footer |
| `nested-catalog-routes` | `[...slug]` catalog pages, breadcrumbs |
| `seo-metadata` | Metadata, JSON-LD, sitemap, search, robots, a11y |
| `contact-form-api` | Contact form + `/api/contact` |
| `cache-revalidation` | Webhook revalidation, `CACHE_TAGS` |
| `deploy-production` | Manual Hetzner/PM2 deploy |
| `github-ci-deploy` | GitHub Actions CI + deploy workflows |
| `sync-agent-config` | Mirror rules/skills; resolve doc conflicts |
| `events-feature` | Edit `/events` routes, Event JSON-LD, event CMS |
| `security` | Validation, rate-limiting, secure inputs |
| `performance-optimization` | Core Web Vitals, dynamic imports, image/font layout shifts |
| `error-handling-telemetry` | Error boundaries, Sentry setups, logging |
| `testing-vitest-playwright` | Vitest and Playwright suites |

## Mirror targets

| Tool | Rules | Skills |
|------|-------|--------|
| Cursor | `.cursor/rules/` | `.cursor/skills/` |
| Antigravity | `.agents/rules/` | `.agents/skills/` |
| Claude Code | `.claude/rules/` | `.claude/skills/` |

## Commands

```bash
npm run dev | build | lint | typecheck | test | test:e2e | sync:agents
```

Production: port **3000**, path `/var/www/aabtaab_next`, PM2 `aabtaab-next` via `deploy/runtime.cjs` → `next start`. See [techstack.md](techstack.md).

## Conflict resolution

When docs disagree, priority order:

1. **`techstack.md`** — factual stack and architecture
2. **Rules** (`.cursor/rules/`) — standards and constraints
3. **Skills** (`.cursor/skills/`) — task workflows (must match rules)

Key policies (must stay aligned with techstack):
- Caching: `sanityFetch` in `sanity/lib/fetch.ts` only — no extra `unstable_cache`
- Mutations: Route Handlers (`app/api/*`); React Compiler on — skip routine memoization
- CSP: Report-Only until intentionally enforced
- Styling: Tailwind v4 + `brand-*` / `gold-*` via `app/globals.css`
- CMS fields: migrated names only (`faqItems`, `seo`, `ctaPrimaryLabel`)
- Search: `/search?q=…` (not `/posts?q=…`); sitemap via `getSitemapSlugs()`
- DRY: extract UI/CSS/fallbacks at **2+**; shells in `08-dry-policy`
- Rate limit: Upstash Redis **optional but strongly recommended** in production; memory fallback for local / Redis errors
- PM2: `pm2 delete` then `pm2 start` (not `reload` / `startOrRestart`)
- Types: `npm run typecheck` authoritative (`ignoreBuildErrors` on build)
- Tests: colocated `*.test.ts` + `e2e/{smoke,navigation,seo,contact}.spec.ts` (desktop + mobile)

# Aabtaab — Agent Instructions

**Source of truth:** `.cursor/rules/` and `.cursor/skills/` → run `npm run sync:agents` to mirror.  
**Tech stack reference:** [techstack.md](techstack.md)

**Skill-first:** before implementing in a domain, read the matching skill in `.cursor/skills/` (and its linked rule). Skills are workflows; rules are constraints; `techstack.md` wins on factual stack.

## Rules (15)

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
| `13-mobile-first-responsive` | Mobile-first breakpoints, fluid layout, touch, verify 375/768/1440 |
| `14-ui-ux-best-practices` | Hierarchy, feedback, forms UX, motion, trust |

## Skills (17)

| Skill | When to use |
|-------|-------------|
| `nextjs-react` | App Router pages, RSC fetch, metadata, images, API routes |
| `tailwind-ui` | Styling, `globals.css`, className refactors |
| `mobile-responsive-ux` | Mobile-first layout, touch targets, UI/UX feedback patterns |
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

Key policies (aligned with **techstack.md** for stack facts; standards live in **rules** when techstack is silent):
- Caching: `sanityFetch` in `sanity/lib/fetch.ts` only — no extra `unstable_cache`
- Mutations: Route Handlers (`app/api/*`); React Compiler on — skip routine memoization
- CSP: Report-Only until intentionally enforced (`09-security` / `next.config.ts`)
- Styling: Tailwind v4 + `brand-*` / `gold-*` via `app/globals.css`
- CMS fields: migrated names only (`faqItems`, `seo`, `ctaPrimaryLabel`)
- Search: `/search?q=…` (not `/posts?q=…`); sitemap via `getSitemapSlugs()`
- DRY: extract UI/CSS/fallbacks at **2+**; shells + footer SSOT in `08-dry-policy` (`lib/fallbacks/footer-nav.ts`, `SiteBrandLogo`, `EXTERNAL_LINK_PROPS`)
- Rate limit: Upstash Redis **optional but strongly recommended** in production; memory fallback for local / Redis errors
- Secrets: timing-safe compares when tightening webhook/preview auth; never ship write tokens to the client
- A11y: WCAG 2.2 AA intent; missing CMS detail docs → `notFound()`; new-tab links via `OpensInNewTab` / labeled `aria-label`
- Mobile/UI: mobile-first breakpoints base/`sm:640`/`md:768`/`lg:1024`/`xl:1280` (`13`); UI/UX (`14`); skill `mobile-responsive-ux`; verify **375 / 768 / 1440**; forced-dark footer uses `footer-*` utilities
- Error UI: `app/(site)/{error,not-found,loading}.tsx` + root `not-found` / `global-error` exist — extend, don’t recreate
- PM2: `pm2 delete` then `pm2 start` (not `reload` / `startOrRestart`)
- Types: `npm run typecheck` authoritative (`ignoreBuildErrors` on build)
- Tests: colocated `*.test.ts` + `e2e/{smoke,navigation,seo,contact}.spec.ts` (desktop + mobile)

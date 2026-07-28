# Aabtaab

Next.js 16.2 · React 19.2 · Sanity 6.7 · Tailwind v4.3 · TypeScript 7 · Node 24.18.

**Tech stack (full reference):** [techstack.md](techstack.md)

## Agent rules

Edit `.cursor/rules/` and `.cursor/skills/` only, then:

```bash
npm run sync:agents
```

| Rule | Purpose |
|------|---------|
| `00-project-core` | Stack, paths, universal principles |
| `01-nextjs-react` | RSC, data fetch, metadata |
| `02-tailwind-design-system` | Pure Tailwind v4, `brand-*`, `@utility` |
| `03-sanity-cms` | Schemas, GROQ, migrations |
| `04-typescript-seo` | Types, SEO, a11y |
| `05-dependencies-upgrade` | Safe dependency/stack upgrades |
| `06-file-structure` | Where new code belongs |
| `07-naming-policy` | Files, folders, symbols, CMS fields |
| `08-dry-policy` | Shared helpers, SSOT table |
| `09-security` | Validation, rate limits, env |
| `10-performance` | Caching, images, CWV |
| `11-error-handling-observability` | Errors, Sentry, logging |
| `12-testing` | Vitest + Playwright |

Mirrored to `.claude/rules/` and `.agents/rules/`.

## Skills (16)

`nextjs-react` · `tailwind-ui` · `sanity-cms` · `content-sections` · `nested-catalog-routes` · `seo-metadata` · `contact-form-api` · `cache-revalidation` · `deploy-production` · `github-ci-deploy` · `sync-agent-config` · `events-feature` · `security` · `performance-optimization` · `error-handling-telemetry` · `testing-vitest-playwright`

Mirrored to `.claude/skills/` and `.agents/skills/` via `npm run sync:agents`.

## Build & test

```bash
npm run dev
npm run build       # needs NEXT_PUBLIC_SANITY_PROJECT_ID + DATASET
npm run lint
npm run typecheck
npm run test        # Vitest
npm run test:e2e    # Playwright (desktop + mobile)
```

## Production

Port **3000** · `server.config.cjs` · PM2 `ecosystem.config.cjs` / `deploy/runtime.cjs` → `next start` · `/var/www/aabtaab_next`

See `AGENTS.md` for full index. See [techstack.md](techstack.md) for deploy, env, and SEO.

**Doc priority:** `techstack.md` → rules → skills. Caching only via `sanityFetch`. Rate limit Redis strongly recommended in production.

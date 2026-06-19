# Aabtaab

Next.js 16 · React 19 · Sanity 6 · Tailwind v4.

**Tech stack (full reference):** [techstack.md](techstack.md)

## Agent rules

Edit `.cursor/rules/` only, then:

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
| `08-dry-policy` | Shared helpers, no duplication |

Mirrored to `.claude/rules/` and `.agents/rules/`.

## Skills (12)

`nextjs-react` · `tailwind-ui` · `sanity-cms` · `content-sections` · `nested-catalog-routes` · `seo-metadata` · `contact-form-api` · `cache-revalidation` · `deploy-production` · `github-ci-deploy` · `sync-agent-config` · `events-feature`

Mirrored to `.claude/skills/` and `.agents/skills/` via `npm run sync:agents`.

## Build

```bash
npm run dev
npm run build    # needs NEXT_PUBLIC_SANITY_PROJECT_ID + DATASET
npm run lint
```

## Production

Port **3000** · `server.config.cjs` · PM2 `ecosystem.config.cjs` · `/var/www/aabtaab_next`

See `AGENTS.md` for full index. See [techstack.md](techstack.md) for deploy, env, and SEO.

**Doc priority:** `techstack.md` → rules → skills. Caching only via `sanityFetch`.

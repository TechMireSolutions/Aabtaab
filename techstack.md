# Modern Upgraded Tech Stack — aabtaab.com (English)

| | |
|--|--|
| **Live Domain** | [aabtaab.com](https://aabtaab.com) |
| **Primary Locale** | English (`en-US`) · LTR (`dir="ltr"`) |
| **Production Port** | **3000** · PM2 App Name: `aabtaab-next` |
| **VPS App Path** | `/var/www/aabtaab_next` |
| **Architecture** | Next.js Monolith + Sanity Headless CMS |
| **License** | MIT |
| **Last Upgraded & Security Aligned** | July 2026 |

---

## Core Application Layer

| Layer | Technology | Version | Operational & Architecture Notes |
|-------|------------|---------|----------------------------------|
| Runtime | Node.js | ≥ 22.12 (CI/Prod **24.18.0**) | Managed via NVM; required for Sanity v6 engine |
| Framework | Next.js (App Router) | **16.2.12** (Active LTS) | Patched for July 2026 SSR/Server Action security advisories; Turbopack build engine |
| UI Library | React / React DOM | **19.2.8** | RSC-first architecture; React Compiler 1.0 for memoization |
| Language | TypeScript | **7.0.2** | Strict mode, target **ES2022**; Next uses `experimental.useTypeScriptCli` |
| Styling | Tailwind CSS v4 | **4.3.3** | Native CSS-first theme engine (`@import "tailwindcss"`) |
| Icons | lucide-react | **1.27.0** | Client components; `optimizePackageImports` enabled |
| Typography | Inter / System Sans | Google Fonts | Non-blocking `display: swap` |
| Locale | LTR English | — | Enforced `<html lang="en" dir="ltr">` |
| CMS | Sanity | **6.7.0** (6.x) | Embedded Studio at `/studio` |
| CMS Bridge | next-sanity | **13.2.2** | Cached `sanityFetch` wrapper, Studio embedding |
| Validation | Zod | **4.4.3** | Schema validation for API payloads and forms |
| Tests | Vitest | **4.1.10** | Unit testing under `lib/*.test.ts` |
| Linting | ESLint + Next/React plugins | **10.8.0** | Custom flat config (no `eslint-config-next` / `typescript-eslint` — incompatible with TS 7.0) |

### Supporting stack

| Layer | Technology |
|-------|------------|
| Email | Resend (primary) + Nodemailer SMTP fallback |
| Rate limiting | Upstash Redis (optional; **strongly recommended in production**) + in-memory fallback when unset |
| Spam | Cloudflare Turnstile (optional) |
| Monitoring | Sentry (`@sentry/nextjs`, optional) |
| CDN / edge | Cloudflare proxy · Full (strict) SSL |
| CI/CD | GitHub Actions → SSH deploy to Hetzner |

---

## npm Scripts & Quality Pipeline

| Script | Purpose |
|--------|---------|
| `npm run dev` | `scripts/run-next.mjs dev --port 3000` |
| `npm run build` | Production build (`typescript.ignoreBuildErrors` — still run `typecheck`) |
| `npm run start` | `scripts/run-next.mjs start --port 3000` |
| `npm run lint` | ESLint flat config |
| `npm run typecheck` | `tsc --noEmit` (authoritative types) |
| `npm run test` | Vitest unit tests |
| `npm run test:e2e` | Playwright (Desktop Chrome + Pixel 7) |
| `npm run sync:agents` | Mirror `.cursor` → `.agents` + `.claude` |
| `npm run migrate:sanity` / `:dry` | CMS field migrations |

Also: `test:watch`, `postinstall` (polyfill stub).

### CI Preflight Check

**Local quick check:**

```bash
npm run lint && npm run typecheck && npm run test && npm run build && npm audit --audit-level=high
```

**Full CI** (`.github/workflows/ci.yml`) also runs Playwright: install Chromium then `npm run test:e2e`.

---

## SEO & indexing

- Metadata builders: `lib/seo/metadata.ts`, `lib/cms/page.ts`, `lib/cms/post.ts`, `lib/cms/event.ts`
- JSON-LD helpers: `lib/seo/JsonLd.tsx` (import via `lib/seo`)
- Sitemap: `app/sitemap.ts` → `getSitemapSlugs()` in `lib/cms/queries.ts` (do not re-query Sanity in the page)
- Robots: `app/robots.ts` — disallow `/studio/`, `/api/`, `/search`
- Trailing slash: **`trailingSlash: false`** in `next.config.ts`
- Search: `/search?q=…` (noindex); legacy `/posts?q=…` redirects here

## File structure

Domain-first layout: `app/(site)/` (with `error.tsx`, `not-found.tsx`, `loading.tsx`), `components/{content,layout,sections}/`, `lib/{cms,catalog,contact,seo,fallbacks,security}/`, `sanity/`, `types/` (domain files), `e2e/`, `deploy/`, `scripts/`. Full placement rules: `.cursor/rules/06-file-structure.mdc`.

## CMS

Sanity 6 embedded Studio at `/studio`. Schemas in `sanity/schemaTypes/`; GROQ in `sanity/lib/queries/`; app reads via `lib/cms/queries.ts` + `sanityFetch`. Migrated field names: `faqItems`, `seo` object, `ctaPrimaryLabel` / `ctaSecondaryLabel`. Details: `.cursor/rules/03-sanity-cms.mdc`.

## Production & infrastructure

```
Internet ──► Apache (HTTPS/HTTP2)
               │
               └──► http://127.0.0.1:3000
                      │
                      └──► PM2 [aabtaab-next] (Node 24 / Next.js 16.2.12)
```

| Item | Value |
|------|-------|
| Host | Hetzner VPS |
| App path | `/var/www/aabtaab_next` |
| Reverse proxy | Apache → `127.0.0.1:3000` |
| Process manager | PM2 (`aabtaab-next`) |
| Deploy | `.github/workflows/deploy.yml` + `scripts/deploy-remote.sh` |

### Environment File (`.env.production.local`)

```ini
PORT=3000
HOSTNAME=127.0.0.1
NEXT_PUBLIC_SITE_URL=https://aabtaab.com
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=
SANITY_REVALIDATE_SECRET=
# Alias also accepted: REVALIDATE_SECRET=
RESEND_API_KEY=
EMAIL_TO=contact@aabtaab.com
EMAIL_FROM=no-reply@aabtaab.com
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

Canonical revalidation secret in code: `SANITY_REVALIDATE_SECRET` (falls back to `REVALIDATE_SECRET` if unset).

### PM2 Process Definition (`ecosystem.config.cjs`)

```js
module.exports = {
  apps: [
    {
      name: "aabtaab-next",
      script: "deploy/runtime.cjs",
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
```

Runtime entry: `deploy/runtime.cjs` → `next start` on port **3000** (from `server.config.cjs`).

---

## Architecture (repo map)

```
app/(site)/          Public English LTR pages
app/api/             contact, review, revalidate, draft, draft/disable, search
app/studio/          Embedded Sanity Studio
app/globals.css      Tailwind v4 design system
lib/                 CMS facades, contact, SEO, rate-limit
sanity/              Schemas + GROQ + clients
deploy/runtime.cjs   PM2 start entry
scripts/run-next.mjs Dev/prod Next launcher (port 3000)
```

- **RSC by default**; client islands for forms, nav drawer, carousels.
- **Caching:** `sanityFetch` in `sanity/lib/fetch.ts` only (`unstable_cache`).
- **Revalidate:** `POST /api/revalidate` with webhook secret.

---

## Known constraints

| Item | Constraint |
|------|------------|
| **ESLint** | Custom flat config with `@next/eslint-plugin-next` + react plugins — `eslint-config-next` embeds `typescript-eslint`, which rejects TS 7.0 |
| **TypeScript** | **7.0.2** primary; Next requires `experimental.useTypeScriptCli: true` until TS 7.1 JS API |
| **eslint-plugin-react** | Peer range still ends at ESLint 9 — install with `legacy-peer-deps=true` in `.npmrc`; pin `settings.react.version` |
| **npm audit** | Transitive `sharp`/`adm-zip`/`minimatch`+`brace-expansion` pinned via `overrides` until upstream resolves |
| **PM2** | Deploy deletes `aabtaab-next` before `pm2 start` so stale `args` are not retained |
| **Next build TS** | `typescript.ignoreBuildErrors: true` — CI `typecheck` is authoritative |
| **Node on VPS** | Deploy loads nvm from `.nvmrc` (24.18.0) |
| **Production port** | Change only `server.config.cjs` (`PRODUCTION_PORT = 3000`) |
| **Lockfile** | Always `npm ci` on server |

Upgrade workflow: `.cursor/rules/05-dependencies-upgrade.mdc`.

---

## Quick start

```bash
cp .env.example .env.local
npm install
npm run dev                  # http://127.0.0.1:3000
npm run lint && npm run test && npm run build && npm audit --audit-level=high
```

Production (VPS):

```bash
cd /var/www/aabtaab_next
export DEPLOY_SHA=origin/main
./scripts/deploy-remote.sh
```

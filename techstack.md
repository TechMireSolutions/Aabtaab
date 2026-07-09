# Aabtaab — Tech Stack

**Single source of truth** for runtime, dependencies, architecture, SEO, and production setup.  
Shia Islamic education and community website.

---

## Summary

| Layer | Technology |
|-------|------------|
| Runtime | Node.js **24.17.0** (`.nvmrc`; `engines` ≥20.9) |
| Framework | **Next.js 16** (App Router, RSC, ISR) |
| UI | **React 19**, **Tailwind CSS v4** |
| CMS | **Sanity 6** + embedded Studio at `/studio` |
| Language | **TypeScript 6** (strict) |
| Production | **PM2** cluster on **Hetzner VPS**, port **3000** |
| CDN (recommended) | **Cloudflare** proxy in front of origin |
| CI/CD | **GitHub Actions** (lint, Vitest, build, Playwright) |

**Not in this repo:** Docker, Fly.io, Cloud Run, PostgreSQL/Drizzle, Payload CMS, Auth.js/Clerk, Cloudflare Workers/Turnstile, OpenTelemetry/Grafana.

---

## Runtime & versions

**Last verified:** July 2026 — all direct dependencies at latest stable npm; lockfile refreshed via `npm update` (ESLint 10 and TypeScript 7 deferred due to compatibility constraints).

| Item | Version | Source |
|------|---------|--------|
| Node (local/CI) | 24.17.0 | `.nvmrc` |
| Node (minimum) | ≥22.12.0 | `package.json` `engines` (Sanity 6) |
| Next.js | ^16.2.10 | `package.json` |
| React / React DOM | ^19.2.7 | `package.json` |
| Sanity | ^6.4.0 | `package.json` |
| TypeScript | ^6.0.3 | `package.json` (v7 blocked — see constraints) |
| Tailwind CSS | ^4.3.2 | `package.json` |
| @sentry/nextjs | ^10.64.0 | `package.json` |
| @types/node | ^26.1.1 | `package.json` |
| ESLint | ^9.39.4 | `package.json` (v10 blocked — see constraints) |

---

## Dependencies

### Production (`dependencies`)

| Package | Purpose |
|---------|---------|
| `next` | App Router, metadata API, image optimization, ISR |
| `react`, `react-dom` | UI |
| `sanity`, `next-sanity`, `@sanity/client` | CMS schemas, Studio, GROQ fetch |
| `@sanity/image-url` | Optimized Sanity CDN image URLs |
| `@sanity/vision` | GROQ query tool in Studio |
| `@portabletext/react` | Rich text from Sanity |
| `zod` | Contact form validation |
| `resend` | Primary contact notification email |
| `nodemailer` | Gmail SMTP fallback |
| `@upstash/ratelimit`, `@upstash/redis` | Distributed contact rate limiting |
| `@sentry/nextjs` | Optional production error monitoring |
| `lucide-react` | Icons |

### Development (`devDependencies`)

| Package | Purpose |
|---------|---------|
| `typescript`, `@types/*` | Type checking |
| `eslint`, `eslint-config-next` | Linting |
| `tailwindcss`, `@tailwindcss/postcss`, `@tailwindcss/typography` | Design system + prose |
| `postcss` | CSS pipeline |
| `vitest`, `@vitest/coverage-v8` | Unit tests |
| `@playwright/test` | E2E smoke tests |

---

## Architecture

### Pattern

Headless CMS (Sanity) + server-rendered Next.js with cached GROQ reads and on-demand revalidation via webhook.

### App Router layout

```
app/
  layout.tsx              Root layout, site metadata, Organization JSON-LD
  (site)/layout.tsx       Header, Footer, skip link, preview banner
  (site)/{route}/page.tsx Public pages
  api/{name}/route.ts     Route handlers
  studio/[[...tool]]/     Embedded Sanity Studio
  sitemap.ts, robots.ts   SEO metadata routes
  global-error.tsx          Sentry-backed error boundary
  globals.css               Tailwind v4 design system (single CSS source)
```

### Rendering

- **Server Components** by default — all `app/(site)/**/page.tsx` are async RSC.
- **Client islands** — Header, ContactForm, PreviewBanner, carousel/accordion sections, WhatsApp button, Studio wrapper.
- **No `pages/` directory** — App Router only.
- **No `generateStaticParams`** — dynamic routes use ISR via `sanityFetch`.

### Data fetching & caching

| Layer | Location | Role |
|-------|----------|------|
| GROQ queries | `sanity/lib/queries/` | Domain queries + `fragments.ts` |
| Fetch + cache | `sanity/lib/fetch.ts` | `sanityFetch`, `CACHE_TAGS`, `unstable_cache` |
| Facade | `lib/cms/queries.ts` | React `cache()` wrappers for pages |
| Preview client | `sanity/lib/previewClient.ts` | Uncached drafts (`previewDrafts` perspective) |
| Write client | `sanity/lib/writeClient.ts` | Contact form → Sanity |

**Cache behavior (`sanityFetch`):**

- **Draft mode** or **development** → direct fetch, no ISR cache.
- **Production** → `unstable_cache` with default `revalidate: 3600` and tag-based invalidation.

**`CACHE_TAGS`:** `sanity-all`, `sanity-posts`, `sanity-post-{slug}`, `sanity-events`, `sanity-event-{slug}`, `sanity-courses`, `sanity-course-{slug}`, `sanity-services`, `sanity-service-{slug}`, `sanity-site-settings`, `sanity-homepage`, `sanity-pages`, `sanity-page-{slug}`.

**On-demand revalidation:** `POST /api/revalidate` (secret: `SANITY_REVALIDATE_SECRET`) → `lib/revalidate.ts`.

### Path alias

`@/*` → repository root (`tsconfig.json`).

---

## CMS (Sanity 6)

### Studio

- URL: `/studio`
- Config: `sanity.config.ts` (structure + vision tools)
- Page: `app/studio/[[...tool]]/page.tsx`

### Document schemas (`sanity/schemaTypes/`)

| Type | Kind |
|------|------|
| `post`, `category`, `author` | Content |
| `page` | Static CMS pages (about, contact, etc.) |
| `course`, `courseLevel`, `service` | Nested catalogs |
| `event` | Events |
| `siteSettings`, `navigation`, `homepageSettings` | Site config |
| `testimonial` | Social proof |
| `contactSubmission` | Form submissions |
| `seoObject` | Shared SEO fields object |

### Draft / preview

| Endpoint | Purpose |
|----------|---------|
| `GET /api/draft?secret=…&type=…&slug=…` | Enable draft mode, redirect to content |
| `GET /api/draft/disable` | Exit preview |

Requires `SANITY_PREVIEW_SECRET` + `SANITY_API_TOKEN` (read/draft access). Amber `PreviewBanner` shown in site layout when active.

Preview URL example:

```
https://aabtaab.com/api/draft?secret=YOUR_SECRET&type=post&slug=my-article
```

### Migrations

```bash
npm run migrate:sanity:dry   # preview
npm run migrate:sanity       # apply
```

Script: `scripts/migrate-sanity-fields.mjs`

---

## Routes

### Public pages (`app/(site)/`)

| URL | Page |
|-----|------|
| `/` | Homepage |
| `/about` | About |
| `/contact` | Contact form |
| `/donate` | Donate |
| `/events` | Events catalog |
| `/events/[slug]` | Event detail |
| `/online-courses` | Courses catalog |
| `/online-courses/[...slug]` | Nested course pages |
| `/posts` | Articles catalog |
| `/posts/[slug]` | Article detail |
| `/search` | Unified site search |
| `/services` | Services catalog |
| `/services/[...slug]` | Nested service pages |

Legacy redirect: `/articles` → `/posts` (301 in `next.config.ts`).

### API routes (`app/api/`)

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/contact` | Contact form submission |
| POST | `/api/revalidate` | Sanity webhook ISR invalidation |
| GET | `/api/draft` | Enable draft preview |
| GET | `/api/draft/disable` | Disable draft preview |

### SEO metadata routes

- `/sitemap.xml` — `app/sitemap.ts`
- `/robots.txt` — `app/robots.ts`

---

## Production & infrastructure

### Server

| Item | Value |
|------|-------|
| Host | Hetzner VPS |
| Deploy path | `/var/www/aabtaab_next` |
| PM2 app name | `aabtaab-next` |
| Port | **3000** (`server.config.cjs`) |
| Process mode | Cluster, `instances: "max"` (`ecosystem.config.cjs`) |
| Start command | `next start -p 3000` via `scripts/start-production.cjs` |

### Deploy workflow

- **CI:** `.github/workflows/ci.yml` — lint, test, build, Playwright on PR/push to `main` (`actions/checkout@v5`, `actions/setup-node@v5`)
- **Deploy:** `.github/workflows/deploy.yml` — SSH to Hetzner on push to `main`

Manual deploy:

```bash
cd /var/www/aabtaab_next
git pull && npm ci
npm run migrate:sanity:dry && npm run migrate:sanity   # when CMS fields changed
npm run build
pm2 startOrRestart ecosystem.config.cjs --update-env && pm2 save
```

### Cloudflare (recommended, optional)

No Workers/Tunnel config in repo. Documented setup:

1. DNS A/AAAA → Hetzner IP with **proxy enabled** (orange cloud).
2. SSL/TLS mode: **Full (strict)**.
3. Origin: PM2 on port 3000 (nginx or Cloudflare Tunnel optional).
4. Client IP for rate limiting: `cf-connecting-ip` via `lib/request-ip.ts`.

---

## Testing & CI

### Vitest (`npm run test`)

| Test file | Covers |
|-----------|--------|
| `lib/contact/schema.test.ts` | Contact Zod schema + honeypot |
| `lib/contact/email-html.test.ts` | Email HTML escaping |
| `lib/paths.test.ts` | Nested path helpers |
| `lib/revalidate.test.ts` | Webhook revalidation mapping |
| `lib/request-ip.test.ts` | Cloudflare/proxy IP extraction |

Config: `vitest.config.ts`

### Playwright (`npm run test:e2e`)

- Spec: `e2e/smoke.spec.ts` (homepage, contact, events, courses, services)
- Config: `playwright.config.ts` — starts prod server on port 3000
- CI installs Chromium before E2E run

---

## Security

### Contact form (`POST /api/contact`)

| Control | Implementation |
|---------|----------------|
| Validation | Zod — `lib/contact/schema.ts` |
| Honeypot | Hidden `website` field — rejected if filled |
| Rate limit | 5 req / 15 min per IP — `lib/rate-limit.ts` |
| IP source | `lib/request-ip.ts` — `cf-connecting-ip` → `x-forwarded-for` → `x-real-ip` |
| Storage | Sanity `contactSubmission` via write client |
| Email notify | Optional — `lib/contact/notify.ts` |

Rate limiting: **Upstash Redis** when env set; in-memory fallback on single server.

### HTTP headers (`next.config.ts`)

- `X-Frame-Options`, `X-Content-Type-Options`, `HSTS`, `Referrer-Policy`, `Permissions-Policy`
- `Content-Security-Policy-Report-Only` (includes `*.ingest.sentry.io`)
- Long-cache headers for `/_next/static` and `/_next/image`

### Webhook auth

`SANITY_REVALIDATE_SECRET` — checked via `x-sanity-webhook-secret` header or `?secret=` query.

---

## SEO

### Metadata system

| Helper | Location | Use |
|--------|----------|-----|
| `buildPageMetadata` | `lib/seo/metadata.ts` | Title, description, canonical, robots, OG, Twitter |
| `buildCmsPageMetadata` | `lib/cms/page.ts` | CMS pages with Sanity SEO fields |
| `buildPostPageMetadata` | `lib/cms/post.ts` | Articles — OG image, article type, dates |
| `buildNestedSlugMetadata` | `lib/cms/page.ts` | Courses/services nested routes |
| Root metadata | `app/layout.tsx` | Site defaults, title template, keywords, verification |

Site URL: `NEXT_PUBLIC_SITE_URL` → `getSiteUrl()` / `absoluteUrl()`.

### Structured data (JSON-LD) — `lib/seo/JsonLd.tsx`

| Schema | Where |
|--------|-------|
| **Organization** | Every page (root layout) |
| **WebSite** + **SearchAction** | Every page → `/search?q={search_term_string}` |
| **Article** (+ optional **FAQPage**) | Post detail |
| **Event** | Event detail |
| **BreadcrumbList** | Nested course/service pages |

### Crawlability

- **Sitemap** — static routes + dynamic posts, courses, services, events
- **Robots** — allow `/`; disallow `/studio/`, `/api/`
- **`noIndex`** — search results, CMS `seo.noIndex` field
- **Canonical URLs** — per-page + optional CMS `canonicalUrl` on posts
- **OG images** — 1200×630 from Sanity; fallback `public/og-default.png`

### Performance (Core Web Vitals)

- Next.js Image — WebP + AVIF, Sanity CDN remote patterns
- Font — Plus Jakarta Sans via `next/font/google`, `display: swap`
- ISR caching + immutable static asset headers
- RSC — minimal client JavaScript

### Accessibility (SEO-adjacent)

- Semantic HTML — `main`, `nav`, `section`, `article`
- One `h1` per page; logical heading hierarchy
- Skip link → `#main-content`
- `lang="en"` on `<html>`

---

## Email

Implementation: `lib/contact/notify.ts`

| Provider | When | Env |
|----------|------|-----|
| **Resend** (primary) | `RESEND_API_KEY` set | `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_TO` |
| **Gmail SMTP** (fallback) | Resend unavailable | `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_TO` |

Submissions always save to Sanity even when email is not configured.

---

## Observability

**Sentry** (`@sentry/nextjs`) — optional, production-only when `NEXT_PUBLIC_SENTRY_DSN` is set.

| File | Role |
|------|------|
| `instrumentation.ts` | Server/edge init, `onRequestError` |
| `instrumentation-client.ts` | Client init, router transitions |
| `sentry.server.config.ts`, `sentry.edge.config.ts` | DSN, traces (10% prod) |
| `app/global-error.tsx` | React error capture |

---

## Environment variables

See `.env.example` for the full list.

### Required

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=
SANITY_REVALIDATE_SECRET=
NEXT_PUBLIC_SITE_URL=https://aabtaab.com
```

### Optional

| Variable | Purpose |
|----------|---------|
| `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_TO` | Contact email (Resend) |
| `EMAIL_USER`, `EMAIL_PASS` | Contact email (SMTP fallback) |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Distributed rate limiting |
| `SANITY_PREVIEW_SECRET` | Draft preview URLs |
| `NEXT_PUBLIC_SENTRY_DSN` | Error monitoring |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Search Console |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server (localhost:3000) |
| `npm run build` | Production build |
| `npm run start` | Production server via `scripts/start-production.cjs` |
| `npm run lint` | ESLint |
| `npm run test` | Vitest unit tests |
| `npm run test:watch` | Vitest watch mode |
| `npm run test:e2e` | Playwright smoke tests |
| `npm run migrate:sanity:dry` | Preview CMS field migrations |
| `npm run migrate:sanity` | Apply CMS field migrations |
| `npm run sync:agents` | Mirror `.cursor/` rules/skills to other agent tools |

Other scripts (not npm): `scripts/generate-og-default.mjs`, `scripts/sync-agent-config.mjs`

---

## File structure

```
app/
  (site)/              Public pages + route-group layout
  api/                 contact, revalidate, draft
  studio/              Embedded Sanity Studio
  globals.css          Tailwind v4 design system
  layout.tsx           Root layout + site metadata
  sitemap.ts, robots.ts, global-error.tsx

components/
  cards/, content/, layout/, sections/
  portable-text/, icons/, ui/, studio/

lib/
  cms/                 Cached query facade + metadata builders
  catalog/             Nested catalog helpers
  contact/             Zod schema, email HTML, notify
  seo/                 Metadata + JSON-LD
  fallbacks/           Default copy when CMS empty
  constants.ts, paths.ts, urls.ts, revalidate.ts, rate-limit.ts, request-ip.ts

sanity/
  schemaTypes/         CMS schemas (one file per type)
  lib/                 client, fetch, previewClient, writeClient, queries/, image

types/                 Shared TypeScript by domain
scripts/               Migrations, prod start, agent sync, OG generator
e2e/                   Playwright smoke tests
public/                Static assets (og-default.png)
.github/workflows/     ci.yml, deploy.yml
.cursor/, .claude/, .agents/   Agent rules/skills (mirrored)
ecosystem.config.cjs, server.config.cjs
next.config.ts, sanity.config.ts
vitest.config.ts, playwright.config.ts, postcss.config.mjs, eslint.config.mjs
```

Placement rules for new code: `.cursor/rules/06-file-structure.mdc`.

---

## Agent configuration

| Tool | Rules | Skills |
|------|-------|--------|
| Cursor | `.cursor/rules/` | `.cursor/skills/` |
| Antigravity | `.agents/rules/` | `.agents/skills/` |
| Claude Code | `.claude/rules/` + `CLAUDE.md` | `.claude/skills/` |

Edit **only** `.cursor/rules/` and `.cursor/skills/`, then run `npm run sync:agents`.  
See `AGENTS.md` for the full rule and skill index.

---

## Known constraints

| Item | Constraint |
|------|------------|
| **ESLint** | Stay on **v9.39.4** — v10 breaks `eslint-config-next` (tested Jun 2026) |
| **TypeScript** | Stay on **v6.x** — v7 breaks `eslint-config-next` with a nested `Cannot read properties of undefined (reading 'Cjs')` error (tested Jul 2026) |
| **Sanity audit** | Transitive `js-yaml`/`uuid` — do not `npm audit fix --force` |
| **Next PostCSS** | Nested transitive dep — fixed when Next.js updates bundled `postcss` |
| **Production port** | Change only `server.config.cjs` (`PRODUCTION_PORT = 3000`) |
| **Studio packages** | Keep `sanity`, `@sanity/vision`, `next-sanity` on Sanity 6 matrix |
| **Lockfile** | Always `npm ci` on server — never delete `package-lock.json` |

Upgrade workflow: `.cursor/rules/05-dependencies-upgrade.mdc`.

---

## Quick start

```bash
cp .env.example .env.local   # fill Sanity + site URL
npm install
npm run dev                  # http://localhost:3000
```

Pre-deploy check:

```bash
npm run lint && npm run test && npm run build
```

---

## License

MIT — see [LICENSE](LICENSE).

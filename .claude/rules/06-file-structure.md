# file structure

> Modern file and folder structure — where new code belongs in Aabtaab

**Always apply:** yes

# File Structure

Follow **domain-first, layer-second** layout — group by feature/domain, not by file type at the root.

Full layout reference: **`techstack.md`** § File structure.

## Top-level layout

```
app/
  (site)/              # Public site — route group, shared layout
    layout.tsx, error.tsx, not-found.tsx, loading.tsx
    {route}/page.tsx
    {route}/_components/   # Private to that route (underscore prefix)
  api/{name}/route.ts  # contact, review, revalidate, draft, draft/disable, search
  studio/              # Embedded Sanity Studio
  globals.css          # Tailwind v4 design system (single CSS source)
  layout.tsx, sitemap.ts, robots.ts, global-error.tsx, not-found.tsx

components/
  content/             # Reusable CMS-driven sections (2+ pages)
  layout/              # Site chrome (Header, Footer, SiteBrandLogo, PageHeader, shells)
                       # + mobile-nav-classes.ts for drawer class strings
  sections/            # Homepage-only blocks (do not put non-home widgets here)
  cards/, portable-text/, icons/, ui/, studio/
    # ui/ includes OpensInNewTab and other shared chrome primitives

lib/
  cms/                 # Cached queries, search facade, keywords, search-labels
  catalog/             # Nested catalog helpers + formatters (price/CTA labels)
  contact/             # Zod schema, email HTML, notify
  seo/                 # Metadata + JSON-LD (approved barrel: index.ts)
  fallbacks/           # Defaults when CMS empty (nav, footer-nav, about, dar-ul-quran, …)
  security/            # Timing-safe secret compares
  constants.ts, paths.ts, urls.ts, revalidate.ts, env.ts
  rate-limit.ts, request-ip.ts

sanity/
  schemaTypes/         # One schema file per document type
  lib/                 # client, fetch, previewClient, writeClient, queries/, image

types/                 # Shared TS by domain — no runtime code
                       # (post, seo, site-settings, payment, quote, country, …;
                       #  sanity.ts = SanityImage / ancestry only)

deploy/                # PM2 runtime bridge (`runtime.cjs`)
scripts/               # Migrations, run-next, agent sync, OG generator
public/                # Static assets (og-default.png)
e2e/                   # Playwright: smoke, navigation, seo, contact
```

## Placement rules

| Adding… | Put it in… |
|---------|------------|
| New public page | `app/(site)/{route}/page.tsx` |
| Page-only client widget | `app/(site)/{route}/_components/` |
| Reusable section (2+ pages) | `components/content/` |
| CMS fetch helper | `lib/cms/queries.ts` or `sanity/lib/queries/{domain}.ts` |
| GROQ for new domain | `sanity/lib/queries/{domain}.ts` + export in `index.ts` |
| Shared type | `types/{domain}.ts` |
| Shared layout shell (2+ pages) | `components/layout/` (e.g. `ArticleDetailShell`, `Footer`, `SiteBrandLogo`) |
| Default/fallback copy | `lib/fallbacks/{feature}.ts` (footer: `footer-nav.ts`) |
| Shared URL / external-link helpers | `lib/urls.ts` (`whatsappUrl`, `mapsUrl`, `EXTERNAL_LINK_PROPS`, `safeContactHref`) |
| Catalog price / CTA label helpers | `lib/catalog/formatters.ts` |
| Nested paths / draft preview paths | `lib/paths.ts` (`buildNestedContentPath`, `previewPath`, …) |
| Search keyword synonyms / labels | `lib/cms/keywords.ts`, `lib/cms/search-labels.ts` |
| Mobile nav class strings | `components/layout/mobile-nav-classes.ts` |
| Route loading UI | `app/(site)/loading.tsx` (or route-level `loading.tsx`) |
| Generic UI primitive (2+ places) | `components/ui/` (e.g. `OpensInNewTab`) |
| Unit test | Colocated `*.test.ts` next to the module |
| E2E flow | `e2e/{feature}.spec.ts` |
| One-off script | `scripts/{kebab-name}.mjs` |

## Modern App Router conventions

- **Route groups** `(site)` — shared layout without URL segment.
- **Private folders** `_components/` — not routable; colocate page-specific UI.
- **Catch-all** `[...slug]/page.tsx` — nested catalogs only (courses, services).
- **Dynamic** `[slug]/page.tsx` — flat catalogs (posts, events).
- **No** `pages/` directory — App Router only.
- **Flat API** — one `route.ts` per endpoint under `app/api/`.
- **Root instrumentation** — `instrumentation.ts` (+ Sentry configs) at repo root when monitoring is configured.
- **No middleware today** — do not add `middleware.ts` / edge proxy unless a product need (auth, geo, rewrites) is explicit; prefer Route Handlers + Cloudflare for edge concerns.

## Layer boundaries

| Layer | Responsibility |
|-------|----------------|
| `app/` | Routing, metadata exports, compose components + data |
| `components/` | Presentation — props in, JSX out |
| `lib/` | Pure helpers, fetch facades, URL/path logic |
| `sanity/` | CMS schemas, GROQ, low-level client |
| `types/` | Shared interfaces — no runtime code |
| `components/ui/` | Generic/headless presentation components (e.g. accordion, dropdowns) |
| `e2e/` | Shared Playwright E2E smoke tests and configs |
| `deploy/` / `scripts/` | Runtime/PM2 and one-off tooling — not imported by UI |

## Placements and Co-location

* Keep feature-specific components, tests, schemas, and utilities close to the feature where practical.
* Do not place business logic directly inside large page components.
* Colocate unit tests as `*.test.ts` next to the module under test.

## Do not

- Put business logic in page files beyond composition — extract to `lib/` or `components/`.
- Create catch-all `utils/` or `helpers/` folders — use domain folders.
- Add per-component CSS files — extend `app/globals.css` `@utility` instead.
- Colocate Sanity schemas outside `sanity/schemaTypes/`.
- Barrel-export everything — approved barrels only: `sanity/lib/queries/index.ts` and `lib/seo/index.ts`. Do not add new barrels without updating this rule.


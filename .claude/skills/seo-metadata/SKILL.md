---
name: seo-metadata
description: >-
  Applies Aabtaab SEO — metadata builders, JSON-LD, sitemap, search, and robots.
  Use when editing page titles, Open Graph, structured data, sitemap.xml, or
  robots.txt. Rule: 04-typescript-seo.
---

# SEO & Metadata

**Rule:** `.cursor/rules/04-typescript-seo.mdc` · **Reference:** `techstack.md` § SEO

## Metadata builders

| Builder | Use case |
|---------|----------|
| `buildPageMetadata` | Base helper (`lib/seo/metadata.ts`) — events, search, generic pages |
| `defineCmsPageMetadata` | Static CMS pages (about, contact, donate) |
| `buildCmsPageMetadata` | CMS pages with optional overrides |
| `buildNestedSlugMetadata` | Course/service `[...slug]` pages |
| `buildPostPageMetadata` | Post detail pages |
| Root `generateMetadata` | Site-wide defaults (`app/layout.tsx`) |

Homepage uses `absoluteTitle: true` in `buildPageMetadata`.

## JSON-LD (`lib/seo/JsonLd.tsx`)

| Helper | Where |
|--------|-------|
| Organization | Root layout (every page) |
| WebSite + SearchAction | Root layout → `/search?q={search_term_string}` |
| `ArticleJsonLd` | Post detail (+ optional FAQPage) |
| `EventJsonLd` | Event detail |
| `BreadcrumbJsonLd` | Nested course/service breadcrumbs |

## Sitemap & robots

- `app/sitemap.ts` — static routes (`/`, `/about`, `/posts`, `/events`, `/search`, …) + dynamic posts, nested courses/services, events
- `app/robots.ts` — allow `/`; disallow `/studio/`, `/api/`

## Site search

- Route: `/search?q=…` — GROQ unified search via `lib/cms/search.ts`
- Header search and JSON-LD SearchAction point here
- `/posts?q=…` redirects to `/search`
- Search result pages: `noIndex: true`

## URLs

`getSiteUrl()`, `absoluteUrl()`, `NEXT_PUBLIC_SITE_URL` — canonical base.

## CMS SEO fields

`seo.metaTitle`, `seo.metaDescription`, `seo.noIndex`, `seo.ogImage`, `seo.canonicalUrl` via `seoObject` schema.

## Images

`ogImageUrl`, `articleHeroImageUrl` in `sanity/lib/image.ts`.  
Fallback OG: `public/og-default.png` (regenerate via `scripts/generate-og-default.mjs`).

## Checklist for new public page

1. Export `generateMetadata` (or `defineCmsPageMetadata`)
2. One `h1`, semantic sections
3. Add JSON-LD if applicable (Article, Event, Breadcrumb)
4. Add to `app/sitemap.ts` if indexable
5. Wire webhook revalidation tag if CMS-backed

## TypeScript & a11y

- Shared types in `types/` — reuse before duplicating.
- Semantic tags: `main`, `nav`, `section`, `article`, `header`, `footer`.
- Skip link + `#main-content` (site layout).
- Meaningful `alt` on content images; no blank placeholders in production UI.
- Avoid hardcoded site name when `getSiteSettings()` is available.

## Verify

```bash
npm run lint
npm run build
```

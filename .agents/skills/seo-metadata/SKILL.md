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
| `buildPageMetadata` | Base helper — always sets canonical, OG/Twitter image (CMS or `og-default.png`) |
| `defineCmsPageMetadata` | Static CMS pages (about, contact, donate, listings) |
| `buildCmsPageMetadata` | CMS pages with optional overrides |
| `buildNestedSlugMetadata` | Course/service `[...slug]` pages |
| `buildPostPageMetadata` | Post detail pages |
| Root `generateMetadata` | Site-wide defaults (`app/layout.tsx`) |

Homepage: `absoluteTitle: true` + OG from `homepage.heroImage` or site logo.

## Metadata API and Canonicalization

- **Metadata API Usage:** Utilize the built-in Next.js Metadata API (`generateMetadata` for dynamic pages, `metadata` object for static pages) to generate `<title>`, `<meta name="description">`, and Open Graph tags.
- **Strict Canonicalization:** Every page must output a self-referencing canonical URL in the metadata object (`alternates: { canonical: '...' }`) to prevent duplicate content issues.
- **Trailing Slash Consistency:** Site uses **`trailingSlash: false`** (`next.config.ts`). Do not add trailing slashes to new routes; redirect alternate forms with 301 when needed.


## OG image resolution

```ts
import { resolveDocOgImage, getDefaultOgImageUrl } from "@/lib/seo";

resolveDocOgImage(doc); // seo.ogImage → featuredImage → heroImage → icon
getDefaultOgImageUrl(); // https://…/og-default.png
```

`buildPageMetadata` applies the default OG automatically when `ogImage` is omitted.

## JSON-LD (`lib/seo/json-ld*.tsx`, import via `lib/seo`)

| Helper | Where |
|--------|-------|
| Organization | Root layout (every page) |
| WebSite + SearchAction | Root layout → `/search?q={search_term_string}` |
| `ArticleJsonLd` | Post detail — `publisherLogoUrl` = site logo |
| `CourseJsonLd` | Leaf course pages only (`!hasChildren`) |
| `EventJsonLd` | Event detail |
| `BreadcrumbJsonLd` | Nested course/service breadcrumbs |

## Sitemap & robots

- **Dynamic Sitemaps:** `app/sitemap.ts` must call **`getSitemapSlugs()`** from `lib/cms/queries.ts` (SSOT). Do not open a separate Sanity client or duplicate GROQ in the sitemap file.
- **Robots.txt Generation:** Implement `app/robots.ts` to disallow `/studio/`, `/api/`, and `/search`, and point to the production sitemap.
- Exclude `/search` from sitemap.
- Trailing slash: **`trailingSlash: false`** (`next.config.ts`).
- E2E coverage: `e2e/seo.spec.ts` (canonical shape, robots disallows, 404).
- Dynamic entries include `lastModified` from CMS.
- GROQ slug queries filter `seo.noIndex != true`.


## Site search

- Route: `/search?q=…` — GROQ unified search via `lib/cms/search.ts`
- Header search and JSON-LD SearchAction point here
- `/posts?q=…` redirects to `/search`
- Search result pages: `noIndex: true`

## URLs

`getSiteUrl()`, `absoluteUrl()`, `NEXT_PUBLIC_SITE_URL` — canonical base.

## CMS SEO fields

`seo.metaTitle`, `seo.metaDescription`, `seo.noIndex`, `seo.ogImage`, `seo.canonicalUrl`, `seo.keywords` via `seoObject` schema.

## Images & performance

- `ogImageUrl`, `articleHeroImageUrl` in `sanity/lib/image.ts`
- LCP images: `priority` + `sizes` on hero/featured images
- Fonts: minimal weight subset + `display: "swap"` in `app/layout.tsx`
- Regenerate default OG: `node scripts/generate-og-default.mjs`
- PWA manifest icons: Ensure square 512x512 format. Use Sanity URL builder to dynamically crop square images from settings logo/favicon instead of stretching rectangular images.

## Checklist for new public page
1. Export `generateMetadata` (or `defineCmsPageMetadata`)
2. Pass `ogImage` via `resolveDocOgImage` when CMS-backed
3. One `h1`, semantic sections; missing CMS doc → `notFound()`
4. Add JSON-LD if applicable (Article, Course, Event, Breadcrumb) — must match visible content
5. Ensure slug query excludes `seo.noIndex` if sitemap-eligible
6. Wire webhook revalidation tag if CMS-backed
7. Accessibility: Arabic/Urdu texts have `lang` + `dir="rtl"`; inputs have labels/`aria-label`
8. Canonical self-reference via builders; no trailing slash (`trailingSlash: false`)

## Verify
```bash
npm run lint
npm run typecheck
npm run test:e2e   # seo suite when metadata/robots change
npm run build
```

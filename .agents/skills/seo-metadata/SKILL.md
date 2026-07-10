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

## OG image resolution

```ts
import { resolveDocOgImage, getDefaultOgImageUrl } from "@/lib/seo";

resolveDocOgImage(doc); // seo.ogImage → featuredImage → heroImage → icon
getDefaultOgImageUrl(); // https://…/og-default.png
```

`buildPageMetadata` applies the default OG automatically when `ogImage` is omitted.

## JSON-LD (`lib/seo/JsonLd.tsx`)

| Helper | Where |
|--------|-------|
| Organization | Root layout (every page) |
| WebSite + SearchAction | Root layout → `/search?q={search_term_string}` |
| `ArticleJsonLd` | Post detail — `publisherLogoUrl` = site logo |
| `CourseJsonLd` | Leaf course pages only (`!hasChildren`) |
| `EventJsonLd` | Event detail |
| `BreadcrumbJsonLd` | Nested course/service breadcrumbs |

## Sitemap & robots

- `app/sitemap.ts` — static indexable routes + dynamic posts/courses/services/events
- **Exclude** `/search` from sitemap
- Dynamic entries include `lastModified` from CMS
- GROQ slug queries filter `seo.noIndex != true`
- `app/robots.ts` — allow `/`; disallow `/studio/`, `/api/`

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
3. One `h1`, semantic sections
4. Add JSON-LD if applicable (Article, Course, Event, Breadcrumb)
5. Ensure slug query excludes `seo.noIndex` if sitemap-eligible
6. Wire webhook revalidation tag if CMS-backed
7. Accessibility: Ensure Arabic/Urdu texts have `lang="ar" dir="rtl"` or similar, and check that all inputs/select elements have a corresponding visual label or `aria-label`.

## Verify
```bash
npm run lint
npm run build
```

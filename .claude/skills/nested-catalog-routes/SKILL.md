---
name: nested-catalog-routes
description: >-
  Implements hierarchical course and service pages with catch-all slug routes,
  breadcrumbs, and child grids. Use when editing [...slug] pages, lib/paths.ts,
  or nested CMS catalog navigation.
---

# Nested Catalog Routes

## Routes

- `app/(site)/online-courses/[...slug]/page.tsx`
- `app/(site)/services/[...slug]/page.tsx`

## Resolution pattern

```tsx
const slug = params.slug[params.slug.length - 1]; // leaf slug for GROQ
const course = await getCourseBySlug(slug);
```

## Branch logic

| Condition | Render |
|-----------|--------|
| Document has children | `NestedChildrenGrid` + breadcrumbs |
| Leaf document | Hero + content sections + FAQ + CTA |

## Key helpers

| File | Purpose |
|------|---------|
| `lib/paths.ts` | `getContentAncestry`, `buildNestedBreadcrumbItems`, `buildNestedContentPath` |
| `lib/catalog/nested-children.ts` | `mapCourseChildForGrid`, `mapServiceChildForGrid` |
| `lib/cms/page.ts` | `buildNestedSlugMetadata` |
| `lib/cms/queries.ts` | `getCourseBySlug`, `getServiceBySlug` |

## GROQ

`courseBySlugDeepQuery`, `serviceBySlugDeepQuery` — include parent chain + children.

## Components

`NestedBreadcrumbs`, `NestedChildrenGrid`, `CatalogDarkHero` via `CourseHeroSection` / `ServiceHeroSection`, shared content sections, `CtaBandSection` + `SiteContactFooter`.

## Tests

- Unit: `lib/paths.test.ts`, `lib/catalog/nested-children.test.ts`, `lib/urls.test.ts`
- E2E smoke: `/online-courses`, `/services` load in `e2e/smoke.spec.ts`

## Sitemap

`app/sitemap.ts` → `getSitemapSlugs()` (`lib/cms/queries.ts`), which uses nested path queries (`allCoursePathsQuery` / `allServicePathsQuery`) internally. Do not call those GROQ helpers from the page file.
## Adding a third nested catalog

Copy services pattern: schema with parent ref, deep slug query, `[...slug]` page, CACHE_TAGS, webhook case, sitemap entries.

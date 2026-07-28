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
const { slug: slugParts } = await params; // params is a Promise (Next 15+)
const slug = slugParts[slugParts.length - 1]; // leaf slug for GROQ
const course = await getCourseBySlug(slug);
if (!course) notFound();
```

## Branch logic

| Condition | Render |
|-----------|--------|
| Document has children | `NestedChildrenGrid` + breadcrumbs |
| Leaf document | Hero + content sections + FAQ + CTA |
| Missing document | `notFound()` — real 404, not empty 200 |

## Key helpers

| File | Purpose |
|------|---------|
| `lib/paths.ts` | `getContentAncestry`, `buildNestedBreadcrumbItems`, `buildNestedContentPath` |
| `lib/catalog/nested-page.ts` | `buildNestedCatalogPageContext`, `nestedStaticParamsFromEntries`, `ensureCanonicalNestedPath` |
| `lib/catalog/nested-children.ts` | `mapCourseChildForGrid`, `mapServiceChildForGrid` |
| `components/layout/NestedCatalogPageShell.tsx` | Shared breadcrumbs + children vs leaf chrome |
| `lib/cms/page.ts` | `buildNestedSlugMetadata` |
| `lib/cms/queries.ts` | `getCourseBySlug`, `getServiceBySlug` |

## GROQ

`courseBySlugDeepQuery`, `serviceBySlugDeepQuery` — include parent chain + children. Project only needed fields; use fragments.

## Components

`NestedCatalogPageShell` (compose leaf sections as `children`), `NestedBreadcrumbs`, `NestedChildrenGrid`, `CatalogDarkHero` via `CourseHeroSection` / `ServiceHeroSection`, shared content sections, `CtaBandSection` + `SiteContactFooter`.

## Tests

- Unit: `lib/paths.test.ts`, `lib/catalog/nested-children.test.ts`, `lib/urls.test.ts`
- E2E smoke: `/online-courses`, `/services` load in `e2e/smoke.spec.ts`

## Sitemap

`app/sitemap.ts` → `getSitemapSlugs()` (`lib/cms/queries.ts`), which uses nested path queries (`allCoursePathsQuery` / `allServicePathsQuery`) internally. Do not call those GROQ helpers from the page file. Respect `seo.noIndex`.

## Adding a third nested catalog

Copy services pattern: schema with parent ref, deep slug query, `[...slug]` page, CACHE_TAGS, webhook case, sitemap entries, metadata + breadcrumbs JSON-LD.

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

`NestedBreadcrumbs`, `NestedChildrenGrid`, domain hero sections, shared content sections.

## Sitemap

`app/sitemap.ts` uses `allCoursePathsQuery` / `allServicePathsQuery` + `buildNestedContentPath`.

## Adding a third nested catalog

Copy services pattern: schema with parent ref, deep slug query, `[...slug]` page, CACHE_TAGS, webhook case, sitemap entries.

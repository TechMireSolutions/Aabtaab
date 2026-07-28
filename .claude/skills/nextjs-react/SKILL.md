---
name: nextjs-react
description: >-
  Next.js 16 App Router and React 19 patterns for Aabtaab pages, layouts, and
  components. Use when editing app/, components/, or lib/ — RSC data fetch,
  metadata, images, API routes. Rule: 01-nextjs-react.
---

# Next.js & React

**Rule:** `.cursor/rules/01-nextjs-react.mdc`

## Checklist (do in order)

1. Prefer **RSC**; push `"use client"` to the smallest leaf.
2. **Await** `params` / `searchParams` / `draftMode()` / `cookies()` / `headers()`.
3. Fetch via `lib/cms/queries.ts` or `sanityFetch` — never new `unstable_cache` outside `sanity/lib/fetch.ts`.
4. Parallel independent fetches with `Promise.all`.
5. Compose shells from `08-dry-policy` / skill `content-sections` (including site `Header`/`Footer` + `SiteBrandLogo`).
6. Mutations → existing **Route Handlers** (`app/api/*`), not Server Actions.
7. LCP image: `priority` + `fetchPriority="high"` once per route (header logo may use `SiteBrandLogo` `priority`).
8. React Compiler is on — skip routine `useMemo` / `useCallback` / `memo`.
9. Missing detail documents → `notFound()`; rethrow Next control-flow errors if catching.
10. Stable React `key`s from ids/slugs — never list index for CMS collections.
11. External links → `EXTERNAL_LINK_PROPS` + `OpensInNewTab`; site layout data → `getSiteLayoutData()`.

## Defaults

- Server Components first; client islands for forms, nav drawer, carousels, search palette.
- Internal navigation: always `<Link>` (prefetch).
- Streaming: selective `<Suspense>` with layout-stable skeletons (see homepage); don’t Suspense the whole page.
- Prefer reading `searchParams` in pages, not layouts (avoids widening dynamic rendering).
- Optional: `after()` from `next/server` for non-critical post-response work — never for sole authz.

## Data fetching

```tsx
import { getCmsPage, getSiteSettings } from "@/lib/cms/queries";
import { defineCmsPageMetadata } from "@/lib/cms/page";
import { sanityFetch, CACHE_TAGS } from "@/sanity/lib/fetch";
```

- Draft preview: `sanityFetch` bypasses cache → `getPreviewClient()` (rule `03-sanity-cms`).
- Revalidation: `CACHE_TAGS` + `lib/revalidate.ts` + `/api/revalidate`.

## Metadata

| Page type | Helper |
|-----------|--------|
| Static CMS slug | `defineCmsPageMetadata(...)` |
| Nested course/service | `buildNestedSlugMetadata` |
| Blog post | `buildPostPageMetadata` |
| Event | `buildEventPageMetadata` |
| Search / generic | `buildPageMetadata` |

## Page composition

| Need | Use |
|------|-----|
| Catalog listing header | `PageHeader` / `CatalogPageLayout` |
| Course/service hero | `CourseHeroSection` / `ServiceHeroSection` |
| Post/event detail | `ArticleDetailShell` |
| Privacy/terms | `LegalPageShell` |

## Avoid

- CMS fetch in client components; global client state libraries.
- `useEffect` for data that can load on the server.
- Inventing Server Actions, PPR, or View Transitions without an explicit product decision.
- Passing server secrets into Client Components via props.
- Soft-404 empty detail pages that return `200`.

## Verify

```bash
npm run lint
npm run typecheck
npm run test
npm run test:e2e   # when routes/UI change
npm run build      # needs Sanity env; build alone is not type-safe (ignoreBuildErrors)
```

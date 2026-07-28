---
name: nextjs-react
description: >-
  Next.js 16 App Router and React 19 patterns for Aabtaab pages, layouts, and
  components. Use when editing app/, components/, or lib/ — RSC data fetch,
  metadata, images, API routes. Rule: 01-nextjs-react.
---

# Next.js & React

**Rule:** `.cursor/rules/01-nextjs-react.mdc`

## Defaults

- **Server Components First:** Default to React Server Components (RSC) to pre-render HTML on the server. Only use `"use client"` when interactivity or browser APIs are strictly required.
- Push client boundaries **down** (e.g. `ContactForm`, `Header`).
- **Route Prefetching:** Utilize the `<Link>` component for all internal navigation to leverage Next.js's automatic background prefetching for faster perceived page loads.


## Data fetching

Use existing helpers — do **not** add `unstable_cache` outside `sanity/lib/fetch.ts`.

```tsx
import { getCmsPage, getSiteSettings } from "@/lib/cms/queries";
import { defineCmsPageMetadata } from "@/lib/cms/page";
import { sanityFetch, CACHE_TAGS } from "@/sanity/lib/fetch";
```

- Cached reads: `lib/cms/queries.ts` (`React.cache()` around `sanityFetch`).
- Production ISR: `sanityFetch` → `unstable_cache` in `sanity/lib/fetch.ts`.
- Draft preview: bypasses cache; uses `getPreviewClient()` when draft mode on.
- Parallel fetches: `Promise.all([...])`.
- Revalidation: `CACHE_TAGS`, `lib/revalidate.ts`, `app/api/revalidate/route.ts`.

## Metadata

| Page type | Helper |
|-----------|--------|
| Static CMS slug | `defineCmsPageMetadata("about", { path, fallbackTitle, fallbackDescription })` |
| Nested course/service | `buildNestedSlugMetadata` |
| Blog post | `buildPostPageMetadata` |
| Event | `buildEventPageMetadata` |
| Search / generic | `buildPageMetadata` |

## Images

- Always `next/image` for Sanity URLs via `sanity/lib/image.ts` helpers.
- Set accurate `sizes` for cards, hero, article layouts.

## Page composition

Compose shared shells — do not reimplement chrome:

| Need | Use |
|------|-----|
| Catalog listing header | `PageHeader` / `CatalogPageLayout` |
| Course/service hero | `CourseHeroSection` / `ServiceHeroSection` |
| Post/event detail | `ArticleDetailShell` |
| Privacy/terms | `LegalPageShell` |

See skill `content-sections` and rule `08-dry-policy`.

## Avoid

- CMS fetch in client components.
- Global state libraries — use server fetch + URL/searchParams.
- `useEffect` for data that can load on the server.

## Verify

```bash
npm run lint
npm run test
npm run build   # needs Sanity env vars
```

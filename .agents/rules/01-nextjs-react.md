---
trigger: glob
glob: {app,components,lib}/**/*.{ts,tsx}
description: Next.js 16 App Router and React 19 patterns used in this repo
---

# Next.js & React

## Server vs client

- **Server Components by default** — pages and layouts fetch data on the server.
- **`"use client"` only** for interactivity: forms, menus, carousels, hooks, browser APIs.
- Push client boundaries **down** the tree (e.g. `ContactForm`, `Header`, `HeroSection`).

## Data fetching (this project)

Use **`sanityFetch`** and **`lib/cms/queries.ts`** — do **not** add new `unstable_cache` calls outside `sanity/lib/fetch.ts` (that file owns production caching).

```tsx
// CMS pages
import { getCmsPage, getSiteSettings } from "@/lib/cms/queries";
import { defineCmsPageMetadata } from "@/lib/cms/page";

// Direct Sanity fetch
import { sanityFetch, CACHE_TAGS } from "@/sanity/lib/fetch";
```

- Cached reads: `lib/cms/queries.ts` (`React.cache()` wrappers around `sanityFetch`).
- Production ISR: `sanityFetch` → `unstable_cache` + tags in `sanity/lib/fetch.ts`.
- Draft preview: when draft mode is on, `sanityFetch` bypasses cache and uses `getPreviewClient()`.
- Tags/revalidation: `CACHE_TAGS`, `lib/revalidate.ts`, `app/api/revalidate/route.ts`.
- Parallel fetches: `Promise.all([...])`.

## Metadata

- Static CMS pages: `defineCmsPageMetadata("slug", { path, fallbackTitle, fallbackDescription })`.
- Dynamic slugs: `buildNestedSlugMetadata`, `buildPostPageMetadata`, `buildPageMetadata` (events, search).
- Search results: `noIndex: true` via `buildPageMetadata`.

## Images

- Always `next/image` for Sanity URLs via `sanity/lib/image.ts` helpers.
- Set accurate `sizes` for layout (card grids, hero, article).

## API routes

Keep handlers thin — business logic in `lib/`:

| Route | Logic home |
|-------|------------|
| `/api/contact` | `lib/contact/` |
| `/api/revalidate` | `lib/revalidate.ts` |
| `/api/draft`, `/api/draft/disable` | draft mode only |

## Avoid

- Fetching CMS data in client components.
- New global state libraries — use server fetch + URL/searchParams.
- Unnecessary `useEffect` for data that can load on the server.
- Duplicating cache logic — extend `sanityFetch` or `lib/cms/queries.ts`.

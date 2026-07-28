# nextjs react

> Next.js 16 App Router and React 19 patterns used in this repo

**Scope:** `{app,components,lib}/**/*.{ts,tsx}`

# Next.js & React

## Server vs client

- **Server Components First:** Default to React Server Components (RSC) to pre-render HTML on the server. Only use `"use client"` when interactivity or browser APIs are strictly required.
- Push client boundaries **down** the tree (e.g. `ContactForm`, `Header`, `HeroSection`).
- **`import type { ReactNode } from "react"`** — always import `ReactNode` explicitly. Do not use `React.ReactNode` without a React import; it relies on the global JSX ambient type and fails under strict isolation.

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
- Dynamic slugs: `buildNestedSlugMetadata`, `buildPostPageMetadata`, `buildEventPageMetadata`, `buildPageMetadata` (search, generic).
- Search results: `noIndex: true` via `buildPageMetadata`.
- Compose page chrome via shared shells (`PageHeader`, `ArticleDetailShell`, `LegalPageShell`) — see `08-dry-policy`.

## Images

- Always `next/image` for Sanity URLs via `sanity/lib/image.ts` helpers.
- Set accurate `sizes` for layout (card grids, hero, article).

## API routes

Keep handlers thin — business logic in `lib/`:

| Route | Logic home |
|-------|------------|
| `/api/contact` | `lib/contact/` |
| `/api/review` | review schema + notify (same validation/rate-limit patterns) |
| `/api/revalidate` | `lib/revalidate.ts` |
| `/api/draft`, `/api/draft/disable` | draft mode only |
| `/api/search` | `lib/cms/search.ts` |

## Component design constraints

* Each component must have one clear responsibility. Avoid components with excessive props or unrelated behaviour.
* Prefer composition over large conditional components.
* Prefer existing design-system utilities and shared shells over copying layout/button/card/form patterns — extract at **2+** uses (see `08-dry-policy`).
* Extract reusable patterns only after shared behaviour is clear. Avoid premature abstractions.
* Keep server-only code out of client bundles.

## Form & UI feedback states

Every asynchronous feature (especially forms) must handle:
* Initial state
* Loading state
* Success state
* Validation error state
* Server error state
* Empty state

Rules:
* Do not leave buttons permanently disabled after an error occurs.
* Prevent duplicate submissions while a request is processing (disable submit button or show loading state).
* Provide clear, user-friendly confirmations after successful form submission.
* Preserve safe user input after validation errors.
* Show field-level validation errors near the corresponding fields.

## Avoid

- Fetching CMS data in client components.
- New global state libraries — use server fetch + URL/searchParams.
- Unnecessary `useEffect` for data that can load on the server.
- Duplicating cache logic — extend `sanityFetch` or `lib/cms/queries.ts`.
- Converting an entire page into a Client Component merely to support one interactive element.
- Standard custom click handlers or `window.location` for simple internal navigation; utilize the `<Link>` component for all internal navigation to leverage Next.js's automatic background prefetching for faster perceived page loads.


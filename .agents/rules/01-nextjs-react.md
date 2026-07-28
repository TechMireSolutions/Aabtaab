---
trigger: glob
glob: {app,components,lib}/**/*.{ts,tsx}
description: Next.js 16 App Router and React 19 patterns used in this repo
---

# Next.js & React

## Server vs client

- **Server Components First:** Default to React Server Components (RSC). Only use `"use client"` when interactivity or browser APIs are strictly required.
- Push client boundaries **down** the tree (e.g. `ContactForm`, `Header`, `HeroSection`).
- **`import type { ReactNode } from "react"`** — always import `ReactNode` explicitly. Do not use `React.ReactNode` without a React import.
- Prefer `import "server-only"` on modules that must never enter the client bundle (`writeClient`, revalidate helpers, server env consumers) when tightening boundaries.

## React Compiler (enabled)

- `reactCompiler: true` in `next.config.ts`.
- Do **not** add `useMemo` / `useCallback` / `React.memo` for routine re-render control unless profiling proves a residual hot path.
- Keep `"use client"` islands small so compiler work stays local.
- Do not disable the compiler for a single file without a short comment explaining why.
- Prefer React 19 patterns already in the ecosystem (`use`, optimistic UI) **only** inside small client islands when they improve UX — do not introduce Server Actions just to unlock `useActionState`.

## Async request APIs (Next 15+)

- Page/layout `params` and `searchParams` are **`Promise<…>`** — always `await` them.
- `draftMode()`, `cookies()`, and `headers()` are async — `await` before use (see `sanity/lib/fetch.ts`).
- Prefer reading `searchParams` in **pages**, not layouts — layouts that await `searchParams` / dynamic APIs widen dynamic rendering.
- Do **not** catch-and-swallow control-flow errors from `notFound()`, `redirect()`, or `forbidden()` — rethrow so Next can handle them.

## Data fetching (this project)

Use **`sanityFetch`** and **`lib/cms/queries.ts`** — do **not** add new `unstable_cache` calls outside `sanity/lib/fetch.ts`.

```tsx
import { getCmsPage, getSiteSettings } from "@/lib/cms/queries";
import { defineCmsPageMetadata } from "@/lib/cms/page";
import { sanityFetch, CACHE_TAGS } from "@/sanity/lib/fetch";
```

- Cached reads: `lib/cms/queries.ts` (`React.cache()` wrappers around `sanityFetch`).
- Production ISR: `sanityFetch` → `unstable_cache` + tags in `sanity/lib/fetch.ts`.
- Draft preview: when draft mode is on, `sanityFetch` bypasses cache and uses `getPreviewClient()`.
- Tags/revalidation: `CACHE_TAGS`, `lib/revalidate.ts`, `app/api/revalidate/route.ts`.
- Parallel fetches: `Promise.all([...])`.

## Streaming & Suspense

- Prefer RSC + selective `<Suspense>` with **layout-stable** fallbacks for slow independent sections (homepage pattern).
- Do not wrap the whole page in one Suspense that delays LCP chrome (header/hero).
- Route-level `loading.tsx` is **optional** and unused today — add only with a clear skeleton; do not invent globally.

## Mutations (this repo)

- Prefer existing **Route Handlers** under `app/api/` for public writes (contact, review, revalidate).
- Do **not** introduce `"use server"` / Server Actions unless a PR explicitly adopts them and updates security + tests to match `/api/contact` patterns (Zod, rate limit, Turnstile when configured).
- Keep handlers **thin**; business logic in `lib/`. Return correct status codes (`400` / `429` / `404` / `500`) — never `200` on failure.
- Optional: `after()` from `next/server` for non-blocking post-response work (telemetry, non-critical side effects) — never put security-critical authz only in `after()`.

## Metadata

- Static CMS pages: `defineCmsPageMetadata("slug", { path, fallbackTitle, fallbackDescription })`.
- Dynamic: `buildNestedSlugMetadata`, `buildPostPageMetadata`, `buildEventPageMetadata`, `buildPageMetadata`.
- Search results: `noIndex: true` via `buildPageMetadata`.
- Compose page chrome via shared shells (`PageHeader`, `ArticleDetailShell`, `LegalPageShell`) — see `08-dry-policy`.

## Images

- Always `next/image` for Sanity URLs via `sanity/lib/image.ts` helpers.
- Set accurate `sizes`. Above-fold LCP: `priority` + `fetchPriority="high"` (at most one primary LCP image per route).

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

* One clear responsibility per component; prefer composition.
* Prefer design-system utilities and shared shells — extract at **2+** uses (`08-dry-policy`).
* Heavy client UI (mobile nav, search palette, carousels): leaf Client Components; `next/dynamic` only for large non-LCP chunks.
* Do not dynamic-import above-fold hero CTAs.

## Form & UI feedback states

Every async feature must handle: idle, loading, success, validation error, server error, empty.

* Do not leave buttons permanently disabled after an error.
* Prevent duplicate submissions while loading.
* Clear success confirmations; preserve safe input after validation errors.
* Field-level errors near the corresponding fields; use `aria-live` / `role="alert"` where status isn’t otherwise announced.

## Optional (not used in this repo)

* Partial Prerendering / `cacheComponents` / `"use cache"` — **not** enabled; do not adopt in drive-by PRs.
* View Transitions — **not** used; if added later, gate with `prefers-reduced-motion`.
* `generateStaticParams` for catalogs — optional only if build-time warming is measured useful; webhook tags remain authoritative.

## Lists & keys

- Stable, unique React `key`s from domain ids/slugs — never array index for reorderable or CMS lists.
- Empty CMS documents → `notFound()` (or null-safe section) — avoid soft-404 empty shells that stay `200`.

## Avoid

- Fetching CMS data in client components.
- New global state libraries — use server fetch + URL/searchParams.
- Unnecessary `useEffect` for data that can load on the server.
- Duplicating cache logic — extend `sanityFetch` or `lib/cms/queries.ts`.
- Converting an entire page into a Client Component for one interactive element.
- Custom click handlers / `window.location` for internal navigation — use `<Link>`.
- Passing server secrets into Client Components via props.
- Adding root `middleware.ts` / proxy layers without a clear auth/geo/rewrite need (none today).

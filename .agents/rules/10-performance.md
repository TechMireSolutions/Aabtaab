---
trigger: glob
glob: {app,components,lib,sanity}/**/*.{ts,tsx}
description: Performance rules — rendering strategies, data fetching/caching, images, fonts, JS bundle size, and Core Web Vitals
---

# Performance Rules

## 1. Rendering Strategy

Choose rendering intentionally:
* Use static generation (SSG) for stable public content.
* Use Incremental Static Regeneration (ISR) for Sanity content that changes periodically.
* Use dynamic rendering only when request-specific data (e.g. search queries, authentication) requires it. Do not make a page dynamic without a valid reason.
* Use Sanity revalidation tags or controlled revalidation where appropriate.
* Do not disable caching globally to solve a local freshness problem.
* Never cache personalised or private content publicly.

## 2. Data Fetching

* Use the shared Sanity fetch utility (`sanityFetch` in `sanity/lib/fetch.ts`). Do **not** create unrelated Sanity clients in individual components.
* Keep GROQ queries centralised in `sanity/lib/queries/`.
* Request only required fields (project only what is used). Do not fetch complete documents when the page only needs a few fields.
* Parameterise GROQ queries. Never concatenate untrusted input into GROQ strings.
* Run independent requests concurrently with `Promise.all`. Avoid sequential request waterfalls.
* Handle missing CMS documents gracefully.
* Define appropriate revalidation values for each content type.

## 3. Images

* **Image Optimization:** Never use standard `<img>` tags. Always map Sanity images to the `next/image` component to ensure automatic WebP/AVIF conversion, lazy loading, and explicit width/height attributes (preventing Cumulative Layout Shift).
* Every image must have known dimensions or a stable aspect ratio to avoid layout shift.
* Provide a correct `sizes` attribute for responsive images. Prevent mobile payload overhead on hidden desktop images by setting sizes explicitly (e.g. `sizes="(max-width: 768px) 0px, 55vw"` on `hidden md:block` hero images).
* Use modern optimised formats (WebP, AVIF) through the Next.js image pipeline.
* Use `priority` **and** `fetchPriority="high"` only for the genuine above-the-fold LCP image (e.g. heroes in `CatalogDarkHero` / homepage). At most **one** primary LCP image per route.
* Lazy-load below-the-fold images.
* Prefer accurate hero `sizes` (often `100vw` for full-bleed).
* Compress source images before uploading to Sanity. Do not upload unnecessarily large images.
* Require meaningful alternative text for informative CMS images. Use empty alternative text (`alt=""`) for purely decorative images.
* Prevent layout shift by reserving image space.
* **Retina / HiDPI (`urlFor`):** when calling `urlFor(image).width(n).height(n)`, use **2× the largest CSS display size** of that image across all breakpoints. E.g. a logo displayed at `42px` (header) and `52px` (footer) must be fetched at `.width(104).height(104)` (2 × 52).

## 4. Fonts

* **Font Loading:** Use `next/font` for local or Google fonts to ensure CSS is inlined and zero layout shift occurs during font loading (Inter via `next/font/google` in `app/layout.tsx`).
* Avoid loading unnecessary font families or weights.
* Define reliable fallback fonts.
* Ensure text remains visible while fonts load (`display: "swap"`).
* Do not import the same font through multiple systems (e.g., HTML link tag and CSS import).

## 5. JavaScript and Bundles

* Keep browser JavaScript to a minimum.
* Do not import server-only libraries into Client Components.
* Dynamically import (`next/dynamic`) large client-only features that are not needed for LCP (e.g. heavy drawers/carousels). Do **not** dynamic-import above-fold hero CTAs.
* Avoid large utility libraries for simple operations.
* Import only required icons from `lucide-react`. Do not import complete icon packages.
* Remove unused dependencies and dead code.
* Investigate unexpected increases in client bundle size.
* React Compiler is enabled — avoid routine manual memoization (see `01-nextjs-react`).

## 6. Core Web Vitals (CWV)

Pages must be designed to minimise:
* **Largest Contentful Paint (LCP)**
* **Cumulative Layout Shift (CLS)**
* **Interaction to Next Paint (INP)**

Rules:
* Reserve space for images, banners, and embeds.
* Do not insert content above existing content after page load.
* Avoid heavy client-side hydration.
* Avoid long-running event handlers — break up work; keep click/input handlers short for INP.
* Use loading indicators that do not shift the surrounding layout.
* Avoid Cumulative Layout Shift (CLS) on hydration-dependent widgets (e.g. countdown timers) by rendering layout-stable placeholder skeletons of the exact same dimensions when not mounted.
* Do not autoplay heavy media.
* Keep critical content available without waiting for client-side JavaScript.
* Prefer selective `<Suspense>` with layout-stable skeletons for slow sections — do not Suspense whole-page LCP chrome.
* **Route Prefetching:** Use `<Link>` for internal navigation.
* Prefer `motion-safe:` animations; never uncapped infinite motion on LCP content; respect `prefers-reduced-motion`.
* Prefer CSS/`@utility` motion over JS animation libraries for simple UI motion.
* Third-party scripts (analytics, widgets): load only when needed; never block LCP; respect privacy/consent if added later.
* Measure with Lighthouse / field tools before large “optimizations” — avoid premature micro-optimizations.

## 7. Optional (not used)

* Partial Prerendering / `cacheComponents` / `"use cache"` are **not** enabled. Caching SSOT remains `sanityFetch` → `unstable_cache` + tags. Do not enable in drive-by PRs.
* View Transitions are **not** used. If added later, gate with `prefers-reduced-motion` and keep scoped.

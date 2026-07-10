# performance

> Performance rules — rendering strategies, data fetching/caching, images, fonts, JS bundle size, and Core Web Vitals

**Scope:** `{app,components,lib,sanity}/**/*.{ts,tsx}`

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

* Use `next/image` for content images whenever possible.
* Every image must have known dimensions or a stable aspect ratio to avoid layout shift.
* Provide a correct `sizes` attribute for responsive images. Prevent mobile payload overhead on hidden desktop images by setting sizes explicitly (e.g. `sizes="(max-width: 768px) 0px, 55vw"` on `hidden md:block` hero images).
* Use modern optimised formats (WebP, AVIF) through the Next.js image pipeline.
* Use `priority` only for genuine above-the-fold images (e.g. hero images). Do not mark multiple non-critical images as priority.
* Lazy-load below-the-fold images.
* Compress source images before uploading to Sanity. Do not upload unnecessarily large images.
* Require meaningful alternative text for informative CMS images. Use empty alternative text (`alt=""`) for purely decorative images.
* Prevent layout shift by reserving image space.
* **Retina / HiDPI (`urlFor`):** when calling `urlFor(image).width(n).height(n)`, use **2× the largest CSS display size** of that image across all breakpoints. E.g. a logo displayed at `42px` (header) and `52px` (footer) must be fetched at `.width(104).height(104)` (2 × 52).

## 4. Fonts

* Use `next/font` (Plus Jakarta Sans via `next/font/google` in `app/layout.tsx`).
* Avoid loading unnecessary font families or weights.
* Define reliable fallback fonts.
* Ensure text remains visible while fonts load (`display: "swap"`).
* Do not import the same font through multiple systems (e.g., HTML link tag and CSS import).

## 5. JavaScript and Bundles

* Keep browser JavaScript to a minimum.
* Do not import server-only libraries into Client Components.
* Dynamically import (`next/dynamic` or `React.lazy`) large client-only features that are not immediately required on initial page load.
* Avoid large utility libraries for simple operations.
* Import only required icons from `lucide-react`. Do not import complete icon packages.
* Remove unused dependencies and dead code.
* Investigate unexpected increases in client bundle size.

## 6. Core Web Vitals (CWV)

Pages must be designed to minimise:
* **Largest Contentful Paint (LCP)**
* **Cumulative Layout Shift (CLS)**
* **Interaction to Next Paint (INP)**

Rules:
* Reserve space for images, banners, and embeds.
* Do not insert content above existing content after page load.
* Avoid heavy client-side hydration.
* Avoid long-running event handlers.
* Use loading indicators that do not shift the surrounding layout.
* Avoid Cumulative Layout Shift (CLS) on hydration-dependent widgets (e.g. countdown timers) by rendering layout-stable placeholder skeletons of the exact same dimensions when not mounted.
* Do not autoplay heavy media.
* Keep critical content available without waiting for client-side JavaScript.

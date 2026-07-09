---
trigger: glob
glob: **/*.{ts,tsx}
description: TypeScript strictness, SEO, accessibility, and semantic HTML
---

# TypeScript & SEO

## TypeScript

- `strict` mode — avoid `any`; prefer `interface` for object shapes.
- Types live in `types/` by domain (`sanity.ts`, `course.ts`, `content-sections.ts`, `search.ts`).
- Colocate only when truly local; reuse shared types before duplicating.

## SEO & metadata

- Site metadata: `app/layout.tsx` `generateMetadata`.
- Pages: `defineCmsPageMetadata`, `buildPageMetadata`, `buildNestedSlugMetadata`, `buildPostPageMetadata`.
- OG images: `resolveDocOgImage()` in `lib/seo/resolve-og-image.ts` — seo override → featured/hero/icon image.
- Default OG: `getDefaultOgImageUrl()` → `/og-default.png` (applied in `buildPageMetadata` when no CMS image).
- JSON-LD: `lib/seo/JsonLd.tsx` — use existing helpers (do not hand-roll schema).
- Sitemap/robots: `app/sitemap.ts`, `app/robots.ts`.
- Full SEO reference: **`techstack.md`** § SEO.

## JSON-LD helpers (use these)

| Helper | Use |
|--------|-----|
| Organization + WebSite | Root layout (every page) |
| `ArticleJsonLd` | Post detail (+ optional FAQPage); pass `publisherLogoUrl` (site logo, not article image) |
| `CourseJsonLd` | Leaf course detail pages (not parent catalog nodes) |
| `EventJsonLd` | Event detail |
| `BreadcrumbJsonLd` | Nested course/service pages |
| WebSite `SearchAction` | Points to `/search?q={search_term_string}` |

## Search & index control

- Unified search: `/search?q=…` — `noIndex: true` on result pages.
- `/search` is **not** in sitemap (result pages are noindex).
- Legacy `/posts?q=…` redirects to `/search`.
- CMS `seo.noIndex` on documents — excluded from sitemap GROQ queries.

## Sitemap

- Static routes only (no `/search`).
- Dynamic routes include `lastModified` from CMS `_updatedAt` / `publishedAt`.
- Slug queries filter `coalesce(seo.noIndex, false) != true`.

## Performance (SEO-adjacent)

- LCP hero: `priority` + correct `sizes` on above-the-fold `next/image`.
- Fonts: subset weights in `app/layout.tsx` (`display: "swap"`, `preload: true`).
- Images: Sanity CDN via `next/image` (WebP/AVIF in `next.config.ts`).
- `poweredByHeader: false` in `next.config.ts`.

## HTML & a11y

- One **`h1` per page**; logical heading hierarchy.
- Semantic tags: `main`, `nav`, `section`, `article`, `header`, `footer`.
- Skip link + `#main-content` (already in site layout).
- Interactive elements: labels, `aria-*` where needed; 44px touch targets on mobile chrome (see `globals.css`).

## Images & content

- Meaningful `alt` on all content images.
- No blank image placeholders in production UI — use CMS image or styled fallback block.
- OG fallback: `public/og-default.png` when no CMS image.

## TypeScript Strictness

* Strict mode must remain enabled. Do not use `any`.
* Use `unknown` for untrusted/external values and narrow types safely.
* Do not suppress errors with `@ts-ignore`. Use `@ts-expect-error` only when the error is intentional, and provide an explanatory comment.
* Define explicit types for public component props, API responses, form payloads, Sanity query results, and environment configuration.
* Avoid unsafe type assertions (`as Type`). Never cast unvalidated external data directly to an application type.
* Prefer discriminated unions over multiple loosely related Boolean flags. Use exhaustive checks for important unions.

## SEO Metadata & URL Rules

* Every indexable page must have: unique page title, unique description, canonical URL, Open Graph metadata, social image, and indexing directives.
* For CMS-driven pages, use `generateMetadata` to derive metadata dynamically.
* Use short, lowercase, and stable slugs. Redirect old URLs if slugs change.
* Exclude drafts, preview routes, studio routes, and private/search results from the sitemap.
* Validate all generated JSON-LD structured data and escape output safely.

## Accessibility (a11y)

* Target WCAG 2.2 Level AA compliance for public interfaces.
* Keyboard accessibility: all interactive features must be keyboard-operable, and visible focus indicators are mandatory. Do not remove outlines without providing an accessible replacement.
* Use native HTML controls over custom ones when possible.
* Associate a visual label with every form field; placeholder text is not a label.
* Contrast: maintain sufficient contrast ratio. Do not communicate meaning via color alone.
* Respect `prefers-reduced-motion`.
* Trap focus inside modal overlays, restore focus when closed, allow closing with Escape, and expose correct modal roles.
* Urdu and Arabic content must support Right-to-Left (RTL) rendering without breaking English layout styling.

## Avoid

- Client-only metadata hacks.
- Duplicate SEO title/description logic outside `lib/cms/page.ts` / `lib/seo/`.
- Hardcoded site name when `getSiteSettings()` is available.
- Using article image as Organization `publisher.logo` in JSON-LD.
- Silently bypassing keyboard accessibility or removing focus rings.


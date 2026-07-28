# typescript seo

> TypeScript strictness, SEO, accessibility, and semantic HTML

**Scope:** `**/*.{ts,tsx}`

# TypeScript & SEO

## TypeScript

* Strict mode must remain enabled. Do not use `any`; use `unknown` and narrow safely.
* Do not suppress errors with `@ts-ignore`. Use `@ts-expect-error` only when intentional, with a comment.
* Prefer `interface` for object shapes. Shared types live in `types/` by domain.
* Define explicit types for public props, API payloads, Sanity results, and env config.
* Avoid unsafe assertions on unvalidated external data. Prefer discriminated unions + exhaustive checks.

## SEO & metadata

- Use Next.js Metadata API (`generateMetadata` / `metadata`) for title, description, OG, and robots.
- Every indexable page needs a self-referencing **canonical** (`alternates.canonical` via `buildPageMetadata` helpers).
- **Trailing slash:** `trailingSlash: false` in `next.config.ts` — never add trailing slashes to new paths.
- Site defaults: `app/layout.tsx` `generateMetadata`.
- Page helpers: `defineCmsPageMetadata`, `buildPageMetadata`, `buildNestedSlugMetadata`, `buildPostPageMetadata`, `buildEventPageMetadata`.
- OG images: `resolveDocOgImage()` — seo override → featured/hero/icon; default `getDefaultOgImageUrl()` → `/og-default.png`.
- JSON-LD: use helpers in `lib/seo/JsonLd.tsx` (import via `@/lib/seo`) — do not hand-roll schema.
- **Sitemap:** `app/sitemap.ts` must call **`getSitemapSlugs()`** from `lib/cms/queries.ts` — do not re-query Sanity inside the sitemap file.
- **Robots:** `app/robots.ts` disallows `/studio/`, `/api/`, `/search` and points at the sitemap.
- Full reference: **`techstack.md`** § SEO & indexing.

## JSON-LD helpers (use these)

| Helper | Use |
|--------|-----|
| Organization + WebSite | Root layout (every page) |
| `ArticleJsonLd` | Post detail (+ optional FAQPage); `publisherLogoUrl` = site logo |
| `CourseJsonLd` | Leaf course detail (`!hasChildren`) |
| `ServiceJsonLd` | Leaf service detail |
| `EventJsonLd` | Event detail |
| `FaqPageJsonLd` / `buildFaqPageSchema` | FAQ blocks on detail pages |
| `BreadcrumbJsonLd` | Nested course/service pages |
| WebSite `SearchAction` | `/search?q={search_term_string}` |

## Search & index control

- Unified search: `/search?q=…` — `noIndex: true` on result pages.
- `/search` is **not** in sitemap.
- Legacy `/posts?q=…` redirects to `/search`.
- CMS `seo.noIndex` documents are excluded from sitemap GROQ.

## Sitemap

- Static routes only (no `/search`).
- Dynamic routes include `lastModified` from CMS `_updatedAt` / `publishedAt`.
- Slug queries filter `coalesce(seo.noIndex, false) != true`.

## HTML & a11y

- One **`h1` per page**; logical heading hierarchy.
- Semantic tags: `main`, `nav`, `section`, `article`, `header`, `footer`.
- Skip link + `#main-content` (site layout).
- Target WCAG 2.2 Level AA. Keyboard-operable UI with visible focus.
- Associate labels with every form field; placeholder is not a label.
- Custom radiogroups: arrow-key navigation; only selected option `tabIndex={0}`.
- Respect `prefers-reduced-motion`. Trap focus in modals; Escape to close.
- Arabic/Urdu wrappers: set `lang` + `dir="rtl"` on the nearest text wrapper.

## Images & content

- Meaningful `alt` on content images; empty `alt=""` only when decorative.
- OG fallback: `public/og-default.png` when no CMS image.

## Avoid

- Client-only metadata hacks.
- Duplicate SEO title/description logic outside `lib/cms/page.ts` / `lib/seo/`.
- Hardcoded site name when `getSiteSettings()` / `resolveSiteName()` is available.
- Using article image as Organization `publisher.logo` in JSON-LD.
- Silently bypassing keyboard accessibility or removing focus rings.

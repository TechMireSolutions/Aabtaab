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
* Prefer **`z.infer<typeof schema>`** (and shared Zod schemas) for API/form shapes over parallel hand-written types.
* Prefer **`as const` + union types** over TypeScript `enum` for string unions used in this codebase.
* Use **`satisfies`** for config objects that should keep literal inference while checking against a type.
* Prefer `unknown` catch bindings: `catch (error: unknown)` then narrow.

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
- Skip link + `#main-content` (site layout); labeled `nav`s (main/footer).
- Target WCAG 2.2 Level AA. Keyboard-operable UI with visible `focus-visible` — do not remove focus rings.
- Associate labels with every form field; placeholder is not a label.
- Icon-only buttons need `aria-label`; decorative icons `aria-hidden`.
- Live regions (`aria-live` / `role="alert"`) for form success/error when status isn’t otherwise announced.
- Custom radiogroups: arrow-key navigation; only selected option `tabIndex={0}`.
- Respect `prefers-reduced-motion`. Trap focus in modals; Escape to close.
- Arabic/Urdu wrappers: set `lang` + `dir="rtl"` on the nearest text wrapper.
- Missing CMS documents for detail routes → **`notFound()`** (real 404), not an empty `200` page.
- JSON-LD must reflect **visible** content (no fake reviews, prices, or dates).

## Images & content

- Meaningful `alt` on content images; empty `alt=""` only when decorative.
- OG fallback: `public/og-default.png` when no CMS image.
- Prefer accurate Open Graph `type` (`website` vs `article`) via existing metadata builders.

## Avoid

- Client-only metadata hacks.
- Duplicate SEO title/description logic outside `lib/cms/page.ts` / `lib/seo/`.
- Hardcoded site name when `getSiteSettings()` / `resolveSiteName()` is available.
- Using article image as Organization `publisher.logo` in JSON-LD.
- Silently bypassing keyboard accessibility or removing focus rings.

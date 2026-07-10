---
trigger: always_on
glob:
description: DRY policy — extract shared logic, avoid duplication across pages and components
---

# DRY Policy

**Don't Repeat Yourself** — but **don't over-abstract**. DRY applies to *knowledge*, not character count.

**Rule of Three:** duplicate once is fine; duplicate twice — watch; duplicate **3+ times** — extract.

## Single source of truth (this repo)

| Concern | Home |
|---------|------|
| CMS page metadata | `defineCmsPageMetadata`, `buildNestedSlugMetadata` → `lib/cms/page.ts` |
| Cached Sanity reads | `getCmsPage`, `getSiteSettings`, `getPosts`, `getContactFormOptions`, … → `lib/cms/queries.ts` |
| Site name fallback | `DEFAULT_SITE_NAME`, `resolveSiteName()` → `lib/constants.ts` |
| Sitemap slugs | `getSitemapSlugs` → `lib/cms/queries.ts` |
| Site search | `searchSite` → `lib/cms/search.ts` |
| Production caching | `sanityFetch` → `sanity/lib/fetch.ts` (only place for `unstable_cache`) |
| Catalog page shell | `CatalogPageLayout` + `PageHeader` |
| Content sections | `components/content/*` |
| Contact footer block | `SiteContactFooter` |
| Footer CMS quick links | `footerNavQuery` → `getSiteLayoutData()` → `FooterNav` in `types/site-navigation.ts`; fallback `FALLBACK_QUICK_LINKS` in `Footer.tsx` |
| Nested child cards | `mapCourseChildForGrid`, `mapServiceChildForGrid` → `lib/catalog/` |
| Breadcrumbs / paths | `lib/paths.ts` |
| URL / formatting | `lib/urls.ts` |
| Contact form logic | `lib/contact/` (schema, notify, email-html) |
| Rate limiting / IP | `lib/rate-limit.ts`, `lib/request-ip.ts` |
| Default copy | `lib/fallbacks/` |
| Cache invalidation | `lib/revalidate.ts` + `CACHE_TAGS` |
| GROQ fragments | `sanity/lib/queries/fragments.ts` |
| Tailwind patterns | `@utility` in `app/globals.css` |
| Portable text | `ProseSection`, `PortableTextBody` |
| SEO / JSON-LD | `lib/seo/` |

## Page composition pattern

Pages **compose** — they do not reimplement markup:

```tsx
// ✅ compose shared sections
<PageHeader eyebrow={...} title={...} />
<FaqAccordionSection items={course.faqItems} />
<CtaBandSection primaryLabel={course.ctaPrimaryLabel} ... />
```

```tsx
// ❌ copy-paste FAQ markup into a second page
```

## Before adding new code, search for

1. Existing component in `components/content/` or `components/layout/`
2. Existing helper in `lib/cms/`, `lib/paths.ts`, `lib/urls.ts`, `lib/contact/`
3. Existing type in `types/` — extend `NestedContentDetail`, `CmsPageSummary`, etc.
4. Existing GROQ fragment in `fragments.ts`

## When to extract

| Signal | Action |
|--------|--------|
| Same JSX in **2+ pages** | New component in `components/content/` |
| Same fetch + cache pattern | Add to `lib/cms/queries.ts` |
| Same GROQ field projection | Add fragment to `fragments.ts` |
| Same class string **2+ times** | Add `@utility` in `globals.css` (see `02-tailwind-design-system`) |
| Same fallback copy in 2+ pages | Move to `lib/fallbacks/` |

## When NOT to DRY (acceptable duplication)

- Single-use layout unlikely to repeat.
- One-line wrappers that hide intent.
- Premature generic factories (mega query builder for one query).
- Course vs service pages that *look* similar but diverge in CMS fields — share sections, not one mega template.
- Test fixtures or story-specific mocks.

## Refactor checklist

When deduplicating existing code:

1. Extract to the closest domain folder (table above).
2. Update **all** call sites in one pass.
3. Delete dead duplicates and unused types/imports.
4. Run `npm run lint` + `npm run test` + `npm run build`.

## Anti-patterns

- **Shotgun surgery** — extracting to shared code without updating all consumers.
- **God components** — one file handling fetch + layout + 5 section types.
- **Stringly-typed props** — use shared types from `types/` instead of duplicating inline shapes.
- **Duplicate cache layers** — never add `unstable_cache` outside `sanity/lib/fetch.ts`.

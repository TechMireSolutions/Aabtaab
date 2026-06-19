---
trigger: glob
glob: {sanity,lib/cms,scripts}/**/*.{ts,tsx,mjs}
description: Sanity CMS schemas, GROQ, migrations, preview mode, and CMS page conventions
---

# Sanity CMS

## Layout

- Schemas: `sanity/schemaTypes/`
- GROQ: `sanity/lib/queries/` (domain-split: `posts`, `events`, `courses`, `services`, `site`, `search`, `fragments`)
- Read client: `sanity/lib/client.ts` (via `sanityFetch`)
- Preview client: `sanity/lib/previewClient.ts` (`previewDrafts` perspective)
- Write client: `sanity/lib/writeClient.ts` (contact submissions)
- Studio: `app/studio/`, `sanity.config.ts`
- Cached app reads: `lib/cms/queries.ts`
- Site search: `lib/cms/search.ts` + `siteSearchQuery`

## Current field names (post-migration)

| Legacy | Use |
|--------|-----|
| `faq` | `faqItems` |
| `seoTitle` / `seoDescription` | `seo` (seoObject) |
| `ctaBtn1Label` / `ctaBtn2Label` | `ctaPrimaryLabel` / `ctaSecondaryLabel` |
| `faqSectionHeading` | `faqHeading` |
| nested `desc` | `description` |
| `/articles` | `/posts` (301 redirects in `next.config.ts`) |

## Page pattern

```tsx
export const generateMetadata = defineCmsPageMetadata("about", {
  path: "/about",
  fallbackTitle: "About",
  fallbackDescription: "...",
});

const page = await getCmsPage("about");
const settings = await getSiteSettings();
```

## Draft / preview

- Enable: `GET /api/draft?secret=…&type=…&slug=…` — requires `SANITY_PREVIEW_SECRET` + `SANITY_API_TOKEN`
- Disable: `GET /api/draft/disable`
- UI: `PreviewBanner` in site layout when draft mode active

## Migrations

```bash
npm run migrate:sanity:dry   # preview
npm run migrate:sanity       # apply on server before build when schema/data changed
```

## Revalidation

Webhook: `POST /api/revalidate` → `lib/revalidate.ts` + `CACHE_TAGS`.

Supported `_type` values include: `post`, `course`, `service`, `event`, `page`, `siteSettings`, `homepageSettings`, `navigation`, `testimonial`.

## Images

Use `sanity/lib/image.ts` helpers: `cardImageUrl`, `heroImageUrl`, `ogImageUrl`, `articleHeroImageUrl`.

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
Set up Sanity webhooks connected to a Next.js API route (`/api/revalidate`) using `revalidatePath` or `revalidateTag`. This ensures search engines see fresh content dynamically without requiring full application rebuilds on Hetzner.

Supported `_type` values include: `post`, `course`, `service`, `event`, `page`, `siteSettings`, `homepageSettings`, `navigation`, `testimonial`.

Navigation documents: `title == "header"` → `headerNavQuery`; `title == "footer"` → `footerNavQuery` (fetched in `getSiteLayoutData()`).

## Schema Design

Each public content type should contain appropriate fields for: Title, Slug, Status, Main content, Excerpt, Featured image, Alternative text, dates, and an **`seo` object** (`metaTitle`, `metaDescription`, `ogImage`, `noIndex` as applicable — not flat legacy `seoTitle` / `seoDescription` fields).
* Use schema validation for required fields and length constraints. Do not make every field optional.
* **Mandatory Alt Text:** Enforce `validation: Rule.required()` for alt text fields on all image schemas within Sanity to ensure SEO and accessibility compliance.
* Prevent duplicate or invalid slugs where possible.
* Provide helpful field descriptions for content editors.

## GROQ Queries & Data Fetching

* Store reusable GROQ queries in dedicated query files (`sanity/lib/queries/`). Do not scatter long GROQ strings across page files.
* Use query parameters for dynamic values. **Never** concatenate untrusted input into GROQ strings.
* Project only required fields; avoid deeply expanded references when a small projection is enough.
* Return stable shapes that can be easily typed in TypeScript.
* Test queries against missing and incomplete documents.
* Run independent requests concurrently with `Promise.all` instead of sequential waterfalls.

## Portable Text

* Use central Portable Text components (`ProseSection`, `PortableTextBody`).
* **Semantic Portable Text:** Configure the `@portabletext/react` components to output strictly semantic HTML (e.g., `<h2>`, `<h3>`, `<blockquote>`, `<p>`, `<ul>`, `<li>`) rather than heavily nested or generic `<div>` tags.
* **Do not** allow arbitrary HTML injection. Handle unknown block types safely.
* Ensure Portable Text headings follow the page's heading hierarchy.
* Optimise Portable Text images through the approved image pipeline.

## Images

Use `sanity/lib/image.ts` helpers: `cardImageUrl`, `heroImageUrl`, `ogImageUrl`, `articleHeroImageUrl`.


---
name: sanity-cms
description: >-
  Sanity schemas, GROQ queries, field migrations, preview mode, and CMS page
  patterns for Aabtaab. Use when editing sanity/, lib/cms/, or migration scripts.
  Rule: 03-sanity-cms.
---

# Sanity CMS

**Rule:** `.cursor/rules/03-sanity-cms.mdc` · **Reference:** `techstack.md` § CMS

## Key files

| Area | Path |
|------|------|
| Schemas | `sanity/schemaTypes/` |
| GROQ | `sanity/lib/queries/` (posts, events, courses, services, site, search, fragments) — `site.ts` exports `headerNavQuery` + `footerNavQuery` |
| Fetch + cache | `sanity/lib/fetch.ts` (`sanityFetch`, `CACHE_TAGS`) |
| Preview | `sanity/lib/previewClient.ts`, `app/api/draft/` |
| Write | `sanity/lib/writeClient.ts` (contact submissions) |
| App facade | `lib/cms/queries.ts`, `lib/cms/page.ts`, `lib/cms/search.ts` |
| Migrations | `scripts/migrate-sanity-fields.mjs` |

## Document types

`post`, `category`, `author`, `page`, `course`, `courseLevel`, `service`, `event`, `siteSettings`, `navigation`, `homepageSettings`, `testimonial`, `contactSubmission` + `seoObject`.

## Commands

```bash
npm run migrate:sanity:dry
npm run migrate:sanity
```

## Draft / preview

```bash
# .env
SANITY_PREVIEW_SECRET=...
SANITY_API_TOKEN=...   # read + draft access
```

Preview entry: `/api/draft?secret=…&type=post&slug=my-slug`  
Exit: `/api/draft/disable` or amber banner link.

When draft mode is active, `sanityFetch` uses preview client and bypasses ISR cache.

## Schema & Portable Text Standards

- **Mandatory Alt Text:** Enforce `validation: Rule.required()` for alt text fields on all image schemas within Sanity to ensure proper image accessibility and search engine crawls.
- **Semantic Portable Text:** Configure the `@portabletext/react` components to output strictly semantic HTML (e.g., `<h2>`, `<h3>`, `<blockquote>`, `<p>`, `<ul>`, `<li>`) rather than heavily nested or generic `<div>` tags.

## On-Demand Revalidation (ISR)

Set up Sanity webhooks connected to a Next.js API route (`/api/revalidate`) using `revalidatePath` or `revalidateTag`. This ensures search engines see fresh content without requiring full application rebuilds on Hetzner.


## Deploy note

On server, run migrations **before** `npm run build` when CMS fields changed.

## Field names (canonical)

Use migrated names — see rule `03-sanity-cms` for legacy → current table.

## Adding a new document type

1. Schema in `sanity/schemaTypes/` + register in `index.ts`
2. GROQ in `sanity/lib/queries/{domain}.ts` (+ fragments if shared)
3. Getter in `lib/cms/queries.ts` if used by pages
4. Types in `types/` (and Zod if user-facing writes)
5. `CACHE_TAGS` + webhook case in `app/api/revalidate/route.ts`
6. Sitemap entry if public + indexable (`seo.noIndex` filter)
7. Metadata + JSON-LD if detail page
8. Null-safe UI until legacy documents are migrated

## Schema change checklist

Schema → GROQ → types → migration (`migrate:sanity:dry` then apply) → revalidate tags → UI. Use published perspective publicly; drafts only via preview client.

## Verify

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

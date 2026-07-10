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

## Deploy note

On server, run migrations **before** `npm run build` when CMS fields changed.

## Field names (canonical)

Use migrated names — see rule `03-sanity-cms` for legacy → current table.

## Adding a new document type

1. Schema in `sanity/schemaTypes/` + register in `index.ts`
2. GROQ in `sanity/lib/queries/{domain}.ts`
3. Getter in `lib/cms/queries.ts` if used by pages
4. `CACHE_TAGS` + webhook case in `app/api/revalidate/route.ts`
5. Sitemap entry if public + indexable

## Verify

```bash
npm run lint
npm run build
```

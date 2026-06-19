---
name: events-feature
description: >-
  Aabtaab events catalog — listing, detail pages, Event JSON-LD, sitemap, and
  homepage carousel. Use when editing /events routes, event cards, or event CMS
  integration. Routes are implemented — extend, don't recreate from scratch.
---

# Events Feature

## Current state (implemented)

| Layer | Location |
|-------|----------|
| Sanity schema | `sanity/schemaTypes/event.ts` |
| GROQ queries | `sanity/lib/queries/events.ts` |
| Cached getters | `getEvents`, `getEventBySlug` in `lib/cms/queries.ts` |
| List page | `app/(site)/events/page.tsx` |
| Detail page | `app/(site)/events/[slug]/page.tsx` |
| Event cards | `components/content/EventCardGrid.tsx` |
| JSON-LD | `EventJsonLd` in `lib/seo/JsonLd.tsx` |
| Sitemap | Event slugs in `app/sitemap.ts` |
| Revalidation | `CACHE_TAGS.events`, `CACHE_TAGS.event(slug)`; webhook case `"event"` |
| Homepage | Upcoming events carousel (when CMS data exists) |
| Nav | Header fallback nav includes `/events` |

## Data fetch pattern

```tsx
import { getEventBySlug, getEvents } from "@/lib/cms/queries";
import { sanityFetch, CACHE_TAGS } from "@/sanity/lib/fetch";
```

Use existing getters — do not duplicate GROQ in page files.

## Metadata

Use `buildPageMetadata` from `lib/seo/metadata.ts` (or helpers in `lib/cms/event.ts` if present) with:

- Title, description from event document
- Path `/events/{slug}`
- OG image from event featured image when available

## Detail page stack

Typical: hero/info → portable text or description → `EventJsonLd` → optional CTA

## Draft preview

Preview URL: `/api/draft?secret=…&type=event&slug={slug}`

## When extending

- New event fields → update schema + GROQ fragment + detail page sections
- New list filters → extend `events.ts` queries + list page, tag fetches appropriately

## Verify

```bash
npm run lint
npm run test
npm run build
```

---
name: cache-revalidation
description: >-
  Manages Next.js cache invalidation for Sanity via webhook and CACHE_TAGS.
  Use when editing app/api/revalidate/route.ts, sanityFetch tags, or Sanity
  publish webhooks.
---

# Cache Revalidation

## How caching works

| Mode | Behavior |
|------|----------|
| **Development** | `sanityFetch` calls Sanity directly (no ISR cache) |
| **Draft preview** | `sanityFetch` uses preview client, no cache |
| **Production** | `sanityFetch` wraps `unstable_cache` with tags (`sanity/lib/fetch.ts`) |

**Rule:** Do not add `unstable_cache` elsewhere — extend `sanityFetch` or tag fetches.

## CACHE_TAGS (`sanity/lib/fetch.ts`)

`sanity-all`, `sanity-posts`, `sanity-post-{slug}`, `sanity-courses`, `sanity-course-{slug}`, `sanity-services`, `sanity-service-{slug}`, `sanity-pages`, `sanity-page-{slug}`, `sanity-site-settings`, `sanity-homepage`, `sanity-events`, `sanity-event-{slug}`

Pass relevant tags in each `sanityFetch` call.

## Webhook route

`POST /api/revalidate` — `app/api/revalidate/route.ts`

Set up Sanity webhooks connected to this Next.js API route using **`revalidateTag`** via `lib/revalidate.ts` (`revalidateSlugCollection`, `REVALIDATE_OPTIONS = { expire: 0 }`). Do **not** call bare `revalidateTag(tag)` or invent broad `revalidatePath` for CMS unless a path-specific UX requires it. This keeps search engines fresh without full rebuilds on Hetzner.

**Auth:** header `x-sanity-webhook-secret` or query `?secret=` must match `SANITY_REVALIDATE_SECRET` (falls back to `REVALIDATE_SECRET` if unset — see `lib/env.ts` / techstack). Prefer header auth when changing webhook setup. When tightening comparison, use **`crypto.timingSafeEqual`** on equal-length buffers.

**Body:** `{ _type, slug?: { current } }`

| `_type` | Tags revalidated |
|---------|------------------|
| `post` | posts + post slug |
| `course` | courses + course slug |
| `service` | services + service slug |
| `event` | events + event slug |
| `siteSettings` | siteSettings |
| `homepageSettings` | homepage |
| `navigation`, `testimonial` | siteSettings |
| `page` | pages + page slug |

Always revalidates `sanity-all` first.

## Helper

`lib/revalidate.ts` — `revalidateSlugCollection()`, `REVALIDATE_OPTIONS` (`{ expire: 0 }` for Next 16 tag invalidation).

## Optional (not used)

Partial Prerendering / `"use cache"` are **not** enabled. Caching SSOT remains `sanityFetch` → `unstable_cache` + tags. Do not enable in drive-by PRs.

## Sanity webhook setup

URL: `https://aabtaab.com/api/revalidate?secret=YOUR_SECRET`

Filter payload to include `_type` and `slug.current`.

## Adding a new content type

1. Add tag(s) to `CACHE_TAGS`
2. Tag fetches in queries/pages
3. Add `case` in webhook route switch
4. Add sitemap entries if public

## Tests

`lib/revalidate.test.ts`

## Verify

```bash
npm run test
npm run lint
```

import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { CACHE_TAGS } from '@/sanity/lib/sanityFetch'

// ── Sanity On-Demand Revalidation Webhook ─────────────────────────────────────
//
// Setup in Sanity:
//   Sanity Dashboard → API → Webhooks → Create webhook
//   URL:    https://yourdomain.com/api/revalidate
//   Secret: match SANITY_REVALIDATE_SECRET in .env.local
//   Filter: _type in ["post","event","course","service","siteSettings","homepageSettings"]
//   Trigger: publish, unpublish, delete
//
// Why on-demand instead of time-based?
//   Time-based ISR (revalidate: 3600) means stale content for up to 1 hour.
//   On-demand revalidation fires the moment an editor publishes, so the live
//   site reflects changes within seconds — while keeping full static performance.

const SANITY_REVALIDATE_SECRET = process.env.SANITY_REVALIDATE_SECRET

export async function POST(request: NextRequest) {
  // ── Auth check ───────────────────────────────────────────────────────────
  const secret = request.headers.get('x-sanity-webhook-secret')
    ?? new URL(request.url).searchParams.get('secret')

  if (!SANITY_REVALIDATE_SECRET || secret !== SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  // ── Parse webhook body ────────────────────────────────────────────────────
  let body: { _type?: string; slug?: { current?: string } }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 })
  }

  const { _type, slug } = body
  const revalidated: string[] = []

  // ── Granular tag invalidation by document type ───────────────────────────
  // Always revalidate the global "all" tag + type-specific tag.
  // When a slug is present, also invalidate the single-document tag so only
  // that page cold-misses on the next request, not the entire type list.

  revalidateTag(CACHE_TAGS.all)
  revalidated.push(CACHE_TAGS.all)

  switch (_type) {
    case 'post': {
      revalidateTag(CACHE_TAGS.posts)
      revalidated.push(CACHE_TAGS.posts)
      if (slug?.current) {
        const tag = CACHE_TAGS.post(slug.current)
        revalidateTag(tag)
        revalidated.push(tag)
      }
      break
    }
    case 'event': {
      revalidateTag(CACHE_TAGS.events)
      revalidated.push(CACHE_TAGS.events)
      if (slug?.current) {
        const tag = CACHE_TAGS.event(slug.current)
        revalidateTag(tag)
        revalidated.push(tag)
      }
      break
    }
    case 'course': {
      revalidateTag(CACHE_TAGS.courses)
      revalidated.push(CACHE_TAGS.courses)
      if (slug?.current) {
        const tag = CACHE_TAGS.course(slug.current)
        revalidateTag(tag)
        revalidated.push(tag)
      }
      break
    }
    case 'service': {
      revalidateTag(CACHE_TAGS.services)
      revalidated.push(CACHE_TAGS.services)
      if (slug?.current) {
        const tag = CACHE_TAGS.service(slug.current)
        revalidateTag(tag)
        revalidated.push(tag)
      }
      break
    }
    case 'siteSettings': {
      revalidateTag(CACHE_TAGS.siteSettings)
      revalidated.push(CACHE_TAGS.siteSettings)
      break
    }
    case 'homepageSettings': {
      revalidateTag(CACHE_TAGS.homepage)
      revalidated.push(CACHE_TAGS.homepage)
      break
    }
    default: {
      // Unknown type — already revalidated the global tag above
    }
  }

  return NextResponse.json({ revalidated, now: new Date().toISOString() })
}

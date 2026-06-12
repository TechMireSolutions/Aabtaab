import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { CACHE_TAGS } from "@/sanity/lib/sanityFetch";

// Webhook called by Sanity on publish/unpublish/delete events.
// expire: 0 forces immediate cache expiry (required for external webhook callers).
// Setup: Sanity Dashboard → API → Webhooks
//   URL:    https://yourdomain.com/api/revalidate
//   Secret: match SANITY_REVALIDATE_SECRET in .env.local
//   Filter: _type in ["post","event","course","service","siteSettings","homepageSettings"]

const SANITY_REVALIDATE_SECRET = process.env.SANITY_REVALIDATE_SECRET;

export async function POST(request: NextRequest) {
  const secret =
    request.headers.get("x-sanity-webhook-secret") ??
    new URL(request.url).searchParams.get("secret");

  if (!SANITY_REVALIDATE_SECRET || secret !== SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  let body: { _type?: string; slug?: { current?: string } };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const { _type, slug } = body;
  const revalidated: string[] = [];
  const OPT = { expire: 0 } as const;

  revalidateTag(CACHE_TAGS.all, OPT);
  revalidated.push(CACHE_TAGS.all);

  switch (_type) {
    case "post": {
      revalidateTag(CACHE_TAGS.posts, OPT);
      revalidated.push(CACHE_TAGS.posts);
      if (slug?.current) {
        const tag = CACHE_TAGS.post(slug.current);
        revalidateTag(tag, OPT);
        revalidated.push(tag);
      }
      break;
    }
    case "event": {
      revalidateTag(CACHE_TAGS.events, OPT);
      revalidated.push(CACHE_TAGS.events);
      if (slug?.current) {
        const tag = CACHE_TAGS.event(slug.current);
        revalidateTag(tag, OPT);
        revalidated.push(tag);
      }
      break;
    }
    case "course": {
      revalidateTag(CACHE_TAGS.courses, OPT);
      revalidated.push(CACHE_TAGS.courses);
      if (slug?.current) {
        const tag = CACHE_TAGS.course(slug.current);
        revalidateTag(tag, OPT);
        revalidated.push(tag);
      }
      break;
    }
    case "service": {
      revalidateTag(CACHE_TAGS.services, OPT);
      revalidated.push(CACHE_TAGS.services);
      if (slug?.current) {
        const tag = CACHE_TAGS.service(slug.current);
        revalidateTag(tag, OPT);
        revalidated.push(tag);
      }
      break;
    }
    case "siteSettings": {
      revalidateTag(CACHE_TAGS.siteSettings, OPT);
      revalidated.push(CACHE_TAGS.siteSettings);
      break;
    }
    case "homepageSettings": {
      revalidateTag(CACHE_TAGS.homepage, OPT);
      revalidated.push(CACHE_TAGS.homepage);
      break;
    }
  }

  return NextResponse.json({ revalidated, now: new Date().toISOString() });
}

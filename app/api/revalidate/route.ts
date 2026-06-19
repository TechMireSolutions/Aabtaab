import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { CACHE_TAGS } from "@/sanity/lib/fetch";
import {
  REVALIDATE_OPTIONS,
  revalidateSlugCollection,
} from "@/lib/revalidate";

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

  revalidateTag(CACHE_TAGS.all, REVALIDATE_OPTIONS);
  revalidated.push(CACHE_TAGS.all);

  switch (_type) {
    case "post":
      revalidateSlugCollection(
        revalidated,
        CACHE_TAGS.posts,
        CACHE_TAGS.post,
        slug?.current,
      );
      break;
    case "event":
      revalidateSlugCollection(
        revalidated,
        CACHE_TAGS.events,
        CACHE_TAGS.event,
        slug?.current,
      );
      break;
    case "course":
      revalidateSlugCollection(
        revalidated,
        CACHE_TAGS.courses,
        CACHE_TAGS.course,
        slug?.current,
      );
      break;
    case "service":
      revalidateSlugCollection(
        revalidated,
        CACHE_TAGS.services,
        CACHE_TAGS.service,
        slug?.current,
      );
      break;
    case "siteSettings":
      revalidateTag(CACHE_TAGS.siteSettings, REVALIDATE_OPTIONS);
      revalidated.push(CACHE_TAGS.siteSettings);
      break;
    case "homepageSettings":
      revalidateTag(CACHE_TAGS.homepage, REVALIDATE_OPTIONS);
      revalidated.push(CACHE_TAGS.homepage);
      break;
    case "navigation":
    case "testimonial":
      revalidateTag(CACHE_TAGS.siteSettings, REVALIDATE_OPTIONS);
      revalidated.push(CACHE_TAGS.siteSettings);
      break;
    case "page":
      revalidateTag(CACHE_TAGS.pages, REVALIDATE_OPTIONS);
      revalidated.push(CACHE_TAGS.pages);
      if (slug?.current) {
        revalidateTag(CACHE_TAGS.page(slug.current), REVALIDATE_OPTIONS);
        revalidated.push(CACHE_TAGS.page(slug.current));
      }
      break;
  }

  return NextResponse.json({ revalidated, now: new Date().toISOString() });
}

import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

const PREVIEW_SECRET = process.env.SANITY_PREVIEW_SECRET;

/** Map Sanity _type (+ optional slug) to site path for preview redirect */
function previewPath(
  type: string | null,
  slug: string | null,
): string {
  switch (type) {
    case "post":
      return slug ? `/posts/${slug}` : "/posts";
    case "event":
      return slug ? `/events/${slug}` : "/events";
    case "course":
      return slug ? `/online-courses/${slug}` : "/online-courses";
    case "service":
      return slug ? `/services/${slug}` : "/services";
    case "page":
      return slug ? `/${slug}` : "/";
    case "homepageSettings":
      return "/";
    default:
      return slug?.startsWith("/") ? slug : slug ? `/${slug}` : "/";
  }
}

export async function GET(request: NextRequest) {
  const secret =
    request.nextUrl.searchParams.get("secret") ??
    request.headers.get("x-sanity-preview-secret");

  if (!PREVIEW_SECRET || secret !== PREVIEW_SECRET) {
    return new Response("Invalid preview secret", { status: 401 });
  }

  const slug = request.nextUrl.searchParams.get("slug");
  const type = request.nextUrl.searchParams.get("type");

  const draft = await draftMode();
  draft.enable();

  redirect(previewPath(type, slug));
}

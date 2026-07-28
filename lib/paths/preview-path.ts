const ALLOWED_EXACT = new Set([
  "/",
  "/about",
  "/contact",
  "/donate",
  "/reviews",
  "/scholars",
  "/search",
  "/dar-ul-quran",
  "/privacy-policy",
  "/terms-of-service",
  "/posts",
  "/events",
  "/online-courses",
  "/services",
]);

const ALLOWED_PREFIXES = [
  "/posts/",
  "/events/",
  "/online-courses/",
  "/services/",
] as const;

function isSafeInternalPath(path: string): boolean {
  if (!path.startsWith("/") || path.startsWith("//")) return false;
  if (path.includes("://") || path.includes("\\")) return false;
  if (ALLOWED_EXACT.has(path)) return true;
  return ALLOWED_PREFIXES.some((prefix) => path.startsWith(prefix));
}

/**
 * Map Sanity document type (+ optional slug) to an internal preview path.
 * Rejects open redirects (protocol-relative, absolute URLs).
 */
export function previewPath(
  type: string | null,
  slug: string | null,
): string {
  let path: string;
  switch (type) {
    case "post":
      path = slug ? `/posts/${slug}` : "/posts";
      break;
    case "event":
      path = slug ? `/events/${slug}` : "/events";
      break;
    case "course":
      path = slug ? `/online-courses/${slug}` : "/online-courses";
      break;
    case "service":
      path = slug ? `/services/${slug}` : "/services";
      break;
    case "page":
      path = slug ? `/${slug.replace(/^\/+/, "")}` : "/";
      break;
    case "homepageSettings":
      path = "/";
      break;
    default:
      if (!slug) {
        path = "/";
      } else if (slug.startsWith("/")) {
        path = slug;
      } else {
        path = `/${slug}`;
      }
  }

  return isSafeInternalPath(path) ? path : "/";
}

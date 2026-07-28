import type { ContentAncestor, SlugParent } from "@/types/sanity";

export function buildNestedContentPath(
  base: "online-courses" | "services",
  slug: string,
  parent?: SlugParent | null,
): string {
  const segments: string[] = [];
  let cur: SlugParent | null | undefined = parent;
  while (cur?.slug) {
    segments.unshift(cur.slug);
    cur = cur.parent;
  }
  segments.push(slug);
  return `/${base}/${segments.join("/")}`;
}

/** Walk parent references returned from deep course/service GROQ queries */
export function getContentAncestry(item: {
  parent?: ContentAncestor;
}): ContentAncestor[] {
  const chain: ContentAncestor[] = [];
  let cur: ContentAncestor | undefined = item.parent;
  while (cur) {
    chain.unshift({ title: cur.title, slug: cur.slug, parent: cur.parent });
    cur = cur.parent as ContentAncestor | undefined;
  }
  return chain;
}

export function ancestryPathSegment(
  ancestry: ContentAncestor[],
  index: number,
): string {
  return ancestry
    .slice(0, index + 1)
    .map((item) => item.slug)
    .join("/");
}

export function buildNestedBreadcrumbItems(
  base: "online-courses" | "services",
  baseLabel: string,
  ancestry: ContentAncestor[],
  currentTitle: string,
  currentPath: string,
  siteUrl: string,
): Array<{ name: string; url: string }> {
  const basePath = `/${base}`;
  return [
    { name: "Home", url: siteUrl },
    { name: baseLabel, url: `${siteUrl}${basePath}` },
    ...ancestry.map((item, index) => ({
      name: item.title,
      url: `${siteUrl}${basePath}/${ancestryPathSegment(ancestry, index)}`,
    })),
    { name: currentTitle, url: `${siteUrl}${currentPath}` },
  ];
}

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

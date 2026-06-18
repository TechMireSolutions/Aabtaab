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

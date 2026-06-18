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

import { revalidateTag } from "next/cache";

export const REVALIDATE_OPTIONS = { expire: 0 } as const;

export function revalidateSlugCollection(
  revalidated: string[],
  collectionTag: string,
  slugTag: (slug: string) => string,
  slug?: string,
) {
  revalidateTag(collectionTag, REVALIDATE_OPTIONS);
  revalidated.push(collectionTag);

  if (slug) {
    const itemTag = slugTag(slug);
    revalidateTag(itemTag, REVALIDATE_OPTIONS);
    revalidated.push(itemTag);
  }
}

import { cache } from "react";
import { sanityFetch, CACHE_TAGS } from "@/sanity/lib/fetch";
import { siteSearchQuery } from "@/sanity/lib/queries";
import type { SiteSearchResult } from "@/types/search";

export const searchSite = cache(async (term: string) => {
  const trimmed = term.trim();
  if (!trimmed) return [] as SiteSearchResult[];

  return sanityFetch<SiteSearchResult[]>({
    query: siteSearchQuery,
    params: { term: trimmed },
    tags: [CACHE_TAGS.all],
    revalidate: 3600,
  });
});

import { cache } from "react";
import { sanityFetch, CACHE_TAGS } from "@/sanity/lib/fetch";
import { siteSearchQuery } from "@/sanity/lib/queries";
import type { SiteSearchResult, SearchResponse } from "@/types/search";
import { matchKeyword, getSuggestions } from "@/lib/cms/keywords";

export const searchSite = cache(async (term: string): Promise<SearchResponse> => {
  const trimmed = term.trim();
  if (!trimmed) {
    return { keywordMatch: null, suggestions: [], results: [] };
  }

  const keywordMatch = matchKeyword(trimmed);
  const suggestions = getSuggestions(trimmed);

  const lowerTerm = trimmed.toLowerCase();

  const matchTypes: string[] = [];
  if (lowerTerm.includes("course")) matchTypes.push("course");
  if (lowerTerm.includes("service")) matchTypes.push("service");
  if (lowerTerm.includes("event")) matchTypes.push("event");
  if (lowerTerm.includes("post") || lowerTerm.includes("blog") || lowerTerm.includes("article")) {
    matchTypes.push("post");
  }

  const genericWords = ["online", "course", "courses", "service", "services", "event", "events", "post", "posts", "blog", "blogs", "article", "articles"];
  const searchWords = lowerTerm.split(/\s+/).filter(word => !genericWords.includes(word));
  const refinedTerm = searchWords.join(" ");

  const results = await sanityFetch<SiteSearchResult[]>({
    query: siteSearchQuery,
    params: {
      term: refinedTerm,
      hasTerm: refinedTerm.length > 0,
      rawTerm: trimmed,
      matchTypes,
    },
    tags: [CACHE_TAGS.all],
    revalidate: 3600,
  });

  return { keywordMatch, suggestions, results: results ?? [] };
});

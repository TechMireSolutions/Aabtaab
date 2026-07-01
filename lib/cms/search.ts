import { cache } from "react";
import { sanityFetch, CACHE_TAGS } from "@/sanity/lib/fetch";
import { siteSearchQuery } from "@/sanity/lib/queries";
import type { SiteSearchResult } from "@/types/search";

export const searchSite = cache(async (term: string) => {
  const trimmed = term.trim();
  if (!trimmed) return [] as SiteSearchResult[];

  const lowerTerm = trimmed.toLowerCase();
  
  // Define what document types to automatically include if the search term matches their category
  const matchTypes: string[] = [];
  if (lowerTerm.includes("course")) matchTypes.push("course");
  if (lowerTerm.includes("service")) matchTypes.push("service");
  if (lowerTerm.includes("event")) matchTypes.push("event");
  if (lowerTerm.includes("post") || lowerTerm.includes("blog") || lowerTerm.includes("article")) {
    matchTypes.push("post");
  }

  // Remove generic words from the term to prevent them from failing the exact GROQ match
  // For example, if a user searches "tajweed courses", we want to search for "tajweed" because "courses" might not be in the title.
  const genericWords = ["online", "course", "courses", "service", "services", "event", "events", "post", "posts", "blog", "blogs", "article", "articles"];
  const searchWords = lowerTerm.split(/\s+/).filter(word => !genericWords.includes(word));
  const refinedTerm = searchWords.join(" ");

  return sanityFetch<SiteSearchResult[]>({
    query: siteSearchQuery,
    params: { 
      term: refinedTerm, // This might be empty if they only typed "online courses"
      hasTerm: refinedTerm.length > 0,
      rawTerm: trimmed,
      matchTypes 
    },
    tags: [CACHE_TAGS.all],
    revalidate: 3600,
  });
});

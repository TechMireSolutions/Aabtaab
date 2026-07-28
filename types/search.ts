export type SearchResultType = "post" | "course" | "service" | "event";

export interface SiteSearchResult {
  _id: string;
  _type: SearchResultType;
  title: string;
  slug: string;
  href: string;
  summary?: string;
}

export interface KeywordMatch {
  label: string;
  href: string;
  category: "service" | "course" | "event" | "article";
}

export interface SearchResponse {
  keywordMatch: KeywordMatch | null;
  suggestions: KeywordMatch[];
  results: SiteSearchResult[];
}

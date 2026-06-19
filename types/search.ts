export type SearchResultType = "post" | "course" | "service" | "event";

export interface SiteSearchResult {
  _id: string;
  _type: SearchResultType;
  title: string;
  slug: string;
  href: string;
  summary?: string;
}

export const SEARCH_TYPE_LABELS: Record<SearchResultType, string> = {
  post: "Article",
  course: "Course",
  service: "Service",
  event: "Event",
};

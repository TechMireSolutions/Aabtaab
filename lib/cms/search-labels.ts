import type { SearchResultType } from "@/types/search";

export const SEARCH_TYPE_LABELS: Record<SearchResultType, string> = {
  post: "Article",
  course: "Course",
  service: "Service",
  event: "Event",
};

/** Label for a CMS search type or keyword category (palette + /search). */
export function searchTypeLabel(typeOrCategory: string): string {
  return (
    SEARCH_TYPE_LABELS[typeOrCategory as SearchResultType] || typeOrCategory
  );
}

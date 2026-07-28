import type { NavItem } from "@/types/site-navigation";

/** Paths to hide from footer/header when the related catalog is empty */
const EMPTY_CATALOG_HREFS: Record<string, keyof CatalogCounts> = {
  "/scholars": "scholars",
  "/events": "events",
  "/posts": "posts",
};

export interface CatalogCounts {
  scholars: number;
  events: number;
  posts: number;
}

export function filterNavForEmptyCatalogs(
  items: NavItem[] | undefined,
  counts: CatalogCounts,
): NavItem[] {
  if (!items?.length) return [];
  return items.filter((item) => {
    const path = item.href?.split("?")[0]?.replace(/\/$/, "") || "";
    const countKey = EMPTY_CATALOG_HREFS[path];
    if (!countKey) return true;
    return counts[countKey] > 0;
  });
}

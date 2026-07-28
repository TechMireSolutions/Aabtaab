import type { NavItem } from "@/types/site-navigation";

/** Paths to hide from footer/header when the related catalog is empty */
const EMPTY_CATALOG_HREFS: Record<string, keyof CatalogCounts> = {
  "/scholars": "scholars",
  "/events": "events",
  "/posts": "posts",
  "/articles": "posts",
};

export interface CatalogCounts {
  /** null = unknown (CMS outage) — fail open and keep the link */
  scholars: number | null;
  events: number | null;
  posts: number | null;
}

function normalizeNavPath(href: string | undefined): string {
  return href?.split("?")[0]?.replace(/\/$/, "") || "";
}

export function filterNavForEmptyCatalogs(
  items: NavItem[] | undefined,
  counts: CatalogCounts,
): NavItem[] {
  if (!items?.length) return [];
  return items.filter((item) => {
    const path = normalizeNavPath(item.href);
    const countKey = EMPTY_CATALOG_HREFS[path];
    if (!countKey) return true;
    const count = counts[countKey];
    if (count === null || count === undefined) return true;
    return count > 0;
  });
}

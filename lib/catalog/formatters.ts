/** Catalog list/card presentation helpers (price · duration, CTA labels). */

export const COURSE_NESTED_CTA_LABELS = {
  parent: "View Courses",
  leaf: "Enroll Now",
} as const;

export const SERVICE_NESTED_CTA_LABELS = {
  parent: "View Services",
  leaf: "Book Now",
} as const;

export type NestedCtaLabels = {
  parent: string;
  leaf: string;
};

export function formatPriceDuration(
  price?: string,
  duration?: string,
): string | null {
  const parts = [price, duration].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : null;
}

export function nestedListCtaLabel(
  childCount: number | undefined,
  labels: NestedCtaLabels,
): string {
  return childCount && childCount > 0 ? labels.parent : labels.leaf;
}

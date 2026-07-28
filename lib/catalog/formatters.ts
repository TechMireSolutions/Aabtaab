/** Catalog list/card presentation helpers (price · duration, CTA labels). */

export function formatPriceDuration(
  price?: string,
  duration?: string,
): string | null {
  const parts = [price, duration].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : null;
}

export function nestedListCtaLabel(
  childCount: number | undefined,
  labels: { parent: string; leaf: string },
): string {
  return childCount && childCount > 0 ? labels.parent : labels.leaf;
}

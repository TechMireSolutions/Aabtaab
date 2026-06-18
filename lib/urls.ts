/** Strip non-digits and build a WhatsApp chat URL */
export function whatsappUrl(
  number: string,
  message = "Assalamu Alaikum, I have an inquiry about your services.",
): string {
  const clean = number.replace(/\D/g, "");
  if (!clean) return "/contact";
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

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

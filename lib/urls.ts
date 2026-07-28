/** Strip non-digits and build a WhatsApp chat URL */
export function whatsappUrl(
  number: string,
  message = "Assalamu Alaikum, I have an inquiry about your services.",
): string {
  const clean = number.replace(/\D/g, "");
  if (!clean) return "/contact";
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

/** Prefer CMS maps link; otherwise Google Maps search for the address. */
export function mapsUrl(
  address: string,
  addressLink?: string | null,
): string {
  const custom = addressLink?.trim();
  if (custom) return custom;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

/** Safe defaults for links that open a new browsing context */
export const EXTERNAL_LINK_PROPS = {
  target: "_blank",
  rel: "noopener noreferrer",
} as const;

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

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

const ALLOWED_SCHEMES = /^(https?:|mailto:|tel:)/i;

/**
 * Allow only http(s), mailto, and tel hrefs from CMS / user-provided contact fields.
 * Returns null when the value is empty or uses a disallowed scheme.
 */
export function safeContactHref(value: string | null | undefined): string | null {
  const raw = value?.trim();
  if (!raw) return null;

  if (raw.includes("@") && !ALLOWED_SCHEMES.test(raw)) {
    return `mailto:${raw}`;
  }

  if (ALLOWED_SCHEMES.test(raw)) {
    // Block protocol-relative / open redirects disguised as paths
    if (raw.startsWith("//")) return null;
    return raw;
  }

  // Bare phone numbers
  if (/^\+?[\d\s().-]{7,}$/.test(raw)) {
    return `tel:${raw.replace(/[^\d+]/g, "")}`;
  }

  return null;
}

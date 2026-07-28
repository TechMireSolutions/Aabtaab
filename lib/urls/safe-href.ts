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

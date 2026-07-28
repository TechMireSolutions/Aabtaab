import type { ContactPurpose } from "@/types/contact";

/** Fallback when CMS site settings are unavailable */
export const DEFAULT_SITE_NAME = "Aabtaab";

/** Display size for header/footer logo (`size-logo` = 2.625rem). Fetch at 2× for Retina. */
export const LOGO_DISPLAY_PX = 42;
export const LOGO_IMAGE_PX = LOGO_DISPLAY_PX * 2;

export function resolveSiteName(
  settings?: { siteName?: string | null } | null,
): string {
  return settings?.siteName || DEFAULT_SITE_NAME;
}

export const CONTACT_PURPOSE_LABELS: Record<ContactPurpose, string> = {
  general: "General Inquiry",
  course: "Course Enrollment",
  service: "Service Request",
  other: "Other",
};

import type { ContactPurpose } from "@/types/contact";

/** Fallback when CMS site settings are unavailable */
export const DEFAULT_SITE_NAME = "Aabtaab";

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

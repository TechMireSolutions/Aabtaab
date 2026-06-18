import type { ContactPurpose } from "@/types/contact";

export const CONTACT_PURPOSE_LABELS: Record<ContactPurpose, string> = {
  general: "General Inquiry",
  course: "Course Enrollment",
  service: "Service Request",
  other: "Other",
};

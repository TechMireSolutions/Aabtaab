/** Subject tag values from Sanity `course.subject` list → display labels */

export const COURSE_SUBJECT_LABELS: Record<string, string> = {
  quran: "Quran",
  "nejul-balagha": "Nahjul Balagha",
  "nahjul-balagha": "Nahjul Balagha",
  jurisprudence: "Jurisprudence (Fiqh)",
  ethics: "Ethics (Akhlaq)",
  history: "History",
};

/** Known CMS title misspellings → preferred public spelling */
const TITLE_CORRECTIONS: Record<string, string> = {
  "nejul balagha": "Nahjul Balagha",
  "nehjul balagha": "Nahjul Balagha",
};

export function formatSubjectLabel(subject: string | null | undefined): string {
  if (!subject) return "";
  const key = subject.trim().toLowerCase();
  if (COURSE_SUBJECT_LABELS[key]) return COURSE_SUBJECT_LABELS[key];
  // Title-case unknown slugs: "some-tag" → "Some Tag"
  if (key.includes("-") || key === subject.toLowerCase()) {
    return key
      .split(/[-_\s]+/)
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }
  return subject;
}

export function normalizePublicTitle(title: string | null | undefined): string {
  if (!title) return "";
  const corrected = TITLE_CORRECTIONS[title.trim().toLowerCase()];
  return corrected ?? title;
}

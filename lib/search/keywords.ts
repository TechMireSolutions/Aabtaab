export interface KeywordEntry {
  label: string;
  href: string;
  category: "service" | "course" | "event" | "article";
}

export interface KeywordGroup {
  keywords: string[];
  entry: KeywordEntry;
}

export const KEYWORD_GROUPS: KeywordGroup[] = [
  {
    keywords: ["kafara", "kaffara", "kaffarah", "kafara expiation"],
    entry: {
      label: "Kafara (Expiation)",
      href: "/services/kafara",
      category: "service",
    },
  },
  {
    keywords: ["nazr", "nazr oath", "nazr-niyaz", "vow fulfillment"],
    entry: {
      label: "Nazr (Vow Fulfillment)",
      href: "/services/nazr",
      category: "service",
    },
  },
  {
    keywords: ["nikah", "nikah khITbah", "marriage", "nikah ceremony", " nikah online"],
    entry: {
      label: "Nikah (Marriage)",
      href: "/services/nikah",
      category: "service",
    },
  },
  {
    keywords: ["sadaqah", "sadqa", "charity", "donation", "give charity"],
    entry: {
      label: "Sadaqah (Charity)",
      href: "/services/sadaqah",
      category: "service",
    },
  },
  {
    keywords: ["khums", "khums calculation", "khums payment"],
    entry: {
      label: "Khums",
      href: "/services/khums",
      category: "service",
    },
  },
  {
    keywords: ["halala", "halalah", "tahliyah"],
    entry: {
      label: "Halala",
      href: "/services/halala",
      category: "service",
    },
  },
  {
    keywords: ["istikhara", "istikharah", "prayer for guidance"],
    entry: {
      label: "Istikhara",
      href: "/services/istikhara",
      category: "service",
    },
  },
  {
    keywords: ["ziyarat", "ziarat", "visitor visa", "ziyarat assistance"],
    entry: {
      label: "Ziyarat Assistance",
      href: "/services/ziyarat",
      category: "service",
    },
  },
  {
    keywords: ["mehr", "mahr", "dower", "dowry"],
    entry: {
      label: "Mehr (Dower)",
      href: "/services/mehr",
      category: "service",
    },
  },
  {
    keywords: ["talaq", "divorce", "talaq procedures"],
    entry: {
      label: "Talaq (Divorce)",
      href: "/services/talaq",
      category: "service",
    },
  },
  {
    keywords: ["wasiyat", "wasiyyat", "will testament", "Islamic will"],
    entry: {
      label: "Wasiyat (Will)",
      href: "/services/wasiyat",
      category: "service",
    },
  },
  {
    keywords: ["marja reference", "marja e taqlid", "follow a marja"],
    entry: {
      label: "Marja Reference",
      href: "/services/marja-reference",
      category: "service",
    },
  },
  {
    keywords: [
      "tajweed", "tajveed", "quran recitation", "tajweed course",
      "quran reading", "tilawah", "tilawat",
    ],
    entry: {
      label: "Tajweed (Quran Recitation)",
      href: "/online-courses/tajweed",
      category: "course",
    },
  },
  {
    keywords: [
      "noorani qaida", "nooraniyya", "qaida", "learn to read quran",
      "beginner quran", "quran basics",
    ],
    entry: {
      label: "Noorani Qaida",
      href: "/online-courses/noorani-qaida",
      category: "course",
    },
  },
  {
    keywords: [
      "fiqh", "f iqh", "jurisprudence", "islamic law", "fatawa",
      "hukum", "ahkam", "amaliyat",
    ],
    entry: {
      label: "Fiqh (Jurisprudence)",
      href: "/online-courses/fiqh",
      category: "course",
    },
  },
  {
    keywords: [
      "akhlaq", "akhlaqi", "ethics", "islamic morality", "adab",
      "tarbiyyah", "character building",
    ],
    entry: {
      label: "Akhlaq (Ethics)",
      href: "/online-courses/akhlaq",
      category: "course",
    },
  },
  {
    keywords: [
      "nehjul balagha", "nejul balagha", "nahjul balagha", "nahj al-balagha",
      "peak of eloquence", "imam ali sermons",
    ],
    entry: {
      label: "Nahjul Balagha",
      href: "/online-courses/nejul-balagha",
      category: "course",
    },
  },
  {
    keywords: [
      "quran tafseer", "tafseer", "tafsir", "quran interpretation",
      "understand quran", "quran exegesis",
    ],
    entry: {
      label: "Quran Tafseer",
      href: "/online-courses/tafseer",
      category: "course",
    },
  },
  {
    keywords: [
      "quran memorization", "hifz", "hifz-ul-quran", "memorize quran",
      "hifazan", "quran yaad karna",
    ],
    entry: {
      label: "Quran Memorization (Hifz)",
      href: "/online-courses/hifz",
      category: "course",
    },
  },
  {
    keywords: [
      "islamic history", "history of islam", "tareekh", "tarikh",
      "seerah", "life of prophet", "shia history",
    ],
    entry: {
      label: "Islamic History",
      href: "/online-courses/history",
      category: "course",
    },
  },
  {
    keywords: [
      "dua", "duain", "supplication", "prayer", "namaz dua",
      "daily duas", "masnoon dua",
    ],
    entry: {
      label: "Duas & Supplications",
      href: "/online-courses/dua",
      category: "course",
    },
  },
  {
    keywords: [
      "events", "upcoming events", "islamic events",
      "gatherings", "majlis", "program", "events near me",
    ],
    entry: {
      label: "Upcoming Events",
      href: "/events",
      category: "event",
    },
  },
  {
    keywords: [
      "courses", "online courses", "islamic courses",
      "classes", "learn online", "study islam", "education",
    ],
    entry: {
      label: "Online Courses",
      href: "/online-courses",
      category: "course",
    },
  },
  {
    keywords: [
      "services", "islamic services", "our services",
      "religious services",
    ],
    entry: {
      label: "Our Services",
      href: "/services",
      category: "service",
    },
  },
  {
    keywords: [
      "articles", "blog", "posts", "read articles",
      "islamic articles", "blog posts",
    ],
    entry: {
      label: "Articles & Blog",
      href: "/posts",
      category: "article",
    },
  },
];

const KEYWORD_MAP = new Map<string, KeywordEntry>();

for (const group of KEYWORD_GROUPS) {
  for (const keyword of group.keywords) {
    KEYWORD_MAP.set(keyword.toLowerCase(), group.entry);
  }
}

export function matchKeyword(input: string): KeywordEntry | null {
  const lower = input.trim().toLowerCase();
  if (!lower) return null;

  const direct = KEYWORD_MAP.get(lower);
  if (direct) return direct;

  for (const [kw, entry] of KEYWORD_MAP) {
    if (kw.includes(lower) || lower.includes(kw)) return entry;
  }

  return null;
}

export function getSuggestions(input: string): KeywordEntry[] {
  const lower = input.trim().toLowerCase();
  if (!lower) return [];

  const seen = new Set<string>();
  const suggestions: KeywordEntry[] = [];

  for (const group of KEYWORD_GROUPS) {
    const matched = group.keywords.some(
      (kw) =>
        kw.includes(lower) ||
        lower.includes(kw) ||
        levenshteinDistance(kw, lower) <= 2,
    );
    if (matched && !seen.has(group.entry.href)) {
      seen.add(group.entry.href);
      suggestions.push(group.entry);
    }
  }

  if (suggestions.length === 0) {
    const categoryMap = new Map<string, KeywordEntry>();
    for (const group of KEYWORD_GROUPS) {
      if (!categoryMap.has(group.entry.category)) {
        categoryMap.set(group.entry.category, group.entry);
      }
    }
    for (const entry of categoryMap.values()) {
      if (!seen.has(entry.href)) {
        seen.add(entry.href);
        suggestions.push(entry);
      }
    }
  }

  return suggestions.slice(0, 6);
}

function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = b[i - 1] === a[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );
    }
  }

  return matrix[b.length][a.length];
}

import type { NavItem } from "@/types/site-navigation";

/** Default main nav when CMS header links are empty */
export const FALLBACK_NAV: NavItem[] = [
  { label: "Online Classes", href: "/online-courses" },
  { label: "Services", href: "/services" },
  { label: "Events", href: "/events" },
  { label: "Articles", href: "/posts" },
  { label: "Dar ul Quran", href: "/dar-ul-quran" },
  { label: "Donate", href: "/donate" },
  { label: "About", href: "/about" },
];

/** Search empty / quick-nav chips (SSOT for palette + search page) */
export const SEARCH_QUICK_LINKS = [
  { label: "Online Courses", href: "/online-courses" },
  { label: "Our Services", href: "/services" },
  { label: "Upcoming Events", href: "/events" },
  { label: "Articles", href: "/posts" },
] as const;

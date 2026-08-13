import type { NavItem } from "@/types/site-navigation";

/** Default main nav when CMS header links are empty */
export const FALLBACK_NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Online Classes", href: "/online-courses" },
  { label: "Services", href: "/services" },
  { label: "Events", href: "/events" },
  { label: "Articles", href: "/posts" },
  { label: "Dar ul Quran", href: "/dar-ul-quran" },
  { label: "Donate", href: "/donate" },
  { label: "About", href: "/about" },
];

const DAR_UL_QURAN_LABEL = /dar\s*ul\s*quran/i;

/** True when the item duplicates the header logo/home link. */
export function isHomeNavItem(item: NavItem): boolean {
  const path = item.href?.split("?")[0]?.replace(/\/$/, "") || "";
  return path === "" || /^home$/i.test(item.label.trim());
}

/** Drop Home from topbar/mobile nav — logo already links to `/`. */
export function withoutHomeNavItems(items: NavItem[]): NavItem[] {
  return items.filter((item) => !isHomeNavItem(item));
}

/**
 * Resolve header nav for layout/chrome: CMS or fallback, Dar Ul Quran override,
 * ensure Dar Ul Quran exists, drop redundant Home.
 */
export function buildHeaderNavLinks(
  navItems: NavItem[] | undefined,
  darulQuranUrl?: string,
): NavItem[] {
  const base = (navItems?.length ? [...navItems] : [...FALLBACK_NAV]).map(
    (item) => {
      if (darulQuranUrl && DAR_UL_QURAN_LABEL.test(item.label)) {
        return {
          ...item,
          href: darulQuranUrl,
          external: true,
        };
      }
      return item;
    },
  );
  const hasDarUlQuran = base.some((item) => DAR_UL_QURAN_LABEL.test(item.label));
  if (!hasDarUlQuran) {
    base.push({
      label: "Dar ul Quran",
      href: darulQuranUrl || "/dar-ul-quran",
      external: !!darulQuranUrl,
    });
  }
  return base;
}

/** Search empty / quick-nav chips (SSOT for palette + search page) */
export const SEARCH_QUICK_LINKS = [
  { label: "Online Courses", href: "/online-courses" },
  { label: "Our Services", href: "/services" },
  { label: "Upcoming Events", href: "/events" },
  { label: "Articles", href: "/posts" },
] as const;


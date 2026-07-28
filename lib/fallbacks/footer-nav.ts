import type { LucideIcon } from "lucide-react";
import {
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
} from "lucide-react";
import type { FooterNav, FooterService, NavItem } from "@/types/site-navigation";
import type { SiteSettings } from "@/types/site-settings";
import { mapsUrl, whatsappUrl } from "@/lib/urls";

/** Paths to hide from footer/header when the related catalog is empty */
const EMPTY_CATALOG_HREFS: Record<string, keyof CatalogCounts> = {
  "/scholars": "scholars",
  "/events": "events",
  "/posts": "posts",
  "/articles": "posts",
  "/online-courses": "courses",
  "/services": "services",
};

export interface CatalogCounts {
  /** null = unknown (CMS outage) — fail open and keep the link */
  scholars: number | null;
  events: number | null;
  posts: number | null;
  courses: number | null;
  services: number | null;
}

/** Default footer quick links when CMS footer navigation is empty */
export const FALLBACK_QUICK_LINKS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Courses", href: "/online-courses" },
  { label: "Services", href: "/services" },
  { label: "Donate", href: "/donate" },
  { label: "Contact", href: "/contact" },
];

/** Footer brand blurb when CMS tagline/description are missing or too short */
export const DEFAULT_FOOTER_TAGLINE =
  "Spreading the light of Ahlul Bayt (A.S.) through education, authentic content, and spiritual services. Join us in our mission to serve the Ummah.";

const MIN_FOOTER_TAGLINE_LENGTH = 24;

export const FOOTER_SERVICES_LIMIT = 5;

export const FOOTER_ALL_SERVICES_LINK = {
  label: "All services",
  href: "/services",
} as const;

export const FOOTER_CTA = {
  title: "Get in touch",
  body: "Questions about courses, events, or services? Send us a message — we're happy to help.",
  actionLabel: "Contact us",
  actionHref: "/contact",
} as const;

export const FOOTER_LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-of-service" },
] as const;

export const FOOTER_CONTACT_FALLBACK = {
  label: "Contact us for details",
  href: "/contact",
} as const;

export type FooterContactKind =
  | "address"
  | "phone"
  | "whatsapp"
  | "email"
  | "hours"
  | "fallback";

export interface FooterContactItem {
  kind: FooterContactKind;
  Icon: LucideIcon;
  value: string;
  href?: string;
  external?: boolean;
  title?: string;
  valueClassName?: string;
}

export interface FooterSocialLink {
  key: "facebook" | "youtube" | "darulQuran";
  href: string;
  label: string;
  variant: "icon" | "pill";
}

function normalizeNavPath(href: string | undefined): string {
  return href?.split("?")[0]?.replace(/\/$/, "") || "";
}

export function filterNavForEmptyCatalogs(
  items: NavItem[] | undefined,
  counts: CatalogCounts,
): NavItem[] {
  if (!items?.length) return [];
  return items.filter((item) => {
    const path = normalizeNavPath(item.href);
    const countKey = EMPTY_CATALOG_HREFS[path];
    if (!countKey) return true;
    const count = counts[countKey];
    if (count === null || count === undefined) return true;
    return count > 0;
  });
}

/** Prefer CMS tagline when substantive; otherwise description, then default. */
export function resolveFooterTagline(settings?: {
  tagline?: string | null;
  description?: string | null;
} | null): string {
  const tagline = settings?.tagline?.trim();
  if (tagline && tagline.length >= MIN_FOOTER_TAGLINE_LENGTH) return tagline;
  const description = settings?.description?.trim();
  if (description && description.length >= MIN_FOOTER_TAGLINE_LENGTH) {
    return description;
  }
  return DEFAULT_FOOTER_TAGLINE;
}

/** CMS items when present; otherwise FALLBACK_QUICK_LINKS (presentation defense). */
export function resolveFooterQuickLinks(
  items?: NavItem[] | null,
): NavItem[] {
  return items?.length ? items : FALLBACK_QUICK_LINKS;
}

/** Layout-data path: CMS footer nav or fallback, then empty-catalog filter. */
export function resolveFooterNavForLayout(
  footerNav: FooterNav | null | undefined,
  counts: CatalogCounts,
): NavItem[] {
  return filterNavForEmptyCatalogs(
    resolveFooterQuickLinks(footerNav?.items),
    counts,
  );
}

export function mapFooterServices(
  services: FooterService[] | undefined,
  limit = FOOTER_SERVICES_LIMIT,
): NavItem[] {
  return (services ?? []).slice(0, limit).map((s) => ({
    label: s.title,
    href: `/services/${s.slug}`,
  }));
}

/** Truncated service links plus catalog escape hatch (when any services exist). */
export function buildFooterServiceNavLinks(
  services: FooterService[] | undefined,
  limit = FOOTER_SERVICES_LIMIT,
): NavItem[] {
  const items = mapFooterServices(services, limit);
  if (!items.length) return [];
  return [
    ...items,
    {
      label: FOOTER_ALL_SERVICES_LINK.label,
      href: FOOTER_ALL_SERVICES_LINK.href,
    },
  ];
}

/** Copyright line for the footer legal bar. */
export function formatFooterCopyright(
  siteName: string,
  year = new Date().getFullYear(),
): string {
  return `© ${year} ${siteName}. All rights reserved.`;
}

export function buildFooterContactItems(
  settings?: SiteSettings | null,
): FooterContactItem[] {
  const items: FooterContactItem[] = [];

  if (settings?.address) {
    items.push({
      kind: "address",
      Icon: MapPin,
      value: settings.address,
      href: mapsUrl(settings.address, settings.addressLink),
      external: true,
      title: "View on Google Maps",
      valueClassName: "leading-relaxed whitespace-pre-line",
    });
  }
  if (settings?.phone) {
    items.push({
      kind: "phone",
      Icon: Phone,
      value: settings.phone,
      href: `tel:${settings.phone}`,
    });
  }
  if (settings?.whatsapp) {
    items.push({
      kind: "whatsapp",
      Icon: MessageSquare,
      value: `WhatsApp: ${settings.whatsapp}`,
      href: whatsappUrl(settings.whatsapp),
      external: true,
    });
  }
  if (settings?.email) {
    items.push({
      kind: "email",
      Icon: Mail,
      value: settings.email,
      href: `mailto:${settings.email}`,
      valueClassName: "break-all sm:truncate",
    });
  }
  if (settings?.workingHours) {
    items.push({
      kind: "hours",
      Icon: Clock,
      value: settings.workingHours,
    });
  }

  if (items.length === 0) {
    items.push({
      kind: "fallback",
      Icon: Mail,
      value: FOOTER_CONTACT_FALLBACK.label,
      href: FOOTER_CONTACT_FALLBACK.href,
    });
  }

  return items;
}

const CONTACT_PAGE_ORDER = ["email", "phone", "whatsapp", "address"] as const;
type ContactPageKind = (typeof CONTACT_PAGE_ORDER)[number];

const CONTACT_PAGE_LABELS: Record<ContactPageKind, string> = {
  email: "Email",
  phone: "Phone",
  whatsapp: "WhatsApp",
  address: "Address",
};

/** Contact page channel cards — same hrefs as footer, contact-friendly labels/order. */
export function buildContactPageItems(settings?: SiteSettings | null) {
  return buildFooterContactItems(settings)
    .filter((item): item is FooterContactItem & { kind: ContactPageKind } =>
      (CONTACT_PAGE_ORDER as readonly string[]).includes(item.kind),
    )
    .sort(
      (a, b) =>
        CONTACT_PAGE_ORDER.indexOf(a.kind) - CONTACT_PAGE_ORDER.indexOf(b.kind),
    )
    .map((item) => ({
      Icon: item.Icon,
      label: CONTACT_PAGE_LABELS[item.kind],
      value:
        item.kind === "whatsapp" && settings?.whatsapp
          ? settings.whatsapp
          : item.value,
      href: item.href ?? null,
      external: Boolean(item.external),
    }));
}

export function buildFooterSocialLinks(
  settings?: SiteSettings | null,
): FooterSocialLink[] {
  const links: FooterSocialLink[] = [];
  if (settings?.facebook) {
    links.push({
      key: "facebook",
      href: settings.facebook,
      label: "Facebook",
      variant: "icon",
    });
  }
  if (settings?.youtube) {
    links.push({
      key: "youtube",
      href: settings.youtube,
      label: "YouTube",
      variant: "icon",
    });
  }
  if (settings?.darulQuranUrl) {
    links.push({
      key: "darulQuran",
      href: settings.darulQuranUrl,
      label: "Dar ul Quran",
      variant: "pill",
    });
  }
  return links;
}

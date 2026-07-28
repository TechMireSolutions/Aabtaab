import { describe, expect, it } from "vitest";
import {
  FALLBACK_QUICK_LINKS,
  FOOTER_ALL_SERVICES_LINK,
  FOOTER_LEGAL_LINKS,
  buildContactPageItems,
  buildFooterContactItems,
  buildFooterServiceNavLinks,
  buildFooterSocialLinks,
  filterNavForEmptyCatalogs,
  formatFooterCopyright,
  mapFooterServices,
  resolveFooterNavForLayout,
  resolveFooterQuickLinks,
  resolveFooterTagline,
} from "@/lib/fallbacks/footer-nav";

describe("filterNavForEmptyCatalogs", () => {
  const items = [
    { label: "Home", href: "/" },
    { label: "Scholars", href: "/scholars" },
    { label: "Events", href: "/events" },
    { label: "Articles", href: "/posts" },
    { label: "Articles alias", href: "/articles" },
    { label: "Courses", href: "/online-courses" },
    { label: "Services", href: "/services" },
    { label: "Reviews", href: "/reviews" },
  ];

  it("hides empty catalog links and keeps others", () => {
    expect(
      filterNavForEmptyCatalogs(items, {
        scholars: 0,
        events: 0,
        posts: 2,
        courses: 3,
        services: 1,
      }).map((i) => i.href),
    ).toEqual([
      "/",
      "/posts",
      "/articles",
      "/online-courses",
      "/services",
      "/reviews",
    ]);
  });

  it("hides /articles when posts count is zero", () => {
    expect(
      filterNavForEmptyCatalogs(items, {
        scholars: 0,
        events: 0,
        posts: 0,
        courses: 0,
        services: 0,
      }).map((i) => i.href),
    ).toEqual(["/", "/reviews"]);
  });

  it("keeps catalog links when counts are positive", () => {
    expect(
      filterNavForEmptyCatalogs(items, {
        scholars: 3,
        events: 1,
        posts: 1,
        courses: 2,
        services: 4,
      }).map((i) => i.href),
    ).toEqual([
      "/",
      "/scholars",
      "/events",
      "/posts",
      "/articles",
      "/online-courses",
      "/services",
      "/reviews",
    ]);
  });

  it("fails open when counts are unknown", () => {
    expect(
      filterNavForEmptyCatalogs(items, {
        scholars: null,
        events: null,
        posts: null,
        courses: null,
        services: null,
      }).map((i) => i.href),
    ).toEqual([
      "/",
      "/scholars",
      "/events",
      "/posts",
      "/articles",
      "/online-courses",
      "/services",
      "/reviews",
    ]);
  });
});

describe("FALLBACK_QUICK_LINKS + resolvers", () => {
  it("lists core public destinations", () => {
    expect(FALLBACK_QUICK_LINKS.map((i) => i.href)).toEqual([
      "/",
      "/about",
      "/online-courses",
      "/services",
      "/donate",
      "/contact",
    ]);
  });

  it("resolveFooterQuickLinks prefers CMS items", () => {
    expect(
      resolveFooterQuickLinks([{ label: "Home", href: "/" }]).map((i) => i.href),
    ).toEqual(["/"]);
  });

  it("resolveFooterQuickLinks falls back when empty", () => {
    expect(resolveFooterQuickLinks([])).toEqual(FALLBACK_QUICK_LINKS);
    expect(resolveFooterQuickLinks(undefined)).toEqual(FALLBACK_QUICK_LINKS);
  });

  it("resolveFooterNavForLayout filters empty catalogs on fallback", () => {
    expect(
      resolveFooterNavForLayout(null, {
        scholars: 0,
        events: 0,
        posts: 0,
        courses: 0,
        services: 0,
      }).map((i) => i.href),
    ).toEqual(["/", "/about", "/donate", "/contact"]);
  });
});

describe("resolveFooterTagline", () => {
  it("uses substantive tagline when long enough", () => {
    expect(
      resolveFooterTagline({
        tagline: "Accessible Shia education for families worldwide",
      }),
    ).toBe("Accessible Shia education for families worldwide");
  });

  it("falls back from short tagline to description", () => {
    expect(
      resolveFooterTagline({
        tagline: "Shia Online Teachings",
        description:
          "Online courses and religious services rooted in Ahlul Bayt teachings.",
      }),
    ).toBe(
      "Online courses and religious services rooted in Ahlul Bayt teachings.",
    );
  });

  it("uses default when CMS copy is missing or short", () => {
    const result = resolveFooterTagline({ tagline: "Short" });
    expect(result.length).toBeGreaterThan(24);
    expect(result).toMatch(/Ahlul Bayt/i);
  });
});

describe("mapFooterServices", () => {
  it("maps and caps services", () => {
    const services = Array.from({ length: 6 }, (_, i) => ({
      _id: `s${i}`,
      title: `Service ${i}`,
      slug: `service-${i}`,
    }));
    expect(mapFooterServices(services)).toEqual([
      { label: "Service 0", href: "/services/service-0" },
      { label: "Service 1", href: "/services/service-1" },
      { label: "Service 2", href: "/services/service-2" },
      { label: "Service 3", href: "/services/service-3" },
      { label: "Service 4", href: "/services/service-4" },
    ]);
  });

  it("buildFooterServiceNavLinks appends catalog escape hatch", () => {
    expect(
      buildFooterServiceNavLinks([
        { _id: "1", title: "Zakat", slug: "zakat" },
      ]),
    ).toEqual([
      { label: "Zakat", href: "/services/zakat" },
      {
        label: FOOTER_ALL_SERVICES_LINK.label,
        href: FOOTER_ALL_SERVICES_LINK.href,
      },
    ]);
    expect(buildFooterServiceNavLinks([])).toEqual([]);
  });
});

describe("formatFooterCopyright", () => {
  it("formats year and site name", () => {
    expect(formatFooterCopyright("Aabtaab", 2026)).toBe(
      "© 2026 Aabtaab. All rights reserved.",
    );
  });
});

describe("buildFooterContactItems", () => {
  it("builds linked contact rows from settings", () => {
    const items = buildFooterContactItems({
      email: "edu@example.com",
      phone: "+92 300",
      address: "Karachi",
      addressLink: "https://maps.example/x",
    });
    expect(items.map((i) => i.kind)).toEqual(["address", "phone", "email"]);
    expect(items[0]?.href).toBe("https://maps.example/x");
    expect(items[0]?.external).toBe(true);
    expect(items[0]?.title).toBe("View on Google Maps");
  });

  it("returns visitor-safe fallback when empty", () => {
    const items = buildFooterContactItems({});
    expect(items).toEqual([
      expect.objectContaining({
        kind: "fallback",
        value: "Contact us for details",
        href: "/contact",
      }),
    ]);
  });
});

describe("buildContactPageItems", () => {
  it("orders channels for the contact page and strips WhatsApp label prefix", () => {
    const items = buildContactPageItems({
      email: "edu@example.com",
      phone: "+92 300",
      whatsapp: "+92 300 111",
      address: "Karachi",
    });
    expect(items.map((i) => i.label)).toEqual([
      "Email",
      "Phone",
      "WhatsApp",
      "Address",
    ]);
    expect(items.find((i) => i.label === "WhatsApp")?.value).toBe("+92 300 111");
  });

  it("returns empty when only footer fallback would apply", () => {
    expect(buildContactPageItems({})).toEqual([]);
  });
});

describe("buildFooterSocialLinks", () => {
  it("includes configured social destinations", () => {
    expect(
      buildFooterSocialLinks({
        facebook: "https://facebook.com/x",
        youtube: "https://youtube.com/x",
        darulQuranUrl: "https://darulquran.pk",
      }).map((l) => l.key),
    ).toEqual(["facebook", "youtube", "darulQuran"]);
  });
});

describe("FOOTER_LEGAL_LINKS", () => {
  it("points at privacy and terms routes", () => {
    expect(FOOTER_LEGAL_LINKS.map((l) => l.href)).toEqual([
      "/privacy-policy",
      "/terms-of-service",
    ]);
  });
});

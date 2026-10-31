import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockSanityFetch } = vi.hoisted(() => ({
  mockSanityFetch: vi.fn(),
}));

vi.mock("@/sanity/lib/fetch", () => ({
  sanityFetch: mockSanityFetch,
  fetchSiteSettings: vi.fn(async () => ({ siteName: "Aabtaab" })),
  CACHE_TAGS: {
    all: "sanity-all",
    posts: "sanity-posts",
    post: (slug: string) => `sanity-post-${slug}`,
    events: "sanity-events",
    event: (slug: string) => `sanity-event-${slug}`,
    courses: "sanity-courses",
    course: (slug: string) => `sanity-course-${slug}`,
    services: "sanity-services",
    service: (slug: string) => `sanity-service-${slug}`,
    siteSettings: "sanity-site-settings",
    homepage: "sanity-homepage",
    pages: "sanity-pages",
    page: (slug: string) => `sanity-page-${slug}`,
    testimonials: "sanity-testimonials",
    scholars: "sanity-scholars",
    countries: "sanity-countries",
    publications: "sanity-publications",
    publication: (slug: string) => `sanity-publication-${slug}`,
  },
}));

import {
  getContactFormOptions,
  getHomepageCarouselsData,
  getHomepageHeroData,
  getSiteLayoutData,
  getSitemapSlugs,
} from "./queries";

describe("CMS query facades", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getContactFormOptions", () => {
    it("fetches courses and services for the contact form in parallel", async () => {
      mockSanityFetch
        .mockResolvedValueOnce([{ title: "Quran 101", slug: "quran-101" }])
        .mockResolvedValueOnce([{ title: "Kafara", slug: "kafara" }]);

      const result = await getContactFormOptions();
      expect(result.courses).toEqual([{ title: "Quran 101", slug: "quran-101" }]);
      expect(result.services).toEqual([{ title: "Kafara", slug: "kafara" }]);
      expect(mockSanityFetch).toHaveBeenCalledTimes(2);
    });

    it("handles null results from Sanity by returning empty arrays", async () => {
      mockSanityFetch.mockResolvedValueOnce(null).mockResolvedValueOnce(null);

      const result = await getContactFormOptions();
      expect(result.courses).toEqual([]);
      expect(result.services).toEqual([]);
    });
  });

  describe("getHomepageHeroData", () => {
    it("returns formatted homepage hero data with defaults", async () => {
      mockSanityFetch.mockResolvedValueOnce({
        homepage: { heroTitle: "Welcome" },
        quotes: [{ arabic: "...", translation: "..." }],
        courseCount: 5,
        scholarCount: 3,
        countryCount: 12,
      });

      const hero = await getHomepageHeroData();
      expect(hero.homepage?.heroTitle).toBe("Welcome");
      expect(hero.quotes).toHaveLength(1);
      expect(hero.courseCount).toBe(5);
      expect(hero.scholarCount).toBe(3);
      expect(hero.countryCount).toBe(12);
    });

    it("handles null homepage hero payload safely", async () => {
      mockSanityFetch.mockResolvedValueOnce(null);

      const hero = await getHomepageHeroData();
      expect(hero.homepage).toBeNull();
      expect(hero.quotes).toEqual([]);
      expect(hero.courseCount).toBe(0);
      expect(hero.scholarCount).toBe(0);
      expect(hero.countryCount).toBe(0);
    });
  });

  describe("getHomepageCarouselsData", () => {
    it("returns structured carousel data", async () => {
      mockSanityFetch.mockResolvedValueOnce({
        featuredPosts: [{ title: "First Post" }],
        courses: [{ title: "First Course" }],
        services: [{ title: "First Service" }],
        testimonials: [{ name: "Student A" }],
        upcomingEvents: [{ title: "Upcoming Event" }],
      });

      const carousels = await getHomepageCarouselsData();
      expect(carousels.posts).toHaveLength(1);
      expect(carousels.courses).toHaveLength(1);
      expect(carousels.services).toHaveLength(1);
      expect(carousels.testimonials).toHaveLength(1);
      expect(carousels.upcomingEvents).toHaveLength(1);
    });

    it("handles null carousel payload by defaulting all collections to empty arrays", async () => {
      mockSanityFetch.mockResolvedValueOnce(null);

      const carousels = await getHomepageCarouselsData();
      expect(carousels.posts).toEqual([]);
      expect(carousels.courses).toEqual([]);
      expect(carousels.services).toEqual([]);
      expect(carousels.homepage).toBeNull();
      expect(carousels.testimonials).toEqual([]);
      expect(carousels.upcomingEvents).toEqual([]);
    });
  });

  describe("getSiteLayoutData", () => {
    it("assembles settings, filtered headerNav, footerNav, and footerServices", async () => {
      mockSanityFetch
        // headerNav
        .mockResolvedValueOnce({
          items: [
            { label: "Home", href: "/" },
            { label: "Courses", href: "/online-courses" },
          ],
        })
        // footerNav
        .mockResolvedValueOnce({
          quickLinks: [{ label: "About", href: "/about" }],
        })
        // footerServices
        .mockResolvedValueOnce([{ title: "Nikah", slug: "nikah" }])
        // catalogCounts
        .mockResolvedValueOnce({
          courses: 5,
          services: 3,
          events: 1,
          posts: 10,
          scholars: 2,
        });

      const layout = await getSiteLayoutData();
      expect(layout.headerNav.items).toHaveLength(2);
      expect(layout.footerServices).toHaveLength(1);
      expect(layout.footerNav).toBeDefined();
    });
  });

  describe("getSitemapSlugs", () => {
    it("retrieves slugs for posts, courses, services, events, and publications", async () => {
      mockSanityFetch
        .mockResolvedValueOnce([{ slug: "post-1" }]) // posts
        .mockResolvedValueOnce([{ slug: "course-1" }]) // courses
        .mockResolvedValueOnce([{ slug: "service-1" }]) // services
        .mockResolvedValueOnce([{ slug: "event-1" }]) // events
        .mockResolvedValueOnce([{ slug: "pub-1" }]); // publications

      const sitemapData = await getSitemapSlugs();
      expect(sitemapData.posts).toHaveLength(1);
      expect(sitemapData.courses).toHaveLength(1);
      expect(sitemapData.services).toHaveLength(1);
      expect(sitemapData.events).toHaveLength(1);
      expect(sitemapData.publications).toHaveLength(1);
    });
  });
});


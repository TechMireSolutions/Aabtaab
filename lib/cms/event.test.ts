import { describe, expect, it, vi, beforeEach } from "vitest";

const { mockGetEventBySlug, mockNotFound } = vi.hoisted(() => ({
  mockGetEventBySlug: vi.fn(),
  mockNotFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("next/navigation", () => ({
  notFound: mockNotFound,
}));

vi.mock("./queries", () => ({
  getEventBySlug: mockGetEventBySlug,
}));

vi.mock("@/sanity/lib/image", () => ({
  cardImageUrl: (img: { asset?: { _ref: string } }) =>
    `https://cdn.sanity.io/images/test/${img?.asset?._ref}`,
  ogImageUrl: (img: { asset?: { _ref: string } }) =>
    `https://cdn.sanity.io/images/test/og-${img?.asset?._ref}`,
}));

import {
  buildEventPageMetadata,
  formatEventDateRange,
  formatEventLocation,
  resolveEventImageUrls,
} from "@/lib/cms/event";

describe("formatEventDateRange", () => {
  it("formats single date without end date", () => {
    const formatted = formatEventDateRange("2026-05-15T10:00:00Z");
    expect(formatted).toContain("May 15, 2026");
  });

  it("formats same-day event with start and end times", () => {
    const formatted = formatEventDateRange(
      "2026-05-15T10:00:00.000Z",
      "2026-05-15T12:00:00.000Z",
    );
    expect(formatted).toContain("May 15, 2026");
    expect(formatted).toContain("·");
    expect(formatted).toContain("–");
  });

  it("formats multi-day event date range", () => {
    const formatted = formatEventDateRange(
      "2026-05-15T10:00:00.000Z",
      "2026-05-18T10:00:00.000Z",
    );
    expect(formatted).toContain("May 15, 2026 – May 18, 2026");
  });
});

describe("formatEventLocation", () => {
  it("formats full venue, city, and state", () => {
    const location = formatEventLocation({
      venueName: "Islamic Center",
      city: "Dearborn",
      state: "MI",
    });
    expect(location).toBe("Islamic Center, Dearborn, MI");
  });

  it("omits empty or missing components", () => {
    expect(formatEventLocation({ venueName: "Grand Hall", city: "", state: undefined })).toBe("Grand Hall");
    expect(formatEventLocation({ venueName: "", city: "Dallas", state: "TX" })).toBe("Dallas, TX");
  });

  it("returns null when all location parts are empty", () => {
    expect(formatEventLocation({ venueName: "", city: undefined, state: undefined })).toBeNull();
  });
});

describe("resolveEventImageUrls", () => {
  it("resolves mainImageUrl and ogImageUrl when image asset exists", () => {
    const event = {
      _id: "evt-1",
      title: "Majlis",
      image: { asset: { _ref: "image-asset-123" } },
    } as unknown as Parameters<typeof resolveEventImageUrls>[0];

    const urls = resolveEventImageUrls(event);
    expect(urls.mainImageUrl).toContain("image-asset-123");
    expect(urls.ogImageUrl).toContain("image-asset-123");
  });

  it("handles missing event image gracefully", () => {
    const event = {
      _id: "evt-2",
      title: "Virtual Seminar",
    } as unknown as Parameters<typeof resolveEventImageUrls>[0];

    const urls = resolveEventImageUrls(event);
    expect(urls.mainImageUrl).toBeUndefined();
    expect(urls.ogImageUrl).toBeUndefined();
  });
});

describe("buildEventPageMetadata", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws notFound() when event is not found", async () => {
    mockGetEventBySlug.mockResolvedValueOnce(null);

    await expect(buildEventPageMetadata("nonexistent-slug")).rejects.toThrow("NEXT_NOT_FOUND");
    expect(mockNotFound).toHaveBeenCalled();
  });

  it("builds metadata with event details", async () => {
    mockGetEventBySlug.mockResolvedValueOnce({
      title: "Annual Convention",
      description: "Gathering of scholars and students",
      seo: {
        metaTitle: "Annual Convention 2026",
        metaDescription: "Detailed SEO description",
        keywords: ["convention", "majlis"],
      },
    });

    const meta = await buildEventPageMetadata("annual-convention");
    expect(meta.title).toBe("Annual Convention 2026");
    expect(meta.description).toBe("Detailed SEO description");
    expect(meta.alternates?.canonical).toContain("/events/annual-convention");
    expect(meta.keywords).toEqual(["convention", "majlis"]);
  });
});

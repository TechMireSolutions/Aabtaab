import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockGetCmsPage, mockNotFound } = vi.hoisted(() => ({
  mockGetCmsPage: vi.fn(),
  mockNotFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("next/navigation", () => ({
  notFound: mockNotFound,
}));

vi.mock("./queries", () => ({
  getCmsPage: mockGetCmsPage,
}));

vi.mock("@/lib/seo/resolve-og-image", () => ({
  resolveDocOgImage: (doc: { title?: string }) =>
    doc ? `https://test.cdn/og-${doc.title}` : undefined,
}));

import {
  buildCmsPageMetadata,
  buildNestedSlugMetadata,
  defineCmsPageMetadata,
} from "@/lib/cms/page";

describe("buildCmsPageMetadata", () => {
  it("prioritizes options.title over CMS title and fallback", () => {
    const meta = buildCmsPageMetadata(
      {
        title: "CMS Title",
        seo: { metaTitle: "SEO Title" },
      },
      {
        path: "/test",
        title: "Explicit Option Title",
        fallbackTitle: "Fallback Title",
        fallbackDescription: "Fallback Description",
      },
    );

    expect(meta.title).toBe("Explicit Option Title");
  });

  it("uses seo.metaTitle if explicit title is not provided", () => {
    const meta = buildCmsPageMetadata(
      {
        title: "CMS Title",
        seo: { metaTitle: "SEO Title" },
      },
      {
        path: "/test",
        fallbackTitle: "Fallback Title",
        fallbackDescription: "Fallback Description",
      },
    );

    expect(meta.title).toBe("SEO Title");
  });

  it("uses page.title when seo.metaTitle is absent", () => {
    const meta = buildCmsPageMetadata(
      {
        title: "CMS Title",
      },
      {
        path: "/test",
        fallbackTitle: "Fallback Title",
        fallbackDescription: "Fallback Description",
      },
    );

    expect(meta.title).toBe("CMS Title");
  });

  it("uses fallbackTitle when page and seo are null", () => {
    const meta = buildCmsPageMetadata(null, {
      path: "/test",
      fallbackTitle: "Fallback Title",
      fallbackDescription: "Fallback Description",
    });

    expect(meta.title).toBe("Fallback Title");
    expect(meta.description).toBe("Fallback Description");
  });

  it("sanitizes public copy for description and honors noIndex", () => {
    const meta = buildCmsPageMetadata(
      {
        title: "Test",
        seo: { metaDescription: "Study Nejul Balagha and its wisdom", noIndex: true },
      },
      {
        path: "/test",
        fallbackTitle: "Fallback",
        fallbackDescription: "Fallback",
      },
    );

    expect(meta.description).toBe("Study Nahjul Balagha and its wisdom");
    expect(meta.robots).toMatchObject({ index: false, follow: true });
  });
});

describe("defineCmsPageMetadata", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a metadata generator function that fetches CMS page", async () => {
    mockGetCmsPage.mockResolvedValueOnce({
      title: "About Us",
      subtitle: "Learn about our mission",
    });

    const generateMeta = defineCmsPageMetadata("about", {
      path: "/about",
      fallbackTitle: "About Aabtaab",
      fallbackDescription: "About page description",
    });

    const meta = await generateMeta();
    expect(mockGetCmsPage).toHaveBeenCalledWith("about");
    expect(meta.title).toBe("About Us");
    expect(meta.description).toBe("Learn about our mission");
  });
});

describe("buildNestedSlugMetadata", () => {
  it("throws notFound() when document is null or undefined", () => {
    expect(() =>
      buildNestedSlugMetadata(null, "/online-courses", ["fiqh"], "Courses"),
    ).toThrow("NEXT_NOT_FOUND");
    expect(mockNotFound).toHaveBeenCalled();
  });

  it("builds canonical path for nested online course", () => {
    const doc = {
      title: "Beginner Fiqh",
      slug: { current: "beginner" },
      parent: { slug: "fiqh", title: "Fiqh" },
      seo: {
        metaTitle: "Beginner Fiqh Course",
        metaDescription: "Learn basic fiqh",
      },
    };

    const meta = buildNestedSlugMetadata(
      doc,
      "/online-courses",
      ["fiqh", "beginner"],
      "Default Course",
    );

    expect(meta.title).toBe("Beginner Fiqh Course");
    expect(meta.description).toBe("Learn basic fiqh");
    expect(meta.alternates?.canonical).toContain("/online-courses/fiqh/beginner");
  });

  it("builds fallback description for service when excerpt/seo missing", () => {
    const doc = {
      title: "Nikah Service",
      slug: { current: "nikah" },
    };

    const meta = buildNestedSlugMetadata(
      doc,
      "/services",
      ["nikah"],
      "Default Service",
    );

    expect(meta.title).toBe("Nikah Service");
    expect(meta.description).toBe("Nikah Service — religious service from Aabtaab.");
    expect(meta.alternates?.canonical).toContain("/services/nikah");
  });
});

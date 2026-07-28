import { describe, expect, it } from "vitest";
import {
  ancestryPathSegment,
  buildNestedBreadcrumbItems,
  buildNestedContentPath,
  getContentAncestry,
  previewPath,
} from "@/lib/paths";

describe("buildNestedContentPath", () => {
  it("builds top-level path", () => {
    expect(buildNestedContentPath("services", "zakat", null)).toBe(
      "/services/zakat",
    );
  });

  it("builds nested path from parent chain", () => {
    expect(
      buildNestedContentPath("online-courses", "quran-kids", {
        slug: "quran",
        parent: { slug: "islamic-studies", title: "Islamic Studies" },
      }),
    ).toBe("/online-courses/islamic-studies/quran/quran-kids");
  });

  it("ignores parents without slug", () => {
    expect(
      buildNestedContentPath("services", "leaf", {
        slug: "",
        parent: null,
      }),
    ).toBe("/services/leaf");
  });
});

describe("getContentAncestry", () => {
  it("returns empty chain without parent", () => {
    expect(getContentAncestry({})).toEqual([]);
  });

  it("walks nested parents root-first", () => {
    expect(
      getContentAncestry({
        parent: {
          title: "Quran",
          slug: "quran",
          parent: { title: "Studies", slug: "studies" },
        },
      }),
    ).toEqual([
      { title: "Studies", slug: "studies", parent: undefined },
      {
        title: "Quran",
        slug: "quran",
        parent: { title: "Studies", slug: "studies" },
      },
    ]);
  });
});

describe("ancestryPathSegment", () => {
  const ancestry = [
    { title: "A", slug: "a" },
    { title: "B", slug: "b" },
  ];

  it("joins slugs up to index", () => {
    expect(ancestryPathSegment(ancestry, 0)).toBe("a");
    expect(ancestryPathSegment(ancestry, 1)).toBe("a/b");
  });
});

describe("buildNestedBreadcrumbItems", () => {
  it("includes home, base, ancestors, and current page", () => {
    const items = buildNestedBreadcrumbItems(
      "services",
      "Services",
      [{ title: "Religious", slug: "religious" }],
      "Zakat",
      "/services/religious/zakat",
      "https://aabtaab.com",
    );

    expect(items).toEqual([
      { name: "Home", url: "https://aabtaab.com" },
      { name: "Services", url: "https://aabtaab.com/services" },
      {
        name: "Religious",
        url: "https://aabtaab.com/services/religious",
      },
      {
        name: "Zakat",
        url: "https://aabtaab.com/services/religious/zakat",
      },
    ]);
  });
});


describe("previewPath", () => {
  it("maps known types to internal paths", () => {
    expect(previewPath("post", "hello")).toBe("/posts/hello");
    expect(previewPath("course", "fiqh")).toBe("/online-courses/fiqh");
    expect(previewPath("homepageSettings", null)).toBe("/");
  });

  it("rejects open redirects", () => {
    expect(previewPath(null, "//evil.example")).toBe("/");
    expect(previewPath(null, "https://evil.example")).toBe("/");
    expect(previewPath(null, "/\\evil")).toBe("/");
  });

  it("allows known internal absolute paths", () => {
    expect(previewPath(null, "/about")).toBe("/about");
    expect(previewPath(null, "/posts/x")).toBe("/posts/x");
  });
});

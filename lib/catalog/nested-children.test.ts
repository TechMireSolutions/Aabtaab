import { describe, expect, it, vi } from "vitest";

vi.mock("@/sanity/lib/image", () => ({
  cardImageUrl: () => "https://cdn.example/card.jpg",
}));

import {
  mapCourseChildForGrid,
  mapServiceChildForGrid,
} from "@/lib/catalog/nested-children";
import {
  COURSE_NESTED_CTA_LABELS,
  SERVICE_NESTED_CTA_LABELS,
} from "@/lib/catalog/formatters";

describe("mapCourseChildForGrid", () => {
  it("prefers excerpt over price/duration", () => {
    const card = mapCourseChildForGrid(
      {
        _id: "c1",
        slug: "quran",
        title: "Quran",
        excerpt: "Learn Quran",
        price: "$40",
        duration: "8 weeks",
        childCount: 0,
        featuredImage: { asset: { _ref: "image-1" } },
      },
      COURSE_NESTED_CTA_LABELS,
    );

    expect(card).toEqual({
      _id: "c1",
      slug: "quran",
      title: "Quran",
      imageUrl: "https://cdn.example/card.jpg",
      description: "Learn Quran",
      ctaLabel: "Enroll Now",
    });
  });

  it("falls back to price · duration and parent CTA", () => {
    const card = mapCourseChildForGrid(
      {
        _id: "c2",
        slug: "fiqh",
        title: "Fiqh",
        price: "$50",
        duration: "10 weeks",
        childCount: 2,
      },
      COURSE_NESTED_CTA_LABELS,
    );

    expect(card.imageUrl).toBeNull();
    expect(card.description).toBe("$50 · 10 weeks");
    expect(card.ctaLabel).toBe("View Courses");
  });
});

describe("mapServiceChildForGrid", () => {
  it("maps icon and price fallback", () => {
    const card = mapServiceChildForGrid(
      {
        _id: "s1",
        slug: "zakat",
        title: "Zakat",
        price: "Variable",
        icon: { asset: { _ref: "image-2" } },
        childCount: 0,
      },
      SERVICE_NESTED_CTA_LABELS,
    );

    expect(card.imageUrl).toBe("https://cdn.example/card.jpg");
    expect(card.description).toBe("Variable");
    expect(card.ctaLabel).toBe("Book Now");
  });
});

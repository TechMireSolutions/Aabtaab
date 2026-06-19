import { describe, expect, it } from "vitest";
import { buildNestedContentPath } from "@/lib/paths";

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
});

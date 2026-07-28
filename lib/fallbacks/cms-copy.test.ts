import { describe, expect, it } from "vitest";
import { sanitizePublicCopy } from "@/lib/fallbacks/cms-copy";

describe("sanitizePublicCopy", () => {
  it("fixes known CMS typos", () => {
    expect(
      sanitizePublicCopy("We are avaiable 24/7 for support."),
    ).toBe("We are available 24/7 for support.");
    expect(
      sanitizePublicCopy(
        "education to everyone no matter where you are",
      ),
    ).toBe("education to everyone, no matter where you are");
    expect(sanitizePublicCopy("Nejul Balagha course")).toBe(
      "Nahjul Balagha course",
    );
  });

  it("passes through nullish and empty values", () => {
    expect(sanitizePublicCopy(undefined)).toBeUndefined();
    expect(sanitizePublicCopy(null)).toBeUndefined();
    expect(sanitizePublicCopy("")).toBe("");
  });
});

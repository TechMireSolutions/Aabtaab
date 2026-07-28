import { describe, expect, it } from "vitest";
import {
  formatPriceDuration,
  nestedListCtaLabel,
  whatsappUrl,
} from "@/lib/urls";

describe("whatsappUrl", () => {
  it("builds wa.me URL with digits only and encoded message", () => {
    expect(whatsappUrl("+1 (555) 010-0200", "Hello there")).toBe(
      "https://wa.me/15550100200?text=Hello%20there",
    );
  });

  it("uses default greeting when message omitted", () => {
    const url = whatsappUrl("15550100200");
    expect(url).toContain("https://wa.me/15550100200?text=");
    expect(url).toContain("Assalamu");
  });

  it("falls back to contact when number has no digits", () => {
    expect(whatsappUrl("n/a")).toBe("/contact");
  });
});

describe("formatPriceDuration", () => {
  it("joins price and duration", () => {
    expect(formatPriceDuration("$50", "8 weeks")).toBe("$50 · 8 weeks");
  });

  it("returns single part when one missing", () => {
    expect(formatPriceDuration("$50")).toBe("$50");
    expect(formatPriceDuration(undefined, "8 weeks")).toBe("8 weeks");
  });

  it("returns null when both empty", () => {
    expect(formatPriceDuration()).toBeNull();
    expect(formatPriceDuration("", "")).toBeNull();
  });
});

describe("nestedListCtaLabel", () => {
  const labels = { parent: "View Services", leaf: "Learn More" };

  it("uses parent label when children exist", () => {
    expect(nestedListCtaLabel(3, labels)).toBe("View Services");
  });

  it("uses leaf label when no children", () => {
    expect(nestedListCtaLabel(0, labels)).toBe("Learn More");
    expect(nestedListCtaLabel(undefined, labels)).toBe("Learn More");
  });
});

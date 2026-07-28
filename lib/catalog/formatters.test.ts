import { describe, expect, it } from "vitest";
import {
  formatPriceDuration,
  nestedListCtaLabel,
  SERVICE_NESTED_CTA_LABELS,
} from "@/lib/catalog/formatters";

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
  it("uses parent label when children exist", () => {
    expect(nestedListCtaLabel(3, SERVICE_NESTED_CTA_LABELS)).toBe(
      "View Services",
    );
  });

  it("uses leaf label when no children", () => {
    expect(nestedListCtaLabel(0, SERVICE_NESTED_CTA_LABELS)).toBe("Book Now");
    expect(nestedListCtaLabel(undefined, SERVICE_NESTED_CTA_LABELS)).toBe(
      "Book Now",
    );
  });
});

import { describe, expect, it } from "vitest";
import { mapsUrl, whatsappUrl, safeContactHref } from "@/lib/urls";

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

describe("mapsUrl", () => {
  it("prefers a custom address link", () => {
    expect(mapsUrl("Karachi", "https://maps.example/place")).toBe(
      "https://maps.example/place",
    );
  });

  it("builds a Google Maps search URL", () => {
    expect(mapsUrl("Block 20 Karachi")).toContain(
      "query=Block%2020%20Karachi",
    );
  });
});

describe("safeContactHref", () => {
  it("wraps bare emails as mailto", () => {
    expect(safeContactHref("scholar@example.com")).toBe(
      "mailto:scholar@example.com",
    );
  });

  it("allows http(s), mailto, and tel", () => {
    expect(safeContactHref("https://example.com")).toBe("https://example.com");
    expect(safeContactHref("mailto:a@b.com")).toBe("mailto:a@b.com");
    expect(safeContactHref("tel:+1234567890")).toBe("tel:+1234567890");
  });

  it("rejects dangerous schemes and protocol-relative URLs", () => {
    expect(safeContactHref("javascript:alert(1)")).toBeNull();
    expect(safeContactHref("//evil.example")).toBeNull();
  });

  it("returns null for empty values", () => {
    expect(safeContactHref("")).toBeNull();
    expect(safeContactHref(null)).toBeNull();
  });
});

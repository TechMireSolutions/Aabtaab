import { describe, expect, it } from "vitest";
import { safeContactHref } from "@/lib/urls/safe-href";

describe("safeContactHref", () => {
  it("builds mailto for emails", () => {
    expect(safeContactHref("scholar@example.com")).toBe(
      "mailto:scholar@example.com",
    );
  });

  it("allows http(s), mailto, and tel", () => {
    expect(safeContactHref("https://example.com")).toBe("https://example.com");
    expect(safeContactHref("mailto:a@b.com")).toBe("mailto:a@b.com");
    expect(safeContactHref("tel:+1234567890")).toBe("tel:+1234567890");
  });

  it("rejects javascript and protocol-relative URLs", () => {
    expect(safeContactHref("javascript:alert(1)")).toBeNull();
    expect(safeContactHref("//evil.example")).toBeNull();
  });

  it("returns null for empty values", () => {
    expect(safeContactHref("")).toBeNull();
    expect(safeContactHref(null)).toBeNull();
  });
});

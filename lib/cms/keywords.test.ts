import { describe, expect, it } from "vitest";
import {
  KEYWORD_GROUPS,
  getSuggestions,
  matchKeyword,
} from "@/lib/cms/keywords";

describe("KEYWORD_GROUPS integrity", () => {
  it("defines non-empty groups with valid entries", () => {
    expect(KEYWORD_GROUPS.length).toBeGreaterThan(0);

    for (const group of KEYWORD_GROUPS) {
      expect(group.keywords.length).toBeGreaterThan(0);
      expect(group.entry.label).toBeTruthy();
      expect(group.entry.href.startsWith("/")).toBe(true);
      expect(["service", "course", "event", "article"]).toContain(group.entry.category);
    }
  });
});

describe("matchKeyword", () => {
  it("returns null for empty or whitespace-only inputs", () => {
    expect(matchKeyword("")).toBeNull();
    expect(matchKeyword("   ")).toBeNull();
  });

  it("matches keywords directly and case-insensitively", () => {
    const kafara = matchKeyword("kafara");
    expect(kafara).not.toBeNull();
    expect(kafara?.href).toBe("/services/kafara");

    const tajweedUpper = matchKeyword("  TAJWEED  ");
    expect(tajweedUpper).not.toBeNull();
    expect(tajweedUpper?.href).toBe("/online-courses/tajweed");
  });

  it("matches keywords via substring", () => {
    const charity = matchKeyword("charity");
    expect(charity?.href).toBe("/services/sadaqah");

    const nikah = matchKeyword("nikah ceremony");
    expect(nikah?.href).toBe("/services/nikah");
  });

  it("returns null for unrecognized queries", () => {
    expect(matchKeyword("xyz-nonexistent-query-12345")).toBeNull();
  });
});

describe("getSuggestions", () => {
  it("returns empty array for empty or whitespace query", () => {
    expect(getSuggestions("")).toEqual([]);
    expect(getSuggestions("   ")).toEqual([]);
  });

  it("returns suggestions matching keyword substrings", () => {
    const results = getSuggestions("quran");
    expect(results.length).toBeGreaterThan(0);
    expect(results.length).toBeLessThanOrEqual(6);
    expect(results.some((r) => r.href.includes("tajweed") || r.href.includes("noorani"))).toBe(true);
  });

  it("supports fuzzy matching within Levenshtein distance 2", () => {
    // "tajwed" has distance 1 from "tajweed"
    const results = getSuggestions("tajwed");
    expect(results.some((r) => r.href === "/online-courses/tajweed")).toBe(true);
  });

  it("deduplicates suggestions by href", () => {
    const results = getSuggestions("quran");
    const hrefs = results.map((r) => r.href);
    const uniqueHrefs = Array.from(new Set(hrefs));
    expect(hrefs).toEqual(uniqueHrefs);
  });

  it("falls back to category representatives when no keywords match", () => {
    const results = getSuggestions("completely-random-gibberish-string");
    expect(results.length).toBeGreaterThan(0);
    expect(results.length).toBeLessThanOrEqual(6);
    // Unique categories represented
    const categories = results.map((r) => r.category);
    expect(new Set(categories).size).toBe(categories.length);
  });
});


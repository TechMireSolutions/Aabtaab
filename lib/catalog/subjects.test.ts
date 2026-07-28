import { describe, expect, it } from "vitest";
import {
  formatSubjectLabel,
  normalizePublicTitle,
} from "@/lib/catalog/subjects";

describe("formatSubjectLabel", () => {
  it("maps known subject slugs to titles", () => {
    expect(formatSubjectLabel("quran")).toBe("Quran");
    expect(formatSubjectLabel("nejul-balagha")).toBe("Nahjul Balagha");
    expect(formatSubjectLabel("ethics")).toBe("Ethics (Akhlaq)");
  });

  it("title-cases unknown slugs", () => {
    expect(formatSubjectLabel("fiqh-basics")).toBe("Fiqh Basics");
  });
});

describe("normalizePublicTitle", () => {
  it("corrects Nahjul Balagha misspellings", () => {
    expect(normalizePublicTitle("Nejul Balagha")).toBe("Nahjul Balagha");
    expect(normalizePublicTitle("Nehjul Balagha")).toBe("Nahjul Balagha");
    expect(normalizePublicTitle("Ethics")).toBe("Ethics");
  });
});

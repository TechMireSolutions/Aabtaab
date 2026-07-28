import { describe, expect, it } from "vitest";
import {
  faqItemsToSchema,
  portableTextToPlainText,
} from "@/lib/seo/portable-text-plain";

describe("portableTextToPlainText", () => {
  it("returns trimmed strings as-is", () => {
    expect(portableTextToPlainText("  Hello  ")).toBe("Hello");
  });

  it("returns empty for non-array non-string", () => {
    expect(portableTextToPlainText(null)).toBe("");
    expect(portableTextToPlainText(42)).toBe("");
  });

  it("joins block children text with newlines", () => {
    expect(
      portableTextToPlainText([
        { children: [{ text: "Line one" }, { text: " cont" }] },
        { children: [{ text: "Line two" }] },
        { children: [] },
      ]),
    ).toBe("Line one cont\nLine two");
  });
});

describe("faqItemsToSchema", () => {
  it("returns empty for missing items", () => {
    expect(faqItemsToSchema()).toEqual([]);
    expect(faqItemsToSchema([])).toEqual([]);
  });

  it("keeps only items with question and answer text", () => {
    expect(
      faqItemsToSchema([
        {
          question: " What is Khums? ",
          answer: [{ children: [{ text: "One fifth." }] }],
        },
        { question: "Empty answer", answer: [] },
        { question: "", answer: "Nope" },
      ]),
    ).toEqual([{ question: "What is Khums?", answer: "One fifth." }]);
  });
});

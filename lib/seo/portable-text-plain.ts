/** Strip Sanity portable text blocks to plain strings for JSON-LD. */
export function portableTextToPlainText(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (!Array.isArray(value)) return "";

  return value
    .map((block) => {
      if (!block || typeof block !== "object" || !("children" in block)) {
        return "";
      }
      const children = (block as { children?: Array<{ text?: string }> })
        .children;
      return children?.map((child) => child.text ?? "").join("") ?? "";
    })
    .filter(Boolean)
    .join("\n")
    .trim();
}

export function faqItemsToSchema(
  items?: Array<{ question?: string; answer?: unknown }>,
): Array<{ question: string; answer: string }> {
  if (!items?.length) return [];

  return items
    .map((item) => {
      const question = item.question?.trim();
      const answer = portableTextToPlainText(item.answer);
      if (!question || !answer) return null;
      return { question, answer };
    })
    .filter((item): item is { question: string; answer: string } => item !== null);
}

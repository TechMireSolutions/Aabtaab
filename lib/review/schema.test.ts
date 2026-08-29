import { describe, expect, it } from "vitest";
import { parseReviewBody, reviewBodySchema } from "./schema";

describe("reviewBodySchema", () => {
  it("accepts a valid review", () => {
    const parsed = reviewBodySchema.safeParse({
      name: "Ali",
      quote: "Great teachers and community.",
    });
    expect(parsed.success).toBe(true);
  });

  it("accepts a valid review with rating", () => {
    const parsed = reviewBodySchema.safeParse({
      name: "Ali",
      quote: "Great teachers and community.",
      rating: 5,
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects invalid rating values", () => {
    const parsedZero = reviewBodySchema.safeParse({
      name: "Ali",
      quote: "Great teachers and community.",
      rating: 0,
    });
    expect(parsedZero.success).toBe(false);

    const parsedOver = reviewBodySchema.safeParse({
      name: "Ali",
      quote: "Great teachers and community.",
      rating: 6,
    });
    expect(parsedOver.success).toBe(false);
  });

  it("rejects short quotes", () => {
    const parsed = reviewBodySchema.safeParse({
      name: "Ali",
      quote: "short",
    });
    expect(parsed.success).toBe(false);
  });
});

describe("parseReviewBody", () => {
  it("rejects honeypot submissions", () => {
    const result = parseReviewBody({
      name: "Bot",
      quote: "This is a long enough fake review",
      website: "https://spam.example",
    });
    expect(result.success).toBe(false);
  });
});

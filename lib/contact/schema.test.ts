import { describe, expect, it } from "vitest";
import { parseContactBody } from "@/lib/contact/schema";

describe("parseContactBody", () => {
  const valid = {
    firstName: "Ali",
    lastName: "Hassan",
    email: "ali@example.com",
    phone: "+1 555 0100",
    country: "USA",
    city: "Chicago",
    message: "I would like more information about courses.",
  };

  it("accepts valid payload and defaults purpose to general", () => {
    const result = parseContactBody(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("ali@example.com");
      expect(result.data.purpose).toBe("general");
    }
  });

  it("accepts all purpose values including other", () => {
    for (const purpose of ["general", "course", "service", "other"] as const) {
      const result = parseContactBody({ ...valid, purpose });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.purpose).toBe(purpose);
      }
    }
  });

  it("trims string fields", () => {
    const result = parseContactBody({
      ...valid,
      firstName: "  Ali  ",
      email: "  ali@example.com  ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.firstName).toBe("Ali");
      expect(result.data.email).toBe("ali@example.com");
    }
  });

  it("accepts message at minimum length boundary", () => {
    const result = parseContactBody({
      ...valid,
      message: "1234567890",
    });
    expect(result.success).toBe(true);
  });

  it("rejects short message", () => {
    const result = parseContactBody({ ...valid, message: "hi" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toMatch(/at least 10/i);
    }
  });

  it("rejects invalid email", () => {
    const result = parseContactBody({ ...valid, email: "not-an-email" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toMatch(/invalid email/i);
    }
  });

  it("rejects missing first name", () => {
    const result = parseContactBody({ ...valid, firstName: "   " });
    expect(result.success).toBe(false);
  });

  it("rejects short phone", () => {
    const result = parseContactBody({ ...valid, phone: "1234" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid purpose", () => {
    const result = parseContactBody({ ...valid, purpose: "spam" });
    expect(result.success).toBe(false);
  });

  it("rejects honeypot when filled", () => {
    const result = parseContactBody({ ...valid, website: "https://spam.test" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Invalid submission");
    }
  });

  it("allows empty honeypot website", () => {
    const result = parseContactBody({ ...valid, website: "   " });
    expect(result.success).toBe(true);
  });

  it("accepts appliedFor for course purpose", () => {
    const result = parseContactBody({
      ...valid,
      purpose: "course",
      appliedFor: "Quran for Kids",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.appliedFor).toBe("Quran for Kids");
    }
  });
});

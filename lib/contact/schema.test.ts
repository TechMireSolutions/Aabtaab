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

  it("accepts valid payload", () => {
    const result = parseContactBody(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("ali@example.com");
      expect(result.data.purpose).toBe("general");
    }
  });

  it("rejects missing email", () => {
    const result = parseContactBody({ ...valid, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects honeypot when filled", () => {
    const result = parseContactBody({ ...valid, website: "https://spam.test" });
    expect(result.success).toBe(false);
  });

  it("rejects short message", () => {
    const result = parseContactBody({ ...valid, message: "hi" });
    expect(result.success).toBe(false);
  });
});

import { describe, expect, it } from "vitest";
import { secretsEqual } from "@/lib/security/secrets";

describe("secretsEqual", () => {
  it("returns true for equal secrets", () => {
    expect(secretsEqual("preview-secret", "preview-secret")).toBe(true);
  });

  it("returns false for mismatched secrets or lengths", () => {
    expect(secretsEqual("preview-secret", "other-secret")).toBe(false);
    expect(secretsEqual("short", "longer-value")).toBe(false);
  });

  it("returns false when either side is missing", () => {
    expect(secretsEqual(null, "secret")).toBe(false);
    expect(secretsEqual("secret", undefined)).toBe(false);
    expect(secretsEqual("", "secret")).toBe(false);
  });
});

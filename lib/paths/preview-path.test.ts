import { describe, expect, it } from "vitest";
import { previewPath } from "@/lib/paths/preview-path";

describe("previewPath", () => {
  it("maps known types to internal paths", () => {
    expect(previewPath("post", "hello")).toBe("/posts/hello");
    expect(previewPath("course", "fiqh")).toBe("/online-courses/fiqh");
    expect(previewPath("homepageSettings", null)).toBe("/");
  });

  it("rejects open redirects", () => {
    expect(previewPath(null, "//evil.example")).toBe("/");
    expect(previewPath(null, "https://evil.example")).toBe("/");
    expect(previewPath(null, "/\\evil")).toBe("/");
  });

  it("allows known internal absolute paths", () => {
    expect(previewPath(null, "/about")).toBe("/about");
    expect(previewPath(null, "/posts/x")).toBe("/posts/x");
  });
});

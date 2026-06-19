import { describe, expect, it } from "vitest";
import { escapeHtml } from "@/lib/contact/email-html";

describe("escapeHtml", () => {
  it("escapes HTML special characters", () => {
    expect(escapeHtml(`<script>alert("x")</script>`)).toBe(
      "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;",
    );
  });

  it("leaves plain text unchanged", () => {
    expect(escapeHtml("Hello world")).toBe("Hello world");
  });
});

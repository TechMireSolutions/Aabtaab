import { describe, expect, it } from "vitest";
import {
  buildContactNotificationHtml,
  escapeHtml,
} from "@/lib/contact/email-html";

describe("escapeHtml", () => {
  it("escapes HTML special characters", () => {
    expect(escapeHtml(`<script>alert("x")</script>`)).toBe(
      "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;",
    );
  });

  it("escapes ampersand and single quote", () => {
    expect(escapeHtml(`Tom & Jerry's`)).toBe("Tom &amp; Jerry&#39;s");
  });

  it("leaves plain text unchanged", () => {
    expect(escapeHtml("Hello world")).toBe("Hello world");
  });
});

describe("buildContactNotificationHtml", () => {
  const fields = {
    fullName: "Ali <script>",
    email: 'ali@"evil".com',
    phone: "555-0100",
    country: "USA",
    city: "Chicago",
    purposeText: "General Inquiry",
    message: "Hello & welcome",
  };

  it("escapes user fields in the HTML body", () => {
    const html = buildContactNotificationHtml(fields);
    expect(html).toContain("Ali &lt;script&gt;");
    expect(html).toContain("Hello &amp; welcome");
    expect(html).not.toContain("<script>");
    expect(html).toContain("New Contact Form Submission");
  });

  it("omits Applied For row when not provided", () => {
    const html = buildContactNotificationHtml(fields);
    expect(html).not.toContain("Applied For");
  });

  it("includes Applied For when provided", () => {
    const html = buildContactNotificationHtml({
      ...fields,
      appliedFor: "Zakat <b>Service</b>",
    });
    expect(html).toContain("Applied For");
    expect(html).toContain("Zakat &lt;b&gt;Service&lt;/b&gt;");
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockRevalidateTag, mockEnv } = vi.hoisted(() => ({
  mockRevalidateTag: vi.fn(),
  mockEnv: {
    SANITY_REVALIDATE_SECRET: "correct-secret-123",
  },
}));

vi.mock("next/cache", () => ({
  revalidateTag: mockRevalidateTag,
}));

vi.mock("@/lib/env", () => ({
  env: mockEnv,
}));

vi.mock("@sentry/nextjs", () => ({
  captureException: vi.fn(),
}));

import { NextRequest } from "next/server";
import { POST } from "./route";
import { CACHE_TAGS } from "@/sanity/lib/fetch";

describe("POST /api/revalidate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockEnv.SANITY_REVALIDATE_SECRET = "correct-secret-123";
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  function createRequest(
    options: {
      secret?: string;
      headerSecret?: string;
      body?: unknown;
      rawText?: string;
    } = {},
  ): NextRequest {
    const url = options.secret
      ? `https://aabtaab.com/api/revalidate?secret=${options.secret}`
      : "https://aabtaab.com/api/revalidate";

    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    if (options.headerSecret) {
      headers.set("x-sanity-webhook-secret", options.headerSecret);
    }

    return new NextRequest(url, {
      method: "POST",
      headers,
      body:
        options.rawText !== undefined
          ? options.rawText
          : JSON.stringify(options.body ?? {}),
    });
  }

  it("returns 401 when webhook secret is missing or invalid", async () => {
    const req = createRequest({ secret: "wrong-secret" });
    const res = await POST(req);

    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.message).toBe("Invalid secret");
    expect(mockRevalidateTag).not.toHaveBeenCalled();
  });

  it("authenticates via x-sanity-webhook-secret header", async () => {
    const req = createRequest({
      headerSecret: "correct-secret-123",
      body: { _type: "siteSettings" },
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.revalidated).toContain(CACHE_TAGS.all);
    expect(data.revalidated).toContain(CACHE_TAGS.siteSettings);
  });

  it("returns 400 for malformed JSON body", async () => {
    const req = createRequest({
      headerSecret: "correct-secret-123",
      rawText: "not-json-content",
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.message).toBe("Invalid JSON body");
  });

  it("revalidates post collection and specific post slug", async () => {
    const req = createRequest({
      headerSecret: "correct-secret-123",
      body: { _type: "post", slug: { current: "ethics-in-islam" } },
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.revalidated).toEqual(
      expect.arrayContaining([
        CACHE_TAGS.all,
        CACHE_TAGS.posts,
        CACHE_TAGS.post("ethics-in-islam"),
      ]),
    );
  });

  it("revalidates course and nested course slug", async () => {
    const req = createRequest({
      headerSecret: "correct-secret-123",
      body: { _type: "course", slug: { current: "fiqh" } },
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.revalidated).toEqual(
      expect.arrayContaining([
        CACHE_TAGS.all,
        CACHE_TAGS.courses,
        CACHE_TAGS.course("fiqh"),
      ]),
    );
  });

  it("revalidates homepage when testimonial, scholar, or country changes", async () => {
    const req = createRequest({
      headerSecret: "correct-secret-123",
      body: { _type: "testimonial" },
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.revalidated).toContain(CACHE_TAGS.testimonials);
    expect(data.revalidated).toContain(CACHE_TAGS.homepage);
  });

  it("revalidates page tag and page slug tag", async () => {
    const req = createRequest({
      headerSecret: "correct-secret-123",
      body: { _type: "page", slug: { current: "about" } },
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.revalidated).toContain(CACHE_TAGS.pages);
    expect(data.revalidated).toContain(CACHE_TAGS.page("about"));
  });
});


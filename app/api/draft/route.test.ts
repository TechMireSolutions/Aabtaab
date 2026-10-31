import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockDraftEnable, mockRedirect, mockEnv } = vi.hoisted(() => ({
  mockDraftEnable: vi.fn(),
  mockRedirect: vi.fn((path: string) => {
    throw new Error(`REDIRECT:${path}`);
  }),
  mockEnv: {
    SANITY_PREVIEW_SECRET: "preview-secret-456",
  },
}));

vi.mock("next/headers", () => ({
  draftMode: async () => ({
    enable: mockDraftEnable,
  }),
}));

vi.mock("next/navigation", () => ({
  redirect: mockRedirect,
}));

vi.mock("@/lib/env", () => ({
  env: mockEnv,
}));

import { NextRequest } from "next/server";
import { GET } from "./route";

describe("GET /api/draft", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function createRequest(params: Record<string, string>, headerSecret?: string): NextRequest {
    const url = new URL("https://aabtaab.com/api/draft");
    for (const [key, val] of Object.entries(params)) {
      url.searchParams.set(key, val);
    }
    const headers = new Headers();
    if (headerSecret) {
      headers.set("x-sanity-preview-secret", headerSecret);
    }
    return new NextRequest(url, { headers });
  }

  it("returns 401 when preview secret is missing or invalid", async () => {
    const req = createRequest({ secret: "wrong" });
    const res = await GET(req);

    expect(res.status).toBe(401);
    expect(await res.text()).toBe("Invalid preview secret");
    expect(mockDraftEnable).not.toHaveBeenCalled();
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("enables draft mode and redirects to target path when authenticated via query secret", async () => {
    const req = createRequest({
      secret: "preview-secret-456",
      type: "post",
      slug: "upcoming-article",
    });

    await expect(GET(req)).rejects.toThrow("REDIRECT:/posts/upcoming-article");
    expect(mockDraftEnable).toHaveBeenCalled();
    expect(mockRedirect).toHaveBeenCalledWith("/posts/upcoming-article");
  });

  it("enables draft mode and redirects when authenticated via header secret", async () => {
    const req = createRequest(
      { type: "event", slug: "annual-majlis" },
      "preview-secret-456",
    );

    await expect(GET(req)).rejects.toThrow("REDIRECT:/events/annual-majlis");
    expect(mockDraftEnable).toHaveBeenCalled();
    expect(mockRedirect).toHaveBeenCalledWith("/events/annual-majlis");
  });
});


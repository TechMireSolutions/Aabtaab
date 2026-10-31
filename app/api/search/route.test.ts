import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  mockCheckSearchRateLimit,
  mockClientIpFromRequest,
  mockSearchSite,
  mockCaptureException,
} = vi.hoisted(() => ({
  mockCheckSearchRateLimit: vi.fn(),
  mockClientIpFromRequest: vi.fn(),
  mockSearchSite: vi.fn(),
  mockCaptureException: vi.fn(),
}));

vi.mock("@sentry/nextjs", () => ({
  captureException: mockCaptureException,
}));

vi.mock("@/lib/rate-limit", () => ({
  checkSearchRateLimit: mockCheckSearchRateLimit,
  clientIpFromRequest: mockClientIpFromRequest,
}));

vi.mock("@/lib/cms/search", () => ({
  searchSite: mockSearchSite,
}));

import { NextRequest } from "next/server";
import { GET } from "./route";

describe("GET /api/search", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockClientIpFromRequest.mockReturnValue("127.0.0.1");
    mockCheckSearchRateLimit.mockResolvedValue({ allowed: true });
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  function createRequest(query?: string): NextRequest {
    const url = query !== undefined
      ? `https://aabtaab.com/api/search?q=${encodeURIComponent(query)}`
      : "https://aabtaab.com/api/search";
    return new NextRequest(url);
  }

  it("returns 429 when search rate limit is exceeded", async () => {
    mockCheckSearchRateLimit.mockResolvedValueOnce({ allowed: false });

    const req = createRequest("tajweed");
    const res = await GET(req);

    expect(res.status).toBe(429);
    expect(mockCheckSearchRateLimit).toHaveBeenCalledWith("search_127.0.0.1");
    expect(mockSearchSite).not.toHaveBeenCalled();
  });

  it("calls searchSite with query parameter and returns response", async () => {
    const mockResponse = {
      keywordMatch: { label: "Tajweed", href: "/online-courses/tajweed", category: "course" },
      suggestions: [],
      results: [{ _id: "res-1", title: "Tajweed" }],
    };
    mockSearchSite.mockResolvedValueOnce(mockResponse);

    const req = createRequest("tajweed");
    const res = await GET(req);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual(mockResponse);
    expect(mockSearchSite).toHaveBeenCalledWith("tajweed");
  });

  it("handles missing q param by passing empty string", async () => {
    mockSearchSite.mockResolvedValueOnce({ keywordMatch: null, suggestions: [], results: [] });

    const req = createRequest();
    const res = await GET(req);

    expect(res.status).toBe(200);
    expect(mockSearchSite).toHaveBeenCalledWith("");
  });

  it("returns 500 and logs exception when searchSite throws", async () => {
    mockSearchSite.mockRejectedValueOnce(new Error("Sanity network failure"));

    const req = createRequest("fiqh");
    const res = await GET(req);

    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.message).toBe("Internal server error during search");
    expect(mockCaptureException).toHaveBeenCalled();
  });
});


import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  mockCheckContactRateLimit,
  mockClientIpFromRequest,
  mockVerifyTurnstile,
  mockSanityCreate,
  mockCaptureException,
} = vi.hoisted(() => ({
  mockCheckContactRateLimit: vi.fn(),
  mockClientIpFromRequest: vi.fn(),
  mockVerifyTurnstile: vi.fn(),
  mockSanityCreate: vi.fn(),
  mockCaptureException: vi.fn(),
}));

vi.mock("@sentry/nextjs", () => ({
  captureException: mockCaptureException,
}));

vi.mock("@/lib/rate-limit", () => ({
  checkContactRateLimit: mockCheckContactRateLimit,
  clientIpFromRequest: mockClientIpFromRequest,
}));

vi.mock("@/lib/security/verify-turnstile", () => ({
  verifyTurnstileOrSkip: mockVerifyTurnstile,
}));

vi.mock("@/sanity/lib/writeClient", () => ({
  getSanityWriteClient: () => ({
    create: mockSanityCreate,
  }),
}));

import { POST } from "./route";

describe("POST /api/review", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockClientIpFromRequest.mockReturnValue("127.0.0.1");
    mockCheckContactRateLimit.mockResolvedValue({ allowed: true });
    mockVerifyTurnstile.mockResolvedValue(null);
    mockSanityCreate.mockResolvedValue({ _id: "testimonial-123" });
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  function createRequest(body: unknown, rawText?: string): Request {
    return new Request("https://aabtaab.com/api/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: rawText !== undefined ? rawText : JSON.stringify(body),
    });
  }

  const validReview = {
    name: "Zahra Batool",
    role: "Student",
    quote: "The Tajweed lessons were incredibly clear and helpful for my Quran recitation.",
    rating: 5,
    honeypot: "",
  };

  it("returns 429 when rate limit is exceeded", async () => {
    mockCheckContactRateLimit.mockResolvedValueOnce({ allowed: false });

    const req = createRequest(validReview);
    const res = await POST(req);

    expect(res.status).toBe(429);
    expect(mockCheckContactRateLimit).toHaveBeenCalledWith("review_127.0.0.1");
  });

  it("returns 413 when payload exceeds max size (8KB)", async () => {
    const hugePayload = "b".repeat(9_000);
    const req = createRequest(null, hugePayload);

    const res = await POST(req);
    expect(res.status).toBe(413);
    const data = await res.json();
    expect(data.error).toBe("Payload too large");
  });

  it("returns 400 for invalid JSON", async () => {
    const req = createRequest(null, "{malformed:json}");

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Invalid JSON body");
  });

  it("returns 400 when review validation fails (e.g. quote too short)", async () => {
    const req = createRequest({ ...validReview, quote: "short" });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBeTruthy();
  });

  it("returns 400 when Turnstile verification fails", async () => {
    mockVerifyTurnstile.mockResolvedValueOnce("Captcha rejected");

    const req = createRequest(validReview);
    const res = await POST(req);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Captcha rejected");
  });

  it("creates a pending draft testimonial in Sanity with rating 5 fallback", async () => {
    const reviewWithoutRating = { ...validReview, rating: undefined };
    const req = createRequest(reviewWithoutRating);

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);

    expect(mockSanityCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        _type: "testimonial",
        name: "Zahra Batool",
        role: "Student",
        rating: 5,
        status: "pending",
        order: 99,
      }),
    );
  });

  it("returns 500 when Sanity create fails", async () => {
    mockSanityCreate.mockRejectedValueOnce(new Error("Database error"));

    const req = createRequest(validReview);
    const res = await POST(req);

    expect(res.status).toBe(500);
    expect(mockCaptureException).toHaveBeenCalled();
  });
});


import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  mockCheckContactRateLimit,
  mockClientIpFromRequest,
  mockVerifyTurnstile,
  mockSanityCreate,
  mockSendContactNotification,
  mockCaptureMessage,
  mockCaptureException,
} = vi.hoisted(() => ({
  mockCheckContactRateLimit: vi.fn(),
  mockClientIpFromRequest: vi.fn(),
  mockVerifyTurnstile: vi.fn(),
  mockSanityCreate: vi.fn(),
  mockSendContactNotification: vi.fn(),
  mockCaptureMessage: vi.fn(),
  mockCaptureException: vi.fn(),
}));

vi.mock("@sentry/nextjs", () => ({
  captureMessage: mockCaptureMessage,
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

vi.mock("@/lib/contact/notify", () => ({
  sendContactNotification: mockSendContactNotification,
}));

import { POST } from "./route";

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockClientIpFromRequest.mockReturnValue("127.0.0.1");
    mockCheckContactRateLimit.mockResolvedValue({ allowed: true });
    mockVerifyTurnstile.mockResolvedValue(null);
    mockSanityCreate.mockResolvedValue({ _id: "submission-123" });
    mockSendContactNotification.mockResolvedValue(true);
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  function createRequest(body: unknown, rawText?: string): Request {
    return new Request("https://aabtaab.com/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: rawText !== undefined ? rawText : JSON.stringify(body),
    });
  }

  const validPayload = {
    firstName: "Husayn",
    lastName: "Ali",
    email: "husayn@example.com",
    phone: "+1234567890",
    country: "US",
    city: "Dearborn",
    purpose: "course",
    appliedFor: "Tajweed Course",
    message: "I would like to enroll in the course.",
    company: "", // honeypot empty
  };

  it("returns 429 when rate limit is exceeded", async () => {
    mockCheckContactRateLimit.mockResolvedValueOnce({ allowed: false });

    const req = createRequest(validPayload);
    const res = await POST(req);

    expect(res.status).toBe(429);
    const data = await res.json();
    expect(data.error).toContain("Too many requests");
  });

  it("returns 413 when payload exceeds max size", async () => {
    const hugeString = "a".repeat(17_000);
    const req = createRequest(null, hugeString);

    const res = await POST(req);
    expect(res.status).toBe(413);
    const data = await res.json();
    expect(data.error).toBe("Payload too large");
  });

  it("returns 400 for invalid JSON", async () => {
    const req = createRequest(null, "invalid-json-body{{{");

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Invalid JSON body");
  });

  it("returns 400 when Zod validation fails", async () => {
    const req = createRequest({ ...validPayload, email: "invalid-email" });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBeTruthy();
  });

  it("returns 400 when Turnstile verification fails", async () => {
    mockVerifyTurnstile.mockResolvedValueOnce("Captcha verification failed");

    const req = createRequest(validPayload);
    const res = await POST(req);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Captcha verification failed");
  });

  it("successfully creates Sanity document and sends email notification", async () => {
    const req = createRequest(validPayload);
    const res = await POST(req);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);

    expect(mockSanityCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        _type: "contactSubmission",
        firstName: "Husayn",
        email: "husayn@example.com",
        purpose: "course",
        appliedFor: "Tajweed Course",
        status: "new",
      }),
    );

    expect(mockSendContactNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: expect.stringContaining("Husayn Ali"),
        fields: expect.objectContaining({
          fullName: "Husayn Ali",
          email: "husayn@example.com",
        }),
      }),
    );
  });

  it("still returns 200 and captures Sentry warning if email notification fails", async () => {
    mockSendContactNotification.mockResolvedValueOnce(false);

    const req = createRequest(validPayload);
    const res = await POST(req);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(mockCaptureMessage).toHaveBeenCalledWith(
      "Contact saved but email not delivered",
      expect.objectContaining({ level: "warning" }),
    );
  });

  it("returns 500 when Sanity create fails", async () => {
    mockSanityCreate.mockRejectedValueOnce(new Error("Database connection lost"));

    const req = createRequest(validPayload);
    const res = await POST(req);

    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe("Failed to save submission");
    expect(mockCaptureException).toHaveBeenCalled();
  });
});


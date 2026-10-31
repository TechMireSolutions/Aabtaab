import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockCaptureMessage, mockCaptureException, mockResendSend, mockSendMail, mockEnv } =
  vi.hoisted(() => ({
    mockCaptureMessage: vi.fn(),
    mockCaptureException: vi.fn(),
    mockResendSend: vi.fn(),
    mockSendMail: vi.fn(),
    mockEnv: {
      EMAIL_TO: "recipient@example.com",
      EMAIL_FROM: "from@example.com",
      RESEND_API_KEY: "re_test_123",
      EMAIL_USER: "smtpuser@example.com",
      EMAIL_PASS: "smtppass123",
    },
  }));

vi.mock("@sentry/nextjs", () => ({
  captureMessage: (...args: unknown[]) => mockCaptureMessage(...args),
  captureException: (...args: unknown[]) => mockCaptureException(...args),
}));

vi.mock("resend", () => ({
  Resend: class {
    emails = {
      send: mockResendSend,
    };
  },
}));

vi.mock("nodemailer", () => ({
  default: {
    createTransport: () => ({
      sendMail: mockSendMail,
    }),
  },
  createTransport: () => ({
    sendMail: mockSendMail,
  }),
}));

vi.mock("@/lib/env", () => ({
  env: mockEnv,
}));

import { sendContactNotification } from "@/lib/contact/notify";

describe("sendContactNotification", () => {
  const sampleFields = {
    fullName: "Ali Reza",
    email: "ali@example.com",
    phone: "+1234567890",
    country: "US",
    city: "Dearborn",
    purposeText: "General Inquiry",
    message: "Salam alaykum, I have a question about courses.",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockEnv.EMAIL_TO = "recipient@example.com";
    mockEnv.EMAIL_FROM = "from@example.com";
    mockEnv.RESEND_API_KEY = "re_test_123";
    mockEnv.EMAIL_USER = "smtpuser@example.com";
    mockEnv.EMAIL_PASS = "smtppass123";
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("skips and returns false when EMAIL_TO is unset", async () => {
    mockEnv.EMAIL_TO = "";

    const result = await sendContactNotification({
      subject: "Test Subject",
      fields: sampleFields,
    });

    expect(result).toBe(false);
    expect(mockCaptureMessage).toHaveBeenCalledWith(
      expect.stringContaining("EMAIL_TO unset"),
      expect.objectContaining({ level: "warning" }),
    );
    expect(mockResendSend).not.toHaveBeenCalled();
    expect(mockSendMail).not.toHaveBeenCalled();
  });

  it("sends successfully via Resend when configured", async () => {
    mockResendSend.mockResolvedValueOnce({ error: null });

    const result = await sendContactNotification({
      subject: "New Inquiry",
      fields: sampleFields,
    });

    expect(result).toBe(true);
    expect(mockResendSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "recipient@example.com",
        subject: "New Inquiry",
        from: "from@example.com",
      }),
    );
    expect(mockSendMail).not.toHaveBeenCalled();
  });

  it("falls back to SMTP when Resend fails", async () => {
    mockResendSend.mockResolvedValueOnce({ error: new Error("Resend rate limit") });
    mockSendMail.mockResolvedValueOnce({});

    const result = await sendContactNotification({
      subject: "New Inquiry",
      fields: sampleFields,
    });

    expect(result).toBe(true);
    expect(mockResendSend).toHaveBeenCalled();
    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "recipient@example.com",
        subject: "New Inquiry",
      }),
    );
  });

  it("falls back to SMTP when Resend throws an exception", async () => {
    mockResendSend.mockRejectedValueOnce(new Error("Network disconnect"));
    mockSendMail.mockResolvedValueOnce({});

    const result = await sendContactNotification({
      subject: "New Inquiry",
      fields: sampleFields,
    });

    expect(result).toBe(true);
    expect(mockCaptureException).toHaveBeenCalled();
    expect(mockSendMail).toHaveBeenCalled();
  });

  it("returns false and reports error when both Resend and SMTP fail", async () => {
    mockResendSend.mockResolvedValueOnce({ error: "Resend down" });
    mockSendMail.mockRejectedValueOnce(new Error("SMTP connection timeout"));

    const result = await sendContactNotification({
      subject: "New Inquiry",
      fields: sampleFields,
    });

    expect(result).toBe(false);
    expect(mockCaptureMessage).toHaveBeenCalledWith(
      "Contact notification failed on all channels",
      expect.objectContaining({ level: "error" }),
    );
  });
});

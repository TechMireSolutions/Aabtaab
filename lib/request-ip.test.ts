import { describe, expect, it } from "vitest";
import { clientIpFromRequest } from "./request-ip";

function requestWithHeaders(headers: Record<string, string>): Request {
  return new Request("https://example.com/api/contact", { headers });
}

describe("clientIpFromRequest", () => {
  it("prefers cf-connecting-ip when behind Cloudflare", () => {
    const req = requestWithHeaders({
      "cf-connecting-ip": " 203.0.113.10 ",
      "x-forwarded-for": "198.51.100.1",
    });
    expect(clientIpFromRequest(req)).toBe("203.0.113.10");
  });

  it("falls back to first x-forwarded-for hop", () => {
    const req = requestWithHeaders({
      "x-forwarded-for": "198.51.100.1, 10.0.0.1",
    });
    expect(clientIpFromRequest(req)).toBe("198.51.100.1");
  });

  it("uses x-real-ip when no forwarded header", () => {
    const req = requestWithHeaders({ "x-real-ip": "192.0.2.44" });
    expect(clientIpFromRequest(req)).toBe("192.0.2.44");
  });

  it("returns unknown when no proxy headers", () => {
    expect(clientIpFromRequest(new Request("https://example.com"))).toBe(
      "unknown",
    );
  });

  it("returns empty string for blank first forwarded hop", () => {
    const req = requestWithHeaders({ "x-forwarded-for": "  , 10.0.0.1" });
    expect(clientIpFromRequest(req)).toBe("");
  });

  it("trims x-real-ip", () => {
    const req = requestWithHeaders({ "x-real-ip": " 192.0.2.55 " });
    expect(clientIpFromRequest(req)).toBe("192.0.2.55");
  });
});

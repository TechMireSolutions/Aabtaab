/**
 * Client IP behind reverse proxies (Cloudflare, nginx, Vercel).
 * Prefer Cloudflare's connecting IP when present.
 */
export function clientIpFromRequest(req: Request): string {
  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();

  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }

  return req.headers.get("x-real-ip")?.trim() ?? "unknown";
}

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,

  // ── Sanity packages require transpilation in Next.js App Router ─────────
  transpilePackages: ["sanity", "@sanity/ui", "@sanity/icons"],

  // ── Image optimization ───────────────────────────────────────────────────
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
    // Modern formats: WebP first, then AVIF for supported browsers
    formats: ["image/webp", "image/avif"],
  },

  // ── HTTP Security & Cache Headers ─────────────────────────────────────────
  async redirects() {
    return [
      {
        source: "/articles",
        destination: "/posts",
        permanent: true,
      },
      {
        source: "/articles/:slug",
        destination: "/posts/:slug",
        permanent: true,
      },
    ];
  },

  // ── HTTP Security & Cache Headers ─────────────────────────────────────────
  // Improves Core Web Vitals (LCP via caching), security posture, and
  // signals to Google that the site is well-maintained (indirect E-E-A-T).
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Prevent clickjacking
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // Stop MIME-type sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Force HTTPS for 1 year (includeSubDomains)
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          // Control referrer info for privacy
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Basic permissions policy
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy-Report-Only",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.sanity.io",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://*.sanity.io wss://*.sanity.io https://*.ingest.sentry.io",
              "frame-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
      {
        // Immutable cache for all static assets (_next/static)
        // These are content-hashed so they're safe to cache forever
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Optimized images from Next.js Image component
        source: "/_next/image(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";
import path from "node:path";

const emptyPolyfillRelative = "./lib/empty-polyfill.js";
const emptyPolyfillAbsolute = path.join(process.cwd(), "lib/empty-polyfill.js");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  trailingSlash: false,

  reactCompiler: true,

  typescript: {
    ignoreBuildErrors: true,
  },

  experimental: {
    optimizePackageImports: ["lucide-react"],
    inlineCss: true,
    // TypeScript 7 has no JS Compiler API — run project-local `tsc` instead
    useTypeScriptCli: true,
  },

  turbopack: {
    root: process.cwd(),
    resolveAlias: {
      "../build/polyfills/polyfill-module": emptyPolyfillRelative,
    },
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve ??= {};
      config.resolve.alias = {
        ...config.resolve.alias,
        "../build/polyfills/polyfill-module": emptyPolyfillAbsolute,
      };
    }
    return config;
  },

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
    // Modern formats: AVIF prioritized for supported browsers, WebP fallback
    formats: ["image/avif", "image/webp"],
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
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.sanity.io https://challenges.cloudflare.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://*.sanity.io wss://*.sanity.io https://*.ingest.sentry.io https://challenges.cloudflare.com https://api.alquran.cloud",
              "frame-src 'self' https://challenges.cloudflare.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;

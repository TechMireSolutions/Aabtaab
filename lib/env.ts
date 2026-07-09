import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().min(1, "NEXT_PUBLIC_SANITY_PROJECT_ID is required"),
  NEXT_PUBLIC_SANITY_DATASET: z.string().default("production"),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("https://aabtaab.com"),
  NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
});

const serverEnvSchema = z.object({
  SANITY_API_TOKEN: z.string().min(1, "SANITY_API_TOKEN is required"),
  SANITY_REVALIDATE_SECRET: z.string().min(1, "SANITY_REVALIDATE_SECRET is required"),
  SANITY_PREVIEW_SECRET: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
  EMAIL_TO: z.string().optional(),
  EMAIL_USER: z.string().optional(),
  EMAIL_PASS: z.string().optional(),
  UPSTASH_REDIS_REST_URL: z.string().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
});

export const isProduction = process.env.NODE_ENV === "production";
export const isBuildTime =
  process.env.CI === "true" ||
  process.env.NEXT_PHASE === "phase-production-build" ||
  process.env.NODE_ENV === "test";

const isServer = typeof window === "undefined";

const publicResult = publicEnvSchema.safeParse({
  NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
});

if (!publicResult.success) {
  if (isProduction && !isBuildTime) {
    console.error("❌ Invalid public environment variables:", publicResult.error.format());
    throw new Error("Invalid public environment variables");
  } else if (!isBuildTime) {
    console.error("❌ Invalid public environment variables:", publicResult.error.format());
  }
}

let serverData: Partial<z.infer<typeof serverEnvSchema>> = {};

if (isServer) {
  const serverResult = serverEnvSchema.safeParse({
    SANITY_API_TOKEN: process.env.SANITY_API_TOKEN,
    SANITY_REVALIDATE_SECRET: process.env.SANITY_REVALIDATE_SECRET,
    SANITY_PREVIEW_SECRET: process.env.SANITY_PREVIEW_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,
    EMAIL_TO: process.env.EMAIL_TO,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  if (!serverResult.success) {
    if (isProduction && !isBuildTime) {
      console.error("❌ Invalid server environment variables:", serverResult.error.format());
      throw new Error("Invalid server environment variables");
    } else {
      const missing = Object.keys(serverResult.error.format()).filter((k) => k !== "_errors");
      if (missing.length > 0 && !isBuildTime) {
        console.warn("⚠️ Missing or invalid optional/required server environment variables:", missing.join(", "));
      }
    }
  } else {
    serverData = serverResult.data;
  }
}

const publicData = publicResult.success ? publicResult.data : {} as Partial<z.infer<typeof publicEnvSchema>>;

export const env = {
  NEXT_PUBLIC_SANITY_PROJECT_ID: publicData.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  NEXT_PUBLIC_SANITY_DATASET: publicData.NEXT_PUBLIC_SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  NEXT_PUBLIC_SITE_URL: publicData.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://aabtaab.com",
  NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: publicData.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  NEXT_PUBLIC_SENTRY_DSN: publicData.NEXT_PUBLIC_SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
  // Server-only variables (will be undefined/unusable on the client)
  SANITY_API_TOKEN: serverData.SANITY_API_TOKEN || (isServer ? process.env.SANITY_API_TOKEN || "" : ""),
  SANITY_REVALIDATE_SECRET: serverData.SANITY_REVALIDATE_SECRET || (isServer ? process.env.SANITY_REVALIDATE_SECRET || "" : ""),
  SANITY_PREVIEW_SECRET: serverData.SANITY_PREVIEW_SECRET || (isServer ? process.env.SANITY_PREVIEW_SECRET : undefined),
  RESEND_API_KEY: serverData.RESEND_API_KEY || (isServer ? process.env.RESEND_API_KEY : undefined),
  EMAIL_FROM: serverData.EMAIL_FROM || (isServer ? process.env.EMAIL_FROM : undefined),
  EMAIL_TO: serverData.EMAIL_TO || (isServer ? process.env.EMAIL_TO : undefined),
  EMAIL_USER: serverData.EMAIL_USER || (isServer ? process.env.EMAIL_USER : undefined),
  EMAIL_PASS: serverData.EMAIL_PASS || (isServer ? process.env.EMAIL_PASS : undefined),
  UPSTASH_REDIS_REST_URL: serverData.UPSTASH_REDIS_REST_URL || (isServer ? process.env.UPSTASH_REDIS_REST_URL : undefined),
  UPSTASH_REDIS_REST_TOKEN: serverData.UPSTASH_REDIS_REST_TOKEN || (isServer ? process.env.UPSTASH_REDIS_REST_TOKEN : undefined),
} as const;

import * as Sentry from "@sentry/nextjs";
import { publicEnv } from "@/lib/env";

export async function register() {
  if (!publicEnv.NEXT_PUBLIC_SENTRY_DSN) return;

  // NEXT_RUNTIME is a Next.js platform env — keep as process.env.
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;

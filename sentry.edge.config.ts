import * as Sentry from "@sentry/nextjs";
import { isProduction, publicEnv } from "@/lib/env";

const dsn = publicEnv.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: isProduction ? "production" : "development",
    tracesSampleRate: isProduction ? 0.1 : 1.0,
    enabled: isProduction,
    ignoreErrors: ["NEXT_NOT_FOUND"],
  });
}

"use client";

import { useEffect } from "react";
import Link from "next/link";
import * as Sentry from "@sentry/nextjs";
import { publicEnv } from "@/lib/env";

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (publicEnv.NEXT_PUBLIC_SENTRY_DSN) {
      Sentry.captureException(error);
    }
  }, [error]);

  return (
    <div className="section-y flex flex-1 items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="container-narrow text-center">
        <p className="text-eyebrow mb-3">Something went wrong</p>
        <h1 className="heading-section-lg mb-3">We couldn’t load this page</h1>
        <p className="text-lead mx-auto mb-8 max-w-md">
          Please try again. If the problem continues, return home or contact us.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button type="button" onClick={reset} className="btn-primary">
            Try again
          </button>
          <Link href="/" className="btn-pill-ghost">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

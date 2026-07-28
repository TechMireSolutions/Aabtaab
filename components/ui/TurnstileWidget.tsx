"use client";

import Script from "next/script";
import { publicEnv } from "@/lib/env";

/** Reset Cloudflare Turnstile widgets after form submit. */
export function resetTurnstile(): void {
  if (typeof window === "undefined") return;
  const turnstile = (
    window as unknown as { turnstile?: { reset: () => void } }
  ).turnstile;
  turnstile?.reset();
}

/**
 * Optional Turnstile challenge widget. Renders nothing when the site key is unset.
 */
export default function TurnstileWidget() {
  const siteKey = publicEnv.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if (!siteKey) return null;

  return (
    <div className="flex justify-start py-1">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
      />
      <div
        className="cf-turnstile"
        data-sitekey={siteKey}
        data-theme="light"
      />
    </div>
  );
}

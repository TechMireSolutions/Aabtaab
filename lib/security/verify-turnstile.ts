import { env } from "@/lib/env";

const MISSING_TOKEN_ERROR =
  "Security check failed. Please refresh the page and try again.";
const VERIFY_FAILED_ERROR =
  "Security verification failed. Please try again.";

/**
 * When Turnstile is configured (`TURNSTILE_SECRET_KEY`), verify the client token.
 * Returns an error message for the client, or `undefined` when OK / skipped.
 */
export async function verifyTurnstileOrSkip(options: {
  token?: string | null;
  ip: string;
}): Promise<string | undefined> {
  const secret = env.TURNSTILE_SECRET_KEY;
  if (!secret) return undefined;

  if (!options.token) {
    return MISSING_TOKEN_ERROR;
  }

  const verifyRes = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        response: options.token,
        remoteip: options.ip,
      }),
    },
  );

  const verifyData = (await verifyRes.json()) as { success?: boolean };
  if (!verifyData.success) {
    return VERIFY_FAILED_ERROR;
  }

  return undefined;
}

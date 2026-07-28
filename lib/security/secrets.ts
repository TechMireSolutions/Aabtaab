import { timingSafeEqual } from "node:crypto";

/**
 * Constant-time string compare for webhook / preview secrets.
 * Returns false when either value is missing or lengths differ.
 */
export function secretsEqual(
  provided: string | null | undefined,
  expected: string | null | undefined,
): boolean {
  if (!provided || !expected) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

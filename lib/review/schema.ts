import { z } from "zod";

/** Shared client + API review payload (honeypot: `website`). */
export const reviewBodySchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  role: z.string().trim().max(100).optional(),
  quote: z
    .string()
    .trim()
    .min(10, "Review must be at least 10 characters")
    .max(1000),
  website: z.string().optional(),
  token: z.string().optional(),
});

export type ReviewBody = z.infer<typeof reviewBodySchema>;

export function parseReviewBody(
  data: unknown,
):
  | { success: true; data: ReviewBody }
  | { success: false; error: string } {
  const parsed = reviewBodySchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }
  if (parsed.data.website?.trim()) {
    return { success: false, error: "Invalid submission" };
  }
  return { success: true, data: parsed.data };
}

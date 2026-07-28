import { z } from "zod";

export const contactPurposeSchema = z.enum([
  "general",
  "course",
  "service",
  "other",
]);

export const contactBodySchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(100),
  lastName: z.string().trim().max(100).optional(),
  email: z.string().trim().email("Invalid email").max(254),
  phone: z.string().trim().min(5, "Phone is required").max(30),
  country: z.string().trim().min(1, "Country is required").max(100),
  city: z.string().trim().min(1, "City is required").max(100),
  purpose: contactPurposeSchema.optional().default("general"),
  appliedFor: z.string().trim().max(200).optional(),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(5000),
  website: z.string().optional(),
  token: z.string().optional(),
});

export type ContactBody = z.infer<typeof contactBodySchema>;

export function parseContactBody(
  data: unknown,
):
  | { success: true; data: ContactBody }
  | { success: false; error: string } {
  const parsed = contactBodySchema.safeParse(data);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return {
      success: false,
      error: first?.message ?? "Invalid form data",
    };
  }
  if (parsed.data.website?.trim()) {
    return { success: false, error: "Invalid submission" };
  }
  return { success: true, data: parsed.data };
}

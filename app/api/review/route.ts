import { NextResponse } from "next/server";
import { getSanityWriteClient } from "@/sanity/lib/writeClient";
import { z } from "zod";
import * as Sentry from "@sentry/nextjs";
import { env } from "@/lib/env";
import { clientIpFromRequest, checkContactRateLimit } from "@/lib/rate-limit";

const reviewSchema = z.object({
  name: z.string().trim().min(2).max(100),
  role: z.string().trim().max(100).optional(),
  quote: z.string().trim().min(10).max(1000),
  website: z.string().optional(),
  token: z.string().optional(),
});

const MAX_BODY_BYTES = 8_192;

export async function POST(req: Request) {
  try {
    const ip = clientIpFromRequest(req);
    const { allowed } = await checkContactRateLimit(`review_${ip}`);

    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    let body: unknown;
    try {
      body = JSON.parse(raw);
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    if (parsed.data.website?.trim()) {
      return NextResponse.json(
        { error: "Invalid submission" },
        { status: 400 },
      );
    }

    const turnstileSecret = env.TURNSTILE_SECRET_KEY;
    if (turnstileSecret) {
      const token = parsed.data.token;
      if (!token) {
        return NextResponse.json(
          {
            error:
              "Security check failed. Please refresh the page and try again.",
          },
          { status: 400 },
        );
      }
      const verifyRes = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            secret: turnstileSecret,
            response: token,
            remoteip: ip,
          }),
        },
      );
      const verifyData = (await verifyRes.json()) as { success?: boolean };
      if (!verifyData.success) {
        return NextResponse.json(
          { error: "Security verification failed. Please try again." },
          { status: 400 },
        );
      }
    }

    const { name, role, quote } = parsed.data;

    const doc = {
      _type: "testimonial",
      _id: `drafts.testimonial-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name,
      role,
      quote,
      status: "pending",
      order: 99,
    };

    const writeClient = getSanityWriteClient();
    await writeClient.create(doc);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Review submission error:", error);
    Sentry.captureException(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

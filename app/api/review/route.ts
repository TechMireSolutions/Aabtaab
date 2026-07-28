import { NextResponse } from "next/server";
import { getSanityWriteClient } from "@/sanity/lib/writeClient";
import * as Sentry from "@sentry/nextjs";
import { clientIpFromRequest, checkContactRateLimit } from "@/lib/rate-limit";
import { parseReviewBody } from "@/lib/review/schema";
import { verifyTurnstileOrSkip } from "@/lib/security/verify-turnstile";

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

    const parsed = parseReviewBody(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const turnstileError = await verifyTurnstileOrSkip({
      token: parsed.data.token,
      ip,
    });
    if (turnstileError) {
      return NextResponse.json({ error: turnstileError }, { status: 400 });
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

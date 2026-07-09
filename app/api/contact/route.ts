import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { CONTACT_PURPOSE_LABELS } from "@/lib/constants";
import { sendContactNotification } from "@/lib/contact/notify";
import { parseContactBody } from "@/lib/contact/schema";
import {
  checkContactRateLimit,
  clientIpFromRequest,
} from "@/lib/rate-limit";
import { getSanityWriteClient } from "@/sanity/lib/writeClient";

export async function POST(req: Request) {
  try {
    const ip = clientIpFromRequest(req);
    const { allowed } = await checkContactRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const raw = await req.json();
    const parsed = parseContactBody(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      country,
      city,
      purpose,
      appliedFor,
      message,
    } = parsed.data;

    const fullName = [firstName, lastName].filter(Boolean).join(" ");
    const purposeText =
      CONTACT_PURPOSE_LABELS[purpose] || "General Inquiry";

    await getSanityWriteClient().create({
      _type: "contactSubmission",
      firstName,
      lastName: lastName || undefined,
      email,
      phone,
      country,
      city,
      purpose,
      appliedFor: appliedFor || undefined,
      message,
      submittedAt: new Date().toISOString(),
      status: "new",
    });

    await sendContactNotification({
      subject: `New ${purposeText}${appliedFor ? ` — ${appliedFor}` : ""} from ${fullName}`,
      fields: {
        fullName,
        email,
        phone,
        country,
        city,
        purposeText,
        appliedFor: appliedFor || undefined,
        message,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    Sentry.captureException(err);
    return NextResponse.json(
      { error: "Failed to save submission" },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import { getSanityWriteClient } from "@/sanity/lib/writeClient";
import { z } from "zod";
import { clientIpFromRequest, checkContactRateLimit } from "@/lib/rate-limit";

const reviewSchema = z.object({
  name: z.string().min(2).max(100),
  role: z.string().max(100).optional(),
  quote: z.string().min(10).max(1000),
});

export async function POST(req: Request) {
  try {
    const ip = clientIpFromRequest(req);
    const { allowed } = await checkContactRateLimit(`review_${ip}`);

    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const data = reviewSchema.parse(body);

    const doc = {
      _type: "testimonial",
      _id: `drafts.testimonial-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: data.name,
      role: data.role,
      quote: data.quote,
      status: "pending",
      order: 99,
    };

    const writeClient = getSanityWriteClient();
    await writeClient.create(doc);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: (error as any).errors[0].message }, { status: 400 });
    }
    console.error("Review submission error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

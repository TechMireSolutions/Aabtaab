import { type NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { searchSite } from "@/lib/cms/search";
import {
  checkSearchRateLimit,
  clientIpFromRequest,
} from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";

  const ip = clientIpFromRequest(request);
  const { allowed } = await checkSearchRateLimit(`search_${ip}`);
  if (!allowed) {
    return NextResponse.json(
      { message: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  try {
    const results = await searchSite(q);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Search API error:", error);
    Sentry.captureException(error);
    return NextResponse.json(
      { message: "Internal server error during search" },
      { status: 500 },
    );
  }
}

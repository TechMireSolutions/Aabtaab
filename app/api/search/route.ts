import { type NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { searchSite } from "@/lib/cms/search";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";

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

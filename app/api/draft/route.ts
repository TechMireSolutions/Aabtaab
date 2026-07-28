import { env } from "@/lib/env";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";
import { previewPath } from "@/lib/paths/preview-path";
import { secretsEqual } from "@/lib/security/secrets";

const PREVIEW_SECRET = env.SANITY_PREVIEW_SECRET;

export async function GET(request: NextRequest) {
  const secret =
    request.nextUrl.searchParams.get("secret") ??
    request.headers.get("x-sanity-preview-secret");

  if (!secretsEqual(secret, PREVIEW_SECRET)) {
    return new Response("Invalid preview secret", { status: 401 });
  }

  const slug = request.nextUrl.searchParams.get("slug");
  const type = request.nextUrl.searchParams.get("type");

  const draft = await draftMode();
  draft.enable();

  redirect(previewPath(type, slug));
}

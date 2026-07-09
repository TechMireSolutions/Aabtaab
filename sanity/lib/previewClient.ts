import { createClient } from "next-sanity";
import { env } from "@/lib/env";
import { SANITY_API_VERSION } from "./constants";

/** Uncached client for draft/preview content (requires SANITY_API_TOKEN). */
export function getPreviewClient() {
  if (!env.SANITY_API_TOKEN) {
    throw new Error("Preview requires NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN");
  }

  return createClient({
    projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: SANITY_API_VERSION,
    useCdn: false,
    token: env.SANITY_API_TOKEN,
    perspective: "previewDrafts",
    stega: {
      enabled: false,
      studioUrl: "/studio",
    },
  });
}

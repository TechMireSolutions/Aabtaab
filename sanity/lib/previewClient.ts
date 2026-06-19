import { createClient } from "next-sanity";
import { SANITY_API_VERSION } from "./constants";

/** Uncached client for draft/preview content (requires SANITY_API_TOKEN). */
export function getPreviewClient() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const token = process.env.SANITY_API_TOKEN;

  if (!projectId || !token) {
    throw new Error("Preview requires NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN");
  }

  return createClient({
    projectId,
    dataset,
    apiVersion: SANITY_API_VERSION,
    useCdn: false,
    token,
    perspective: "previewDrafts",
    stega: {
      enabled: false,
      studioUrl: "/studio",
    },
  });
}

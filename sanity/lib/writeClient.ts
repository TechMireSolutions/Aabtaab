import { createClient } from "@sanity/client";
import { env } from "@/lib/env";
import { SANITY_API_VERSION } from "./constants";

export function getSanityWriteClient() {
  if (!env.SANITY_API_TOKEN) {
    throw new Error("Sanity write credentials are not configured");
  }

  return createClient({
    projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: env.NEXT_PUBLIC_SANITY_DATASET,
    token: env.SANITY_API_TOKEN,
    apiVersion: SANITY_API_VERSION,
    useCdn: false,
  });
}

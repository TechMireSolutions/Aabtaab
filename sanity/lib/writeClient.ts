import { createClient } from "@sanity/client";
import { SANITY_API_VERSION } from "./constants";

export function getSanityWriteClient() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const token = process.env.SANITY_API_TOKEN;

  if (!projectId || !dataset || !token) {
    throw new Error("Sanity write credentials are not configured");
  }

  return createClient({
    projectId,
    dataset,
    token,
    apiVersion: SANITY_API_VERSION,
    useCdn: false,
  });
}

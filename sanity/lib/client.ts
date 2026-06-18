import { createClient, type SanityClient } from "next-sanity";
import { SANITY_API_VERSION } from "./constants";

function createSanityClient(): SanityClient {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

  if (!projectId) {
    throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID environment variable");
  }

  return createClient({
    projectId,
    dataset,
    apiVersion: SANITY_API_VERSION,
    useCdn: process.env.NODE_ENV === "production",
  });
}

let clientInstance: SanityClient | undefined;

export function getSanityClient(): SanityClient {
  if (!clientInstance) {
    clientInstance = createSanityClient();
  }
  return clientInstance;
}

// Lazy proxy so importing this module does not throw during build setup.
export const client: SanityClient = new Proxy({} as SanityClient, {
  get(_target, prop, receiver) {
    const value = Reflect.get(getSanityClient(), prop, receiver);
    return typeof value === "function" ? value.bind(getSanityClient()) : value;
  },
});

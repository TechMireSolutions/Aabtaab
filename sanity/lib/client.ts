import { createClient, type SanityClient } from "next-sanity";
import { env, isProduction } from "@/lib/env";
import { SANITY_API_VERSION } from "./constants";

function createSanityClient(): SanityClient {
  return createClient({
    projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder",
    dataset: env.NEXT_PUBLIC_SANITY_DATASET || "production",
    apiVersion: SANITY_API_VERSION,
    useCdn: false, // Next.js App Router unstable_cache handles all caching
    maxRetries: 5,
    fetch: (async (url: string | URL | globalThis.Request, init?: globalThis.RequestInit) => {
      // Force connection close to bypass undici UND_ERR_SOCKET bug on Windows/GCP
      return fetch(url, {
        ...init,
        keepalive: false,
        headers: {
          ...init?.headers,
          Connection: "close",
        },
      });
    }) as any,
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

import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockCreateClient, mockNextSanityCreateClient, mockEnv } = vi.hoisted(() => ({
  mockCreateClient: vi.fn((config) => ({ ...config, kind: "sanity-client" })),
  mockNextSanityCreateClient: vi.fn((config) => ({ ...config, kind: "next-sanity-preview" })),
  mockEnv: {
    NEXT_PUBLIC_SANITY_PROJECT_ID: "proj_123",
    NEXT_PUBLIC_SANITY_DATASET: "production",
    SANITY_API_TOKEN: "token_abc",
  },
}));

vi.mock("@sanity/client", () => ({
  createClient: mockCreateClient,
}));

vi.mock("next-sanity", () => ({
  createClient: mockNextSanityCreateClient,
}));

vi.mock("@/lib/env", () => ({
  env: mockEnv,
}));

import { getSanityWriteClient } from "./writeClient";
import { getPreviewClient } from "./previewClient";

describe("Sanity client factories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockEnv.NEXT_PUBLIC_SANITY_PROJECT_ID = "proj_123";
    mockEnv.NEXT_PUBLIC_SANITY_DATASET = "production";
    mockEnv.SANITY_API_TOKEN = "token_abc";
  });

  describe("getSanityWriteClient", () => {
    it("throws an error when SANITY_API_TOKEN is missing", () => {
      mockEnv.SANITY_API_TOKEN = "";
      expect(() => getSanityWriteClient()).toThrow("Sanity write credentials are not configured");
    });

    it("creates an uncached client with project ID, dataset, and token", () => {
      const client = getSanityWriteClient();
      expect(mockCreateClient).toHaveBeenCalledWith(
        expect.objectContaining({
          projectId: "proj_123",
          dataset: "production",
          token: "token_abc",
          useCdn: false,
        }),
      );
      expect(client).toBeDefined();
    });
  });

  describe("getPreviewClient", () => {
    it("throws an error when SANITY_API_TOKEN is missing", () => {
      mockEnv.SANITY_API_TOKEN = "";
      expect(() => getPreviewClient()).toThrow("Preview requires NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN");
    });

    it("creates a preview client with previewDrafts perspective", () => {
      const client = getPreviewClient();
      expect(mockNextSanityCreateClient).toHaveBeenCalledWith(
        expect.objectContaining({
          projectId: "proj_123",
          dataset: "production",
          token: "token_abc",
          perspective: "previewDrafts",
          useCdn: false,
        }),
      );
      expect(client).toBeDefined();
    });
  });
});


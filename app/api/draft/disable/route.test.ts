import { describe, expect, it, vi } from "vitest";

const { mockDraftDisable, mockRedirect } = vi.hoisted(() => ({
  mockDraftDisable: vi.fn(),
  mockRedirect: vi.fn((path: string) => {
    throw new Error(`REDIRECT:${path}`);
  }),
}));

vi.mock("next/headers", () => ({
  draftMode: async () => ({
    disable: mockDraftDisable,
  }),
}));

vi.mock("next/navigation", () => ({
  redirect: mockRedirect,
}));

import { GET } from "./route";

describe("GET /api/draft/disable", () => {
  it("disables draft mode and redirects to homepage", async () => {
    await expect(GET()).rejects.toThrow("REDIRECT:/");
    expect(mockDraftDisable).toHaveBeenCalled();
    expect(mockRedirect).toHaveBeenCalledWith("/");
  });
});


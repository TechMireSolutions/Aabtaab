import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  permanentRedirect: vi.fn((path: string) => {
    throw new Error(`REDIRECT:${path}`);
  }),
}));

import {
  buildNestedCatalogPageContext,
  ensureCanonicalNestedPath,
  nestedStaticParamsFromEntries,
  resolveCurrentSlug,
} from "@/lib/catalog/nested-page";
import { permanentRedirect } from "next/navigation";

describe("nestedStaticParamsFromEntries", () => {
  it("splits nested paths into slug arrays", () => {
    expect(
      nestedStaticParamsFromEntries("online-courses", [
        { slug: "fiqh", parent: null },
        {
          slug: "beginner",
          parent: { slug: "fiqh", parent: null },
        },
      ]),
    ).toEqual([
      { slug: ["fiqh"] },
      { slug: ["fiqh", "beginner"] },
    ]);
  });
});

describe("resolveCurrentSlug", () => {
  it("returns the leaf segment", () => {
    expect(resolveCurrentSlug(["a", "b", "c"])).toBe("c");
  });
});

describe("buildNestedCatalogPageContext", () => {
  it("builds path, ancestry, and breadcrumbs", () => {
    const ctx = buildNestedCatalogPageContext(
      { segment: "services", label: "Services", eyebrow: "Services" },
      ["niyabat", "ziarat"],
      {
        title: "Ziarat",
        slug: { current: "ziarat" },
        children: [{ _id: "1" }],
        parent: { title: "Niyabat", slug: "niyabat" },
      },
      null,
    );

    expect(ctx.currentPath).toBe("/services/niyabat/ziarat");
    expect(ctx.hasChildren).toBe(true);
    expect(ctx.ancestry).toHaveLength(1);
    expect(ctx.breadcrumbItems.at(-1)?.name).toBe("Ziarat");
    expect(ctx.whatsappHref).toBe("/contact");
  });
});

describe("ensureCanonicalNestedPath", () => {
  it("redirects when URL ancestry is wrong", () => {
    expect(() =>
      ensureCanonicalNestedPath(
        { segment: "online-courses", label: "Online Courses", eyebrow: "Courses" },
        {
          slug: { current: "beginner" },
          parent: { slug: "fiqh", parent: null },
        },
        "/online-courses/beginner",
      ),
    ).toThrow("REDIRECT:/online-courses/fiqh/beginner");
    expect(permanentRedirect).toHaveBeenCalledWith(
      "/online-courses/fiqh/beginner",
    );
  });

  it("does nothing when path is already canonical", () => {
    vi.mocked(permanentRedirect).mockClear();
    ensureCanonicalNestedPath(
      { segment: "online-courses", label: "Online Courses", eyebrow: "Courses" },
      {
        slug: { current: "beginner" },
        parent: { slug: "fiqh", parent: null },
      },
      "/online-courses/fiqh/beginner",
    );
    expect(permanentRedirect).not.toHaveBeenCalled();
  });
});

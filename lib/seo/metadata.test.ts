import { describe, expect, it } from "vitest";
import {
  absoluteUrl,
  buildPageMetadata,
  getDefaultOgImageUrl,
  getSiteUrl,
} from "@/lib/seo/metadata";

describe("seo metadata helpers", () => {
  it("strips trailing slash from site URL", () => {
    expect(getSiteUrl()).not.toMatch(/\/$/);
  });

  it("builds absolute URLs", () => {
    const site = getSiteUrl();
    expect(absoluteUrl("/")).toBe(`${site}/`);
    expect(absoluteUrl("/about")).toBe(`${site}/about`);
    expect(absoluteUrl("posts")).toBe(`${site}/posts`);
  });

  it("points default OG image at /og-default.png", () => {
    expect(getDefaultOgImageUrl()).toBe(`${getSiteUrl()}/og-default.png`);
  });

  it("builds indexable page metadata with canonical and OG", () => {
    const meta = buildPageMetadata({
      title: "About",
      description: "About us",
      path: "/about",
    });

    expect(meta.title).toBe("About");
    expect(meta.description).toBe("About us");
    expect(meta.alternates?.canonical).toBe(`${getSiteUrl()}/about`);
    expect(meta.robots).toMatchObject({ index: true, follow: true });
    expect(meta.openGraph?.url).toBe(`${getSiteUrl()}/about`);
    expect(meta.twitter?.card).toBe("summary_large_image");
  });

  it("sets noindex robots when requested", () => {
    const meta = buildPageMetadata({
      title: "Search",
      path: "/search",
      noIndex: true,
    });

    expect(meta.robots).toMatchObject({ index: false, follow: true });
  });

  it("uses absolute title when requested", () => {
    const meta = buildPageMetadata({
      title: "Aabtaab",
      path: "/",
      absoluteTitle: true,
    });

    expect(meta.title).toEqual({ absolute: "Aabtaab" });
  });
});

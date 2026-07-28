import { describe, expect, it, vi, beforeEach } from "vitest";
import { revalidateSlugCollection } from "@/lib/revalidate";
import { CACHE_TAGS } from "@/sanity/lib/fetch";

vi.mock("next/cache", () => ({
  revalidateTag: vi.fn(),
}));

import { revalidateTag } from "next/cache";

describe("revalidateSlugCollection", () => {
  beforeEach(() => {
    vi.mocked(revalidateTag).mockClear();
  });

  it("revalidates collection and slug tags", () => {
    const revalidated: string[] = [];

    revalidateSlugCollection(
      revalidated,
      CACHE_TAGS.posts,
      CACHE_TAGS.post,
      "my-post",
    );

    expect(revalidateTag).toHaveBeenCalledTimes(2);
    expect(revalidated).toEqual([CACHE_TAGS.posts, CACHE_TAGS.post("my-post")]);
  });

  it("revalidates collection only when slug missing", () => {
    const revalidated: string[] = [];

    revalidateSlugCollection(revalidated, CACHE_TAGS.events, CACHE_TAGS.event);

    expect(revalidateTag).toHaveBeenCalledTimes(1);
    expect(revalidated).toEqual([CACHE_TAGS.events]);
  });

  it("passes expire:0 options to revalidateTag", () => {
    revalidateSlugCollection([], CACHE_TAGS.posts, CACHE_TAGS.post, "slug");

    expect(revalidateTag).toHaveBeenCalledWith(CACHE_TAGS.posts, {
      expire: 0,
    });
    expect(revalidateTag).toHaveBeenCalledWith(CACHE_TAGS.post("slug"), {
      expire: 0,
    });
  });
});

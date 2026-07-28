import { describe, expect, it } from "vitest";
import { filterNavForEmptyCatalogs } from "@/lib/fallbacks/footer-nav";

describe("filterNavForEmptyCatalogs", () => {
  const items = [
    { label: "Home", href: "/" },
    { label: "Scholars", href: "/scholars" },
    { label: "Events", href: "/events" },
    { label: "Articles", href: "/posts" },
    { label: "Reviews", href: "/reviews" },
  ];

  it("hides empty catalog links and keeps others", () => {
    expect(
      filterNavForEmptyCatalogs(items, {
        scholars: 0,
        events: 0,
        posts: 2,
      }).map((i) => i.href),
    ).toEqual(["/", "/posts", "/reviews"]);
  });

  it("keeps catalog links when counts are positive", () => {
    expect(
      filterNavForEmptyCatalogs(items, {
        scholars: 3,
        events: 1,
        posts: 1,
      }).map((i) => i.href),
    ).toEqual(["/", "/scholars", "/events", "/posts", "/reviews"]);
  });
});

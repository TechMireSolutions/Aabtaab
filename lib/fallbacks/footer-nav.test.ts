import { describe, expect, it } from "vitest";
import { filterNavForEmptyCatalogs } from "@/lib/fallbacks/footer-nav";

describe("filterNavForEmptyCatalogs", () => {
  const items = [
    { label: "Home", href: "/" },
    { label: "Scholars", href: "/scholars" },
    { label: "Events", href: "/events" },
    { label: "Articles", href: "/posts" },
    { label: "Articles alias", href: "/articles" },
    { label: "Courses", href: "/online-courses" },
    { label: "Services", href: "/services" },
    { label: "Reviews", href: "/reviews" },
  ];

  it("hides empty catalog links and keeps others", () => {
    expect(
      filterNavForEmptyCatalogs(items, {
        scholars: 0,
        events: 0,
        posts: 2,
        courses: 3,
        services: 1,
      }).map((i) => i.href),
    ).toEqual(["/", "/posts", "/articles", "/online-courses", "/services", "/reviews"]);
  });

  it("hides /articles when posts count is zero", () => {
    expect(
      filterNavForEmptyCatalogs(items, {
        scholars: 0,
        events: 0,
        posts: 0,
        courses: 0,
        services: 0,
      }).map((i) => i.href),
    ).toEqual(["/", "/reviews"]);
  });

  it("keeps catalog links when counts are positive", () => {
    expect(
      filterNavForEmptyCatalogs(items, {
        scholars: 3,
        events: 1,
        posts: 1,
        courses: 2,
        services: 4,
      }).map((i) => i.href),
    ).toEqual([
      "/",
      "/scholars",
      "/events",
      "/posts",
      "/articles",
      "/online-courses",
      "/services",
      "/reviews",
    ]);
  });

  it("fails open when counts are unknown", () => {
    expect(
      filterNavForEmptyCatalogs(items, {
        scholars: null,
        events: null,
        posts: null,
        courses: null,
        services: null,
      }).map((i) => i.href),
    ).toEqual([
      "/",
      "/scholars",
      "/events",
      "/posts",
      "/articles",
      "/online-courses",
      "/services",
      "/reviews",
    ]);
  });
});

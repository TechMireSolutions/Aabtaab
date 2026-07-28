import { describe, expect, it } from "vitest";
import { isHomeNavItem, withoutHomeNavItems } from "@/lib/fallbacks/nav";

describe("withoutHomeNavItems", () => {
  it("removes home by label or root href", () => {
    expect(
      withoutHomeNavItems([
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        { label: "Root", href: "/?ref=nav" },
        { label: "HOME", href: "/posts" },
      ]).map((i) => i.label),
    ).toEqual(["About"]);
  });

  it("keeps non-home items", () => {
    expect(isHomeNavItem({ label: "Services", href: "/services" })).toBe(
      false,
    );
  });
});

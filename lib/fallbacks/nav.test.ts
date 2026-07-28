import { describe, expect, it } from "vitest";
import {
  buildHeaderNavLinks,
  isHomeNavItem,
  withoutHomeNavItems,
} from "@/lib/fallbacks/nav";

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

describe("buildHeaderNavLinks", () => {
  it("uses fallback nav and drops Home", () => {
    const links = buildHeaderNavLinks(undefined);
    expect(links.some((l) => isHomeNavItem(l))).toBe(false);
    expect(links.some((l) => /dar\s*ul\s*quran/i.test(l.label))).toBe(true);
  });

  it("overrides Dar Ul Quran href when external URL is set", () => {
    const links = buildHeaderNavLinks(
      [{ label: "Dar ul Quran", href: "/dar-ul-quran" }],
      "https://example.com/quran",
    );
    const dar = links.find((l) => /dar\s*ul\s*quran/i.test(l.label));
    expect(dar?.href).toBe("https://example.com/quran");
    expect(dar?.external).toBe(true);
  });

  it("appends Dar Ul Quran when missing from CMS nav", () => {
    const links = buildHeaderNavLinks([{ label: "About", href: "/about" }]);
    expect(links.map((l) => l.label)).toContain("Dar ul Quran");
  });
});

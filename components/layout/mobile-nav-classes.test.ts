import { describe, expect, it } from "vitest";
import {
  TW_MOBILE_CLOSE_BTN,
  TW_MOBILE_HEADER,
  TW_MOBILE_MENU_TRIGGER,
  TW_MOBILE_NAV_ROW,
  TW_MOBILE_NAV_ROW_ACTIVE,
  TW_MOBILE_NAV_SCROLL,
} from "@/components/layout/mobile-nav-classes";

describe("mobile navigation drawer utility classes", () => {
  it("defines accessible touch target sizes on interactive elements", () => {
    // WCAG touch target guideline: min 44px (size-11 in Tailwind = 2.75rem = 44px)
    expect(TW_MOBILE_NAV_ROW).toContain("min-h-11");
    expect(TW_MOBILE_CLOSE_BTN).toContain("size-11");
    expect(TW_MOBILE_MENU_TRIGGER).toContain("size-11");
  });

  it("includes focus-visible rings for keyboard accessibility", () => {
    expect(TW_MOBILE_NAV_ROW).toContain("focus-visible:");
    expect(TW_MOBILE_CLOSE_BTN).toContain("focus-visible:ring-");
    expect(TW_MOBILE_MENU_TRIGGER).toContain("focus-visible:ring-");
  });

  it("handles safe areas on modern mobile devices", () => {
    expect(TW_MOBILE_HEADER).toContain("safe-area-inset-top");
    expect(TW_MOBILE_NAV_SCROLL).toContain("safe-area-inset-bottom");
  });

  it("defines active row visual indicator", () => {
    expect(TW_MOBILE_NAV_ROW_ACTIVE).toContain("border-s-2");
    expect(TW_MOBILE_NAV_ROW_ACTIVE).toContain("bg-brand-50");
  });
});


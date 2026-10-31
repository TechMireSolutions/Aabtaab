import { describe, expect, it } from "vitest";
import { ABOUT_PILLARS, ABOUT_PILLAR_ICONS, aboutIntro } from "@/lib/fallbacks/about";
import { COMMON_SURAHS, SHIA_INSIGHTS } from "@/lib/fallbacks/dar-ul-quran";
import { DEFAULT_DONATE_CAUSES } from "@/lib/fallbacks/donate";
import { FALLBACK_QUOTES } from "@/lib/fallbacks/quotes";

describe("about fallbacks", () => {
  it("provides aboutIntro text with customized or default site name", () => {
    const defaultIntro = aboutIntro();
    expect(defaultIntro.siteName).toBe("Aabtaab");
    expect(defaultIntro.leadAfterName).toContain("dedicated platform for the promotion");
    expect(defaultIntro.darUlQuranBefore).toContain("Dar Ul Quran");

    const customIntro = aboutIntro("Custom Brand");
    expect(customIntro.siteName).toBe("Custom Brand");
  });

  it("maps every about pillar to a valid Lucide icon", () => {
    expect(ABOUT_PILLARS.length).toBe(3);

    for (const pillar of ABOUT_PILLARS) {
      expect(pillar.title).toBeTruthy();
      expect(pillar.description).toBeTruthy();
      const Icon = ABOUT_PILLAR_ICONS[pillar.icon];
      expect(Icon).toBeDefined();
    }
  });
});

describe("dar-ul-quran fallbacks", () => {
  it("defines authentic Shia insights with title, text, and references", () => {
    expect(SHIA_INSIGHTS.length).toBeGreaterThan(0);

    for (const insight of SHIA_INSIGHTS) {
      expect(["Tafsir", "Hadith"]).toContain(insight.type);
      expect(insight.title).toBeTruthy();
      expect(insight.source).toBeTruthy();
      expect(insight.text).toBeTruthy();
      expect(insight.reference).toBeTruthy();
    }
  });

  it("lists common surahs with valid numbers and names", () => {
    expect(COMMON_SURAHS.length).toBe(6);

    for (const surah of COMMON_SURAHS) {
      expect(surah.number).toBeGreaterThan(0);
      expect(surah.number).toBeLessThanOrEqual(114);
      expect(surah.name).toBeTruthy();
      expect(surah.englishName).toBeTruthy();
      expect(surah.numberOfAyahs).toBeGreaterThan(0);
    }
  });
});

describe("donate causes fallback", () => {
  it("contains default donation causes with title and description", () => {
    expect(DEFAULT_DONATE_CAUSES.length).toBeGreaterThanOrEqual(3);

    for (const cause of DEFAULT_DONATE_CAUSES) {
      expect(cause.title).toBeTruthy();
      expect(cause.description).toBeTruthy();
    }
  });
});

describe("quotes fallback", () => {
  it("contains authentic fallback quotes with Arabic, translation, and attribution", () => {
    expect(FALLBACK_QUOTES.length).toBeGreaterThanOrEqual(3);

    for (const quote of FALLBACK_QUOTES) {
      expect(quote.arabic).toBeTruthy();
      expect(quote.translation).toBeTruthy();
      expect(quote.attribution).toBeTruthy();
      expect(quote.reference).toBeTruthy();
    }
  });
});


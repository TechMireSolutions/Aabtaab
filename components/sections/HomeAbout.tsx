"use client";

import { useState, useTransition, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, RefreshCw } from "lucide-react";
import type { HomepageSettings } from "@/types/homepage";

interface HomeAboutProps {
  homepage: HomepageSettings | null;
}

interface HadithItem {
  arabic: string;
  translation: string;
  attribution: string;
}

const STATIC_HADITHS: HadithItem[] = [
  {
    arabic: "إِنَّ الْقَلْبَ الْحَدَثَ كَالأَرْضِ الْخَالِيَةِ مَا أُلْقِيَ فِيهَا مِنْ شَيْءٍ قَبِلَتْهُ",
    translation: "Indeed, the heart of a youth is like uncultivated land; whatever is sown in it, it accepts.",
    attribution: "Imam Ali (A.S.) — Nahjul Balagha",
  },
  {
    arabic: "طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ، أَلَا إِنَّ اللَّهَ يُحِبُّ بُغَاةَ الْعِلْمِ",
    translation: "The acquisition of knowledge is a duty upon every Muslim; indeed Allah loves the seekers of knowledge.",
    attribution: "Imam Ja'far al-Sadiq (A.S.)",
  },
  {
    arabic: "الْعِلْمُ كَنْزٌ عَظِيمٌ لَا يَفْنَى",
    translation: "Knowledge is a grand treasure that is never exhausted.",
    attribution: "Imam Ali (A.S.)",
  },
  {
    arabic: "مَنْ عَمِلَ عَلَى غَيْرِ عِلْمٍ كَانَ مَا يُفْسِدُ أَكْثَرَ مِمَّا يُصْلِحُ",
    translation: "If a person acts without knowledge, what they spoil is more than what they rectify.",
    attribution: "Imam Ja'far al-Sadiq (A.S.)",
  },
];

export default function HomeAbout({ homepage: hp }: HomeAboutProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [, startTransition] = useTransition();

  const hadithList = useMemo(() => {
    const initialHadith: HadithItem = {
      arabic: hp?.aboutHadithArabic || "اُطْلُبُوا الْعِلْمَ مِنَ الْمَهْدِ إِلَى اللَّحْدِ",
      translation: hp?.aboutHadithTranslation || "Seek knowledge from the cradle to the grave.",
      attribution: hp?.aboutHadithAttribution || "Prophet Muhammad (S.A.W.W.)",
    };
    return [initialHadith, ...STATIC_HADITHS];
  }, [hp]);

  const [prevListLength, setPrevListLength] = useState(hadithList.length);
  if (hadithList.length !== prevListLength) {
    setPrevListLength(hadithList.length);
    setCurrentIndex(0);
  }

  function handleNextHadith() {
    setFade(false);
    setTimeout(() => {
      startTransition(() => {
        setCurrentIndex((prev) => (prev + 1) % hadithList.length);
        setFade(true);
      });
    }, 250);
  }

  const activeHadith = hadithList[currentIndex] || {
    arabic: hp?.aboutHadithArabic || "اُطْلُبُوا الْعِلْمَ مِنَ الْمَهْدِ إِلَى اللَّحْدِ",
    translation: hp?.aboutHadithTranslation || "Seek knowledge from the cradle to the grave.",
    attribution: hp?.aboutHadithAttribution || "Prophet Muhammad (S.A.W.W.)",
  };

  return (
    <section className="relative section-y-xl overflow-hidden border-b border-gray-100 dark:border-slate-900 bg-white dark:bg-slate-950">
      <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-30 dark:opacity-10" />
      <div className="container-page relative">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="text-eyebrow mb-3 flex items-center gap-2">
              <span className="eyebrow-line" aria-hidden="true" />
              {hp?.aboutEyebrow || "Who We Are"}
            </p>
            <h2 className="heading-section-lg mb-4">
              {hp?.aboutHeading ||
                "Bringing Shia Islamic Knowledge to Every Corner of the World"}
            </h2>
            <p className="text-body-muted mb-4">
              {hp?.aboutBody1 ||
                "Aabtaab was founded with a single purpose — to make authentic Shia Islamic education and religious services accessible to every Muslim, regardless of location or background."}
            </p>
            <p className="text-body-muted mb-7">
              {hp?.aboutBody2 ||
                "Through online courses taught by qualified scholars, and services like Niyabat Ziarat and Ijara performed with sincerity, we proudly serve thousands of families across the globe."}
            </p>
            <div className="mb-8 flex flex-wrap gap-2.5">
              {(hp?.aboutPillars?.length
                ? hp.aboutPillars
                : ["Faith", "Knowledge", "Access", "Sincerity"]
              ).map((pillar: string) => (
                <span
                  key={pillar}
                  className="badge-pill inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm-plus font-semibold normal-case tracking-normal"
                >
                  <span className="size-1.5 shrink-0 rounded-full bg-brand-500" />
                  {pillar}
                </span>
              ))}
            </div>
            <Link href="/about" className="btn-primary group">
              {hp?.aboutCtaLabel || "Learn About Us"}
              <ArrowRight
                size={14}
                strokeWidth={2.5}
                className="transition-transform duration-150 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <div className="relative pb-10">
            <div className="relative overflow-hidden rounded-3xl bg-slate-900 dark:bg-slate-900/50 p-8 text-white sm:p-10 min-h-[300px] flex flex-col justify-between shadow-xl">
              <div className="bg-hero-glow pointer-events-none absolute top-0 right-0 size-72 hero-glow-offset rounded-full opacity-60" />
              
              <div className="relative z-10 flex justify-end mb-2">
                {hadithList.length > 1 && (
                  <button
                    onClick={handleNextHadith}
                    aria-label="Load next Hadith"
                    className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-400 hover:text-gold-400 hover:border-gold-500/20 transition-all cursor-pointer"
                  >
                    <RefreshCw size={14} className="animate-hover-spin" />
                  </button>
                )}
              </div>

              <div
                className={`relative z-10 flex-1 flex flex-col justify-center transition-all duration-300 ${
                  fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                }`}
              >
                <p
                  className="mb-4 text-center text-xl-plus leading-loose font-arabic text-gold-400 select-all"
                  dir="rtl"
                  lang="ar"
                >
                  {activeHadith.arabic}
                </p>
                <div className="eyebrow-line-gold mx-auto mb-4 w-10" aria-hidden="true" />
                <p className="text-center text-sm-plus leading-relaxed italic text-slate-300 select-all px-4">
                  &quot;{activeHadith.translation}&quot;
                </p>
                <p className="text-caption mt-3.5 text-center font-semibold tracking-wide text-gold-500">
                  — {activeHadith.attribution}
                </p>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/10 pt-6 relative z-10">
                {[
                  {
                    value: hp?.aboutStat1Value || "500+",
                    label: hp?.aboutStat1Label || "Students",
                  },
                  {
                    value: hp?.aboutStat2Value || "10+",
                    label: hp?.aboutStat2Label || "Scholars",
                  },
                  {
                    value: hp?.aboutStat3Value || "5+",
                    label: hp?.aboutStat3Label || "Countries",
                  },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="text-xl-plus leading-none font-bold text-white">
                      {s.value}
                    </p>
                    <p className="text-caption mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-surface absolute bottom-0 left-6 flex items-center gap-3 px-4 py-3 shadow-md">
              <div className="badge-trust">✓</div>
              <div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {hp?.aboutBadgeText || "Qualified Scholars"}
                </p>
                <p className="text-caption">
                  {hp?.aboutBadgeSubtext || "Certified & trusted"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

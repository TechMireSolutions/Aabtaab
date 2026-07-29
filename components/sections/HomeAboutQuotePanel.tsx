"use client";

import { useState, useTransition } from "react";
import { RefreshCw } from "lucide-react";
import type { HomepageSettings } from "@/types/homepage";
import type { QuoteItem } from "@/types/quote";

interface HomeAboutQuotePanelProps {
  homepage: HomepageSettings | null;
  /** Resolved quote list (caller applies FALLBACK_QUOTES when CMS is empty). */
  quotes: QuoteItem[];
  scholarCount?: number;
  countryCount?: number;
}

export default function HomeAboutQuotePanel({
  homepage: hp,
  quotes,
  scholarCount,
  countryCount,
}: HomeAboutQuotePanelProps) {
  const hadithList = quotes;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [, startTransition] = useTransition();

  const [prevListLength, setPrevListLength] = useState(hadithList.length);
  if (hadithList.length !== prevListLength) {
    setPrevListLength(hadithList.length);
    setCurrentIndex(0);
  }

  if (hadithList.length === 0) return null;

  function handleNextHadith() {
    setFade(false);
    setTimeout(() => {
      startTransition(() => {
        setCurrentIndex((prev) => (prev + 1) % hadithList.length);
        setFade(true);
      });
    }, 250);
  }

  const activeHadith = hadithList[currentIndex] ?? hadithList[0];

  return (
    <div className="relative pb-10">
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 dark:bg-slate-900/50 p-8 text-white sm:p-10 min-h-[300px] flex flex-col justify-between shadow-card">
        <div className="bg-hero-glow pointer-events-none absolute top-0 right-0 size-72 hero-glow-offset rounded-full opacity-60" />

        <div className="relative z-10 flex justify-end mb-2">
          {hadithList.length > 1 && (
            <button
              type="button"
              onClick={handleNextHadith}
              aria-label="Load next Hadith"
              className="flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition-all hover:border-gold-500/20 hover:text-gold-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400 cursor-pointer"
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
          <p className="text-caption mt-3.5 text-center font-semibold tracking-wide text-gold-500 flex flex-col items-center gap-1">
            <span>— {activeHadith.attribution}</span>
            {activeHadith.reference && (
              <span className="text-xs font-normal text-slate-400">
                [{activeHadith.reference}]
              </span>
            )}
          </p>
        </div>

        <div
          className={`mt-8 grid gap-4 border-t border-white/10 pt-6 relative z-10 ${
            scholarCount && scholarCount > 0 ? "grid-cols-3" : "grid-cols-2"
          }`}
        >
          {(
            [
              {
                value: hp?.aboutStat1Value || "500+",
                label: hp?.aboutStat1Label || "Students",
              },
              scholarCount && scholarCount > 0
                ? {
                    value: `${scholarCount}+`,
                    label: hp?.aboutStat2Label || "Scholars",
                  }
                : null,
              {
                value:
                  countryCount && countryCount > 0
                    ? `${countryCount}+`
                    : hp?.aboutStat3Value || "5+",
                label: hp?.aboutStat3Label || "Countries",
              },
            ] as Array<{ value: string; label: string } | null>
          )
            .filter(
              (stat): stat is { value: string; label: string } => stat != null,
            )
            .map((stat) => (
              <div key={stat.label} className="text-center group">
                <div className="text-xl-plus font-bold text-white group-hover:text-gold-400 transition-colors">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="card-surface absolute bottom-0 left-6 flex items-center gap-3 px-4 py-3">
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
  );
}

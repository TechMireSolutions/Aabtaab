import Link from "next/link";
import { ArrowRight } from "lucide-react";
import HomeAboutQuotePanel from "@/components/sections/HomeAboutQuotePanel";
import { FALLBACK_QUOTES } from "@/lib/fallbacks/quotes";
import type { HomepageSettings } from "@/types/homepage";
import type { QuoteItem } from "@/types/quote";

interface HomeAboutProps {
  homepage: HomepageSettings | null;
  quotes?: QuoteItem[] | null;
  scholarCount?: number;
  countryCount?: number;
}

export default function HomeAbout({
  homepage: hp,
  quotes = [],
  scholarCount,
  countryCount,
}: HomeAboutProps) {
  const quoteList = quotes && quotes.length > 0 ? quotes : FALLBACK_QUOTES;

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

          <HomeAboutQuotePanel
            homepage={hp}
            quotes={quoteList}
            scholarCount={scholarCount}
            countryCount={countryCount}
          />
        </div>
      </div>
    </section>
  );
}

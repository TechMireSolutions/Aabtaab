import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { HomepageSettings } from "@/types/homepage";

interface HomeDonateCtaProps {
  homepage: HomepageSettings | null;
}

export default function HomeDonateCta({ homepage: hp }: HomeDonateCtaProps) {
  return (
    <section className="section-deferred relative overflow-hidden border-y border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 py-10 sm:py-12">
      <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="container-content relative max-w-copy text-center">
        <div className="text-eyebrow-gold mb-4 inline-flex items-center gap-2.5">
          <span className="eyebrow-line-gold w-6" />
          <span lang="ar" dir="rtl" className="font-arabic">
            فِي سَبِيلِ اللَّهِ
          </span>
          <span className="eyebrow-line-gold w-6" />
        </div>
        <h2 className="heading-section-lg mb-3">
          {hp?.donateHeading || "Support Our Mission"}
        </h2>
        <p className="text-body-muted mx-auto mb-6 max-w-sm">
          {hp?.donateText ||
            "Your Sadqah and donations help us continue spreading the teachings of Ahlul Bayt (A.S.)"}
        </p>
        <div className="card-quote">
          <div className="absolute -top-3.5 left-1/2 flex size-7 -translate-x-1/2 items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <span className="text-base-plus leading-none font-bold text-gold-500">
              &ldquo;
            </span>
          </div>
          <p className="text-body-muted italic text-slate-600 dark:text-slate-300">
            {hp?.donateQuote ||
              "Sadaqah extinguishes the Lord's anger and wards off an evil death."}
          </p>
          <div className="mt-3 flex flex-col items-center justify-center gap-1">
            <div className="flex items-center gap-2">
              <span className="eyebrow-line-gold w-5" />
              <cite className="text-caption font-semibold tracking-wide text-gold-600 not-italic">
                {hp?.donateQuoteAttribution || "Imam Sadiq (A.S.)"}
              </cite>
              <span className="eyebrow-line-gold w-5" />
            </div>
            {hp?.donateQuoteReference && (
              <span className="text-xs text-slate-500 dark:text-slate-400 opacity-80">
                {hp.donateQuoteReference}
              </span>
            )}
          </div>
        </div>
        <Link href="/donate" className="btn-primary group">
          {hp?.donateCtaLabel || "Donate Now"}
          <ArrowRight
            size={14}
            strokeWidth={2.5}
            className="transition-transform duration-150 group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </section>
  );
}

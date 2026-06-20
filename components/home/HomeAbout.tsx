import Link from "next/link";
import type { HomepageSettings } from "@/types/homepage";

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className={className}
    >
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

interface HomeAboutProps {
  homepage: HomepageSettings | null;
}

export default function HomeAbout({ homepage: hp }: HomeAboutProps) {
  return (
    <section className="relative section-y-xl overflow-hidden border-b border-gray-100 bg-white">
      <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-30" />
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
              <ArrowIcon className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="relative pb-10">
            <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 text-white sm:p-10">
              <div className="bg-hero-glow pointer-events-none absolute top-0 right-0 size-72 hero-glow-offset rounded-full opacity-60" />
              <p
                className="mb-3 text-center text-2xl leading-relaxed font-normal text-gold-400 sm:text-3xl"
                dir="rtl"
              >
                {hp?.aboutHadithArabic || "اطلبوا العلم من المهد إلى اللحد"}
              </p>
              <div className="eyebrow-line-gold mx-auto mb-3 w-10" aria-hidden="true" />
              <p className="text-center text-sm-plus leading-relaxed italic text-gray-400">
                &quot;
                {hp?.aboutHadithTranslation ||
                  "Seek knowledge from the cradle to the grave."}
                &quot;
              </p>
              <p className="text-caption mt-2 text-center font-semibold tracking-wide text-gold-500">
                — {hp?.aboutHadithAttribution || "Prophet Muhammad (S.A.W.W.)"}
              </p>
              <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
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

            <div className="card-surface absolute bottom-0 left-6 flex items-center gap-3 px-4 py-3">
              <div className="badge-trust">✓</div>
              <div>
                <p className="text-xs font-semibold text-slate-800">
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

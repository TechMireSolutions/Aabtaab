import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import ProseSection from "@/components/portable-text/ProseSection";
import { defineCmsPageMetadata } from "@/lib/cms/page";
import { resolveSiteName } from "@/lib/constants";
import { getCmsPage, getSiteSettings } from "@/lib/cms/queries";
import {
  ABOUT_PILLAR_ICONS,
  ABOUT_PILLARS,
  aboutIntro,
} from "@/lib/fallbacks/about";
import { ArrowRight } from "lucide-react";

export const generateMetadata = defineCmsPageMetadata("about", {
  path: "/about",
  fallbackTitle: "About Us",
  fallbackDescription:
    "Learn about Aabtaab — Shia Islamic education, services, and community.",
});

export default async function AboutPage() {
  const [page, settings] = await Promise.all([
    getCmsPage("about"),
    getSiteSettings(),
  ]);

  const siteName = resolveSiteName(settings);
  const intro = aboutIntro(siteName);

  return (
    <div>
      <PageHeader
        maxWidth="md"
        eyebrow={page?.eyebrow || "Our Story"}
        title={page?.title || "About Us"}
        subtitle={page?.subtitle || "Who we are and what drives us"}
      />

      <div className="section-y bg-white dark:bg-slate-950">
        <div className="container-content">
          {page?.body ? (
            <ProseSection value={page.body} variant="article" />
          ) : (
            <div className="space-y-6 sm:space-y-8">
              <p className="text-base-plus leading-relaxed text-gray-600">
                <strong className="text-slate-900">{intro.siteName}</strong>
                {intro.leadAfterName}
                <em>&ldquo;{intro.luminous}&rdquo;</em>
                {intro.leadAfterLuminous}
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {ABOUT_PILLARS.map((pillar) => {
                  const Icon = ABOUT_PILLAR_ICONS[pillar.icon];
                  return (
                    <div key={pillar.title} className="card-surface p-4 sm:p-5">
                      <div className="mb-3 flex size-9 items-center justify-center rounded-xl border border-brand-100 bg-brand-50 dark:border-brand-800/65 dark:bg-brand-900/30">
                        <Icon
                          size={15}
                          className="text-brand-700 dark:text-brand-400"
                          strokeWidth={1.75}
                        />
                      </div>
                      <h3 className="mb-1 text-sm-plus font-semibold text-slate-900 dark:text-white">
                        {pillar.title}
                      </h3>
                      <p className="text-body-muted">{pillar.description}</p>
                    </div>
                  );
                })}
              </div>

              <div className="card-surface p-4 sm:p-6">
                <h3 className="mb-2 text-base-plus font-semibold text-slate-900 dark:text-white">
                  Dar Ul Quran
                </h3>
                <p className="text-base-plus leading-relaxed text-gray-600 dark:text-slate-300">
                  {intro.darUlQuranBefore}
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3 border-t border-gray-100 pt-7 sm:mt-10 sm:pt-8 dark:border-slate-800">
            <Link href="/contact" className="btn-primary group">
              Contact Us
              <ArrowRight
                size={13}
                strokeWidth={2.5}
                className="transition-transform duration-150 group-hover:translate-x-0.5"
              />
            </Link>
            <Link href="/online-courses" className="btn-secondary">
              Our Courses
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

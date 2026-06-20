import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import ProseSection from "@/components/portable-text/ProseSection";
import { defineCmsPageMetadata } from "@/lib/cms/page";
import { resolveSiteName } from "@/lib/constants";
import { getCmsPage, getSiteSettings } from "@/lib/cms/queries";
import { ArrowRight, BookOpen, Heart, Star } from "lucide-react";

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

  return (
    <div>
      <PageHeader
        maxWidth="md"
        eyebrow={page?.eyebrow || "Our Story"}
        title={page?.title || "About Us"}
        subtitle={page?.subtitle || "Who we are and what drives us"}
      />

      <div className="section-y bg-white">
        <div className="container-content">
          {page?.body ? (
            <ProseSection value={page.body} variant="article" />
          ) : (
            <div className="space-y-6 sm:space-y-8">
              <p className="text-base-plus leading-relaxed text-gray-600">
                <strong className="text-slate-900">{siteName}</strong> is a
                dedicated platform for the promotion of Islamic knowledge rooted
                in the teachings of the Holy Quran and the Ahlul Bayt (A.S.).
                Our name — meaning <em>&ldquo;luminous&rdquo;</em> — reflects
                our mission to spread light through education and authentic
                Islamic content.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    Icon: BookOpen,
                    title: "Education",
                    description:
                      "Online Quran, Fiqh, Ethics & History courses from qualified scholars",
                  },
                  {
                    Icon: Heart,
                    title: "Services",
                    description:
                      "Authentic religious services — Niyabat Ziarat, Zakat, Khums & more",
                  },
                  {
                    Icon: Star,
                    title: "Community",
                    description:
                      "Majalis, programs and reliable Islamic content for the Ummah",
                  },
                ].map(({ Icon, title, description }) => (
                  <div
                    key={title}
                    className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-gray-100"
                  >
                    <div className="w-9 h-9 bg-brand-50 border border-brand-100 rounded-xl flex items-center justify-center mb-3">
                      <Icon
                        size={15}
                        className="text-brand-700"
                        strokeWidth={1.75}
                      />
                    </div>
                    <h3 className="font-semibold text-slate-900 text-sm-plus mb-1">
                      {title}
                    </h3>
                    <p className="text-body-muted">
                      {description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-slate-50 rounded-xl p-4 sm:p-6 border border-gray-100">
                <h3 className="font-semibold text-slate-900 mb-2 text-base-plus">
                  Dar Ul Quran
                </h3>
                <p className="text-base-plus text-gray-600 leading-relaxed">
                  We are affiliated with{" "}
                  <strong className="text-slate-800">Dar Ul Quran</strong>, our
                  dedicated Quranic institute providing structured Quran
                  education programs for students of all ages.
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 sm:mt-10 pt-7 sm:pt-8 border-t border-gray-100 flex flex-wrap gap-3">
            <Link href="/contact" className="btn-primary group">
              Contact Us
              <ArrowRight
                size={13}
                strokeWidth={2.5}
                className="group-hover:translate-x-0.5 transition-transform duration-150"
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

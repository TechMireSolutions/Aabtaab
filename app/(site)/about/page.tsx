import type { Metadata } from "next";
import Link from "next/link";
import { sanityFetch, CACHE_TAGS } from "@/sanity/lib/sanityFetch";
import { pageBySlugQuery, siteSettingsQuery } from "@/sanity/lib/queries";
import { PortableText } from "@portabletext/react";
import { ArrowRight, BookOpen, Heart, Star } from "lucide-react";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const page = await sanityFetch<{
    seo?: { metaTitle?: string; metaDescription?: string };
    title?: string;
    subtitle?: string;
  }>({
    query: pageBySlugQuery,
    params: { slug: "about" },
    tags: [CACHE_TAGS.siteSettings],
    revalidate: 86400,
  });
  return buildPageMetadata({
    title: page?.seo?.metaTitle || page?.title || "About Us",
    description:
      page?.seo?.metaDescription ||
      page?.subtitle ||
      "Learn about Aabtaab — Shia Islamic education, services, and community.",
    path: "/about",
  });
}

export default async function AboutPage() {
  const [page, settings] = await Promise.all([
    sanityFetch<{
      eyebrow?: string;
      title?: string;
      subtitle?: string;
      body?: unknown[];
    }>({
      query: pageBySlugQuery,
      params: { slug: "about" },
      tags: [CACHE_TAGS.siteSettings],
      revalidate: 86400,
    }),
    sanityFetch<{ siteName?: string }>({
      query: siteSettingsQuery,
      tags: [CACHE_TAGS.siteSettings],
      revalidate: 86400,
    }),
  ]);

  const siteName = settings?.siteName || "Aabtaab";

  return (
    <div>
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <p className="flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.18em] text-cyan-600 mb-3">
            <span className="w-5 h-px bg-cyan-400 inline-block" />
            {page?.eyebrow || "Our Story"}
          </p>
          <h1 className="font-bold text-[26px] sm:text-[30px] text-slate-900 tracking-[-0.02em] mb-2">
            {page?.title || "About Us"}
          </h1>
          <p className="text-[13.5px] text-gray-500">
            {page?.subtitle || "Who we are and what drives us"}
          </p>
        </div>
      </div>

      <div className="py-8 sm:py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {page?.body ? (
            <div
              className="prose prose-slate prose-base sm:prose-lg max-w-none
              prose-headings:font-bold prose-headings:tracking-tight
              prose-a:text-cyan-600 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-slate-900"
            >
              <PortableText
                value={page.body as Parameters<typeof PortableText>[0]["value"]}
              />
            </div>
          ) : (
            <div className="space-y-6 sm:space-y-8">
              <p className="text-[14.5px] text-gray-600 leading-[1.8]">
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
                    desc: "Online Quran, Fiqh, Ethics & History courses from qualified scholars",
                  },
                  {
                    Icon: Heart,
                    title: "Services",
                    desc: "Authentic religious services — Niyabat Ziarat, Zakat, Khums & more",
                  },
                  {
                    Icon: Star,
                    title: "Community",
                    desc: "Majalis, programs and reliable Islamic content for the Ummah",
                  },
                ].map(({ Icon, title, desc }) => (
                  <div
                    key={title}
                    className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-gray-100"
                  >
                    <div className="w-9 h-9 bg-cyan-50 border border-cyan-100 rounded-xl flex items-center justify-center mb-3">
                      <Icon
                        size={15}
                        className="text-cyan-600"
                        strokeWidth={1.75}
                      />
                    </div>
                    <h3 className="font-semibold text-slate-900 text-[14px] mb-1">
                      {title}
                    </h3>
                    <p className="text-[13px] text-gray-500 leading-relaxed">
                      {desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-slate-50 rounded-xl p-4 sm:p-6 border border-gray-100">
                <h3 className="font-semibold text-slate-900 mb-2 text-[15px]">
                  Dar Ul Quran
                </h3>
                <p className="text-[13.5px] text-gray-600 leading-relaxed">
                  We are affiliated with{" "}
                  <strong className="text-slate-800">Dar Ul Quran</strong>, our
                  dedicated Quranic institute providing structured Quran
                  education programs for students of all ages.
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 sm:mt-10 pt-7 sm:pt-8 border-t border-gray-100 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white text-[13.5px] font-semibold px-5 sm:px-6 py-2.5 rounded-full
                shadow-[0_4px_16px_rgba(8,145,178,0.3)] transition-all duration-200 hover:-translate-y-px"
            >
              Contact Us
              <ArrowRight
                size={13}
                strokeWidth={2.5}
                className="group-hover:translate-x-0.5 transition-transform duration-150"
              />
            </Link>
            <Link
              href="/online-courses"
              className="inline-flex items-center text-[13.5px] font-medium text-slate-700 hover:text-slate-900
                border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50
                px-5 sm:px-6 py-2.5 rounded-full transition-all duration-200"
            >
              Our Courses
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

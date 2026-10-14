import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Download,
  ExternalLink,
  User,
  FileText,
} from "lucide-react";
import ArticleDetailShell from "@/components/layout/ArticleDetailShell";
import ProseSection from "@/components/portable-text/ProseSection";
import {
  buildPublicationPageMetadata,
  resolvePublicationImageUrls,
} from "@/lib/cms/publication";
import { resolveSiteName } from "@/lib/constants";
import {
  getPublicationBySlug,
  getSiteSettings,
  getSitemapSlugs,
} from "@/lib/cms/queries";
import {
  PublicationJsonLd,
  BreadcrumbJsonLd,
  getDefaultOgImageUrl,
  getSiteUrl,
} from "@/lib/seo";
import { urlFor } from "@/sanity/lib/image";
import { EXTERNAL_LINK_PROPS } from "@/lib/urls";
import OpensInNewTab from "@/components/ui/OpensInNewTab";

const siteUrl = getSiteUrl();

export async function generateStaticParams() {
  const { publications } = await getSitemapSlugs();
  return (publications ?? []).map((pub) => ({ slug: pub.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return buildPublicationPageMetadata(slug);
}

export default async function PublicationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [publication, settings] = await Promise.all([
    getPublicationBySlug(slug),
    getSiteSettings(),
  ]);
  if (!publication) notFound();

  const siteName = resolveSiteName(settings);
  const { coverImageUrl, ogImageUrl } =
    resolvePublicationImageUrls(publication);
  const publisherLogoUrl = settings?.logo
    ? urlFor(settings.logo).width(600).height(60).url()
    : getDefaultOgImageUrl();

  const formattedSize = publication.fileSize
    ? `${(publication.fileSize / 1024 / 1024).toFixed(1)} MB`
    : null;

  const isDirectPdf = publication.fileUrl
    ? /\.pdf($|\?)/i.test(publication.fileUrl)
    : false;

  return (
    <>
      <PublicationJsonLd
        title={publication.title}
        description={
          publication.seo?.metaDescription || publication.description
        }
        imageUrl={ogImageUrl}
        publisherLogoUrl={publisherLogoUrl}
        publishedAt={publication.publishedYear || publication._createdAt}
        authorName={publication.author}
        siteUrl={siteUrl}
        slug={slug}
        siteName={siteName}
        fileUrl={publication.fileUrl}
        language={publication.language}
        pages={publication.pages}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteUrl },
          { name: "Publications", url: `${siteUrl}/publications` },
          { name: publication.title, url: `${siteUrl}/publications/${slug}` },
        ]}
      />

      <ArticleDetailShell
        backHref="/publications"
        backLabel="Back to Publications"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 items-start mb-10 pb-10 border-b border-gray-100 dark:border-slate-800">
          {/* Left Book Cover */}
          <div className="md:col-span-5 lg:col-span-4 flex justify-center md:justify-start">
            <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-[3/4] rounded-2xl overflow-hidden card-surface shadow-card border border-gray-200/80 dark:border-slate-800">
              {coverImageUrl ? (
                <Image
                  src={coverImageUrl}
                  alt={publication.coverImage?.alt || publication.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 320px"
                  priority
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center p-6 text-gray-400 dark:text-slate-500 bg-gray-50 dark:bg-slate-900/50">
                  <BookOpen size={64} strokeWidth={1} />
                  <span className="mt-3 text-xs font-medium text-center">
                    Aabtaab Publications
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Info & Actions */}
          <div className="md:col-span-7 lg:col-span-8 flex flex-col">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="badge-pill">PDF Document</span>
              {publication.language && (
                <span className="badge-pill">{publication.language}</span>
              )}
              {publication.pages && (
                <span className="badge-pill">{publication.pages} Pages</span>
              )}
            </div>

            <h1 className="heading-page mb-3">{publication.title}</h1>

            {publication.author && (
              <div className="mb-4 flex items-center gap-2 text-sm font-medium text-brand-700 dark:text-brand-400">
                <User size={15} strokeWidth={2} />
                <span>By {publication.author}</span>
              </div>
            )}

            {/* Quick Specs */}
            <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-gray-50 dark:bg-slate-900/60 border border-gray-100 dark:border-slate-800">
              <div className="flex flex-col">
                <span className="text-2xs uppercase tracking-wider text-gray-400 dark:text-slate-500 font-semibold">
                  Format
                </span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  PDF eBook
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xs uppercase tracking-wider text-gray-400 dark:text-slate-500 font-semibold">
                  File Size
                </span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {formattedSize || "Direct Link"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xs uppercase tracking-wider text-gray-400 dark:text-slate-500 font-semibold">
                  Language
                </span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {publication.language || "English / Urdu"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xs uppercase tracking-wider text-gray-400 dark:text-slate-500 font-semibold">
                  Published
                </span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {publication.publishedYear || "Available"}
                </span>
              </div>
            </div>

            {publication.description && (
              <p className="text-lead mb-6 text-slate-600 dark:text-slate-300">
                {publication.description}
              </p>
            )}

            {/* CTAs */}
            <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
              {publication.fileUrl ? (
                <>
                  <a
                    href={publication.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary inline-flex items-center justify-center gap-2 text-sm font-semibold px-6 py-3 shadow-brand-subtle"
                  >
                    <Download size={18} className="shrink-0" />
                    <span>Download PDF</span>
                    {formattedSize && (
                      <span className="text-xs font-normal opacity-85">
                        ({formattedSize})
                      </span>
                    )}
                  </a>
                  <a
                    href={publication.fileUrl}
                    {...EXTERNAL_LINK_PROPS}
                    className="btn-secondary inline-flex items-center justify-center gap-2 text-sm font-semibold px-5 py-3"
                  >
                    <ExternalLink size={16} className="shrink-0" />
                    <span>Read Online</span>
                    <OpensInNewTab />
                  </a>
                </>
              ) : (
                <div className="inline-flex items-center gap-2 rounded-xl bg-gray-100 dark:bg-slate-900 px-4 py-3 text-sm text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-slate-800">
                  <FileText
                    size={18}
                    className="text-gray-400 dark:text-slate-500"
                  />
                  <span>
                    Document is being digitized. Please check back soon.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Body / Content */}
        {publication.body && (
          <div className="mt-8 mb-12">
            <h2 className="heading-section text-xl font-bold mb-4 text-slate-900 dark:text-white">
              Overview &amp; Contents
            </h2>
            <ProseSection value={publication.body} variant="article" />
          </div>
        )}

        {/* Optional Embedded PDF Preview if it is a direct PDF link */}
        {publication.fileUrl && isDirectPdf && (
          <div className="my-10 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/30 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Document Preview
                </h3>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  Read directly in the browser or open in a full window.
                </p>
              </div>
              <a
                href={publication.fileUrl}
                {...EXTERNAL_LINK_PROPS}
                className="btn-secondary text-xs inline-flex items-center gap-1.5 self-start sm:self-auto py-2 px-3.5"
              >
                <ExternalLink size={14} />
                <span>Open in Full Tab</span>
                <OpensInNewTab />
              </a>
            </div>
            <div className="relative aspect-[3/4] sm:aspect-[16/10] w-full overflow-hidden rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950">
              <iframe
                src={`${publication.fileUrl}#toolbar=0`}
                title={publication.title}
                className="h-full w-full"
                loading="lazy"
              />
            </div>
          </div>
        )}

        {/* Back to Publications CTA */}
        <div className="mt-12 rounded-2xl bg-gradient-to-br from-brand-50 to-slate-50 dark:from-slate-900 dark:to-slate-950 p-6 sm:p-8 border border-brand-100/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
              Looking for more Islamic resources?
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Explore our complete library of publications, articles, and courses.
            </p>
          </div>
          <Link
            href="/publications"
            className="btn-secondary whitespace-nowrap shrink-0"
          >
            View All Publications
          </Link>
        </div>
      </ArticleDetailShell>
    </>
  );
}

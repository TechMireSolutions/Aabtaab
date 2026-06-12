import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, User } from "lucide-react";
import { sanityFetch, CACHE_TAGS, type Post } from "@/sanity/lib/sanityFetch";
import { urlFor } from "@/sanity/lib/image";
import { postBySlugQuery } from "@/sanity/lib/queries";
import { PortableText } from "@portabletext/react";
import { ArticleJsonLd } from "@/components/JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://aabtaab.com";
const SITE_NAME = "Aabtaab";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await sanityFetch<Post>({
    query: postBySlugQuery,
    params: { slug },
    tags: [CACHE_TAGS.post(slug)],
    revalidate: 3600,
  });

  const ogImageUrl = post?.seo?.ogImage
    ? urlFor(post.seo.ogImage).width(1200).height(630).url()
    : post?.mainImage
      ? urlFor(post.mainImage).width(1200).height(630).url()
      : undefined;

  return {
    title: post?.seo?.metaTitle ?? post?.title ?? "Article",
    description: post?.seo?.metaDescription ?? post?.excerpt,
    robots: post?.seo?.noIndex ? { index: false, follow: false } : undefined,
    alternates: post?.seo?.canonicalUrl
      ? { canonical: post.seo.canonicalUrl }
      : undefined,
    openGraph: ogImageUrl ? { images: [ogImageUrl] } : undefined,
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await sanityFetch<Post>({
    query: postBySlugQuery,
    params: { slug },
    tags: [CACHE_TAGS.post(slug)],
    revalidate: 3600,
  });
  if (!post) notFound();

  const mainImageUrl = post.mainImage
    ? urlFor(post.mainImage).width(900).height(500).url()
    : undefined;

  const ogImageUrl = post.seo?.ogImage
    ? urlFor(post.seo.ogImage).width(1200).height(630).url()
    : mainImageUrl;

  return (
    <div className="min-h-screen bg-white">
      {/* Article JSON-LD structured data */}
      <ArticleJsonLd
        title={post.title}
        description={post.seo?.metaDescription || post.excerpt}
        imageUrl={ogImageUrl}
        publishedAt={post.publishedAt}
        authorName={post.author?.name}
        siteUrl={SITE_URL}
        slug={slug}
        siteName={SITE_NAME}
        faqItems={post.faqItems}
      />

      {/* Back nav */}
      <div className="border-b border-gray-100 bg-white sticky top-[68px] z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Link
            href="/articles"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-gray-500 hover:text-slate-900 transition-colors group"
          >
            <ArrowLeft
              size={13}
              strokeWidth={2}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            Back to Articles
          </Link>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {post.categories && post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4 sm:mb-5">
            {post.categories.map((cat) => (
              <span
                key={cat._id}
                className="text-[10.5px] font-bold uppercase tracking-[0.1em] bg-cyan-50 text-cyan-700 border border-cyan-100 px-3 py-1 rounded-full"
              >
                {cat.title}
              </span>
            ))}
          </div>
        )}

        <h1 className="font-bold text-[26px] sm:text-[30px] lg:text-[38px] text-slate-900 leading-[1.12] tracking-[-0.02em] mb-4 sm:mb-5">
          {post.title}
        </h1>

        <div className="flex items-center flex-wrap gap-3 sm:gap-4 text-[12.5px] sm:text-[13px] text-gray-400 mb-8 pb-7 border-b border-gray-100">
          {post.author?.name && (
            <span className="flex items-center gap-1.5">
              <User size={13} strokeWidth={2} />
              <span className="font-medium text-gray-600">
                {post.author.name}
              </span>
            </span>
          )}
          {post.publishedAt && (
            <span className="flex items-center gap-1.5">
              <CalendarDays size={13} strokeWidth={2} />
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          )}
        </div>

        {mainImageUrl && (
          <div className="relative w-full aspect-[16/9] sm:aspect-[16/8] rounded-xl sm:rounded-2xl overflow-hidden mb-8 sm:mb-10 shadow-sm">
            <Image
              src={mainImageUrl}
              alt={post.mainImage?.alt ?? post.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {post.body && (
          <div
            className="prose prose-slate prose-base sm:prose-lg max-w-none
            prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-900
            prose-p:text-gray-700 prose-p:leading-[1.8]
            prose-a:text-cyan-600 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-slate-900 prose-strong:font-semibold
            prose-blockquote:border-l-4 prose-blockquote:border-cyan-400 prose-blockquote:text-slate-600 prose-blockquote:not-italic
            prose-li:text-gray-700"
          >
            <PortableText
              value={post.body as Parameters<typeof PortableText>[0]["value"]}
            />
          </div>
        )}

        {post.faqItems && post.faqItems.length > 0 && (
          <div className="mt-12 pt-10 border-t border-gray-100">
            <h2 className="font-bold text-[22px] text-slate-900 tracking-[-0.02em] mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {post.faqItems.map((item, i) => (
                <details
                  key={i}
                  className="group bg-slate-50 border border-gray-100 rounded-2xl overflow-hidden"
                >
                  <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none font-semibold text-[15px] text-slate-900 hover:text-cyan-700 transition-colors">
                    {item.question}
                  </summary>
                  <p className="px-5 pb-4 pt-1 text-[14px] text-gray-600 leading-relaxed border-t border-gray-100">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, User } from "lucide-react";
import FaqAccordionSection from "@/components/content/FaqAccordionSection";
import ProseSection from "@/components/portable-text/ProseSection";
import { buildPostPageMetadata, resolvePostImageUrls } from "@/lib/cms/post";
import { getPostBySlug } from "@/lib/cms/queries";
import { ArticleJsonLd, getSiteUrl } from "@/lib/seo";

const siteUrl = getSiteUrl();
const siteName = "Aabtaab";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return buildPostPageMetadata(slug);
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const { mainImageUrl, ogImageUrl } = resolvePostImageUrls(post);

  return (
    <div className="min-h-screen bg-white">
      <ArticleJsonLd
        title={post.title}
        description={post.seo?.metaDescription || post.excerpt}
        imageUrl={ogImageUrl}
        publishedAt={post.publishedAt}
        authorName={post.author?.name}
        siteUrl={siteUrl}
        slug={slug}
        siteName={siteName}
        faqItems={post.faqItems}
      />

      <div className="border-b border-gray-100 bg-white sticky top-[68px] z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Link
            href="/posts"
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
              sizes="(max-width: 768px) 100vw, 768px"
              priority
              className="object-cover"
            />
          </div>
        )}

        {post.body && <ProseSection value={post.body} variant="article" />}

        <FaqAccordionSection items={post.faqItems} />
      </article>
    </div>
  );
}

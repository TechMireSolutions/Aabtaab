import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, User } from "lucide-react";
import FaqAccordionSection from "@/components/content/FaqAccordionSection";
import ProseSection from "@/components/portable-text/ProseSection";
import { buildPostPageMetadata, resolvePostImageUrls } from "@/lib/cms/post";
import { resolveSiteName } from "@/lib/constants";
import { getPostBySlug, getSiteSettings } from "@/lib/cms/queries";
import { ArticleJsonLd, getSiteUrl } from "@/lib/seo";

const siteUrl = getSiteUrl();

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
  const [post, settings] = await Promise.all([
    getPostBySlug(slug),
    getSiteSettings(),
  ]);
  if (!post) notFound();

  const siteName = resolveSiteName(settings);
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

      <div className="sticky-below-header z-10 border-b border-gray-100 bg-white">
        <div className="container-content py-3">
          <Link
            href="/posts"
            className="inline-flex items-center gap-1.5 text-sm-plus font-medium text-gray-500 transition-colors hover:text-slate-900 group"
          >
            <ArrowLeft
              size={13}
              strokeWidth={2}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            Back to Articles
          </Link>
        </div>
      </div>

      <article className="container-content section-y">
        {post.categories && post.categories.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2 sm:mb-5">
            {post.categories.map((cat) => (
              <span key={cat._id} className="badge-pill">
                {cat.title}
              </span>
            ))}
          </div>
        )}

        <h1 className="heading-page mb-4 sm:mb-5">{post.title}</h1>

        <div className="text-caption mb-8 flex flex-wrap items-center gap-3 border-b border-gray-100 pb-7 sm:gap-4">
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
          <div className="media-hero mb-8 sm:mb-10 sm:aspect-2/1">
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

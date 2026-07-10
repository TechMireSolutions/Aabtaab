import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { CalendarDays, User } from "lucide-react";
import DetailBackButton from "@/components/layout/DetailBackButton";
import FaqAccordionSection from "@/components/content/FaqAccordionSection";
import ProseSection from "@/components/portable-text/ProseSection";
import { buildPostPageMetadata, resolvePostImageUrls } from "@/lib/cms/post";
import { resolveSiteName } from "@/lib/constants";
import { getPostBySlug, getSiteSettings } from "@/lib/cms/queries";
import { ArticleJsonLd, BreadcrumbJsonLd, getDefaultOgImageUrl, getSiteUrl } from "@/lib/seo";
import { urlFor } from "@/sanity/lib/image";

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
  const publisherLogoUrl = settings?.logo
    ? urlFor(settings.logo).width(600).height(60).url()
    : getDefaultOgImageUrl();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <ArticleJsonLd
        title={post.title}
        description={post.seo?.metaDescription || post.excerpt}
        imageUrl={ogImageUrl}
        publisherLogoUrl={publisherLogoUrl}
        publishedAt={post.publishedAt}
        updatedAt={post.updatedAt}
        authorName={post.author?.name}
        siteUrl={siteUrl}
        slug={slug}
        siteName={siteName}
        faqItems={post.faqItems}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteUrl },
          { name: "Articles", url: `${siteUrl}/posts` },
          { name: post.title, url: `${siteUrl}/posts/${slug}` },
        ]}
      />

      <DetailBackButton href="/posts" label="Back to Articles" />

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

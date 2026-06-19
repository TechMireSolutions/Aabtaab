import type { Metadata } from "next";
import { articleHeroImageUrl, ogImageUrl } from "@/sanity/lib/image";
import { buildPageMetadata } from "@/lib/seo/metadata";
import type { Post } from "@/types/sanity";
import { getPostBySlug } from "./queries";

export function resolvePostImageUrls(post: Post) {
  const mainImageUrl = post.mainImage
    ? articleHeroImageUrl(post.mainImage)
    : undefined;

  const ogImage = post.seo?.ogImage
    ? ogImageUrl(post.seo.ogImage)
    : post.mainImage
      ? ogImageUrl(post.mainImage)
      : undefined;

  return { mainImageUrl, ogImageUrl: ogImage };
}

export async function buildPostPageMetadata(slug: string): Promise<Metadata> {
  const post = await getPostBySlug(slug);
  const { ogImageUrl } = post ? resolvePostImageUrls(post) : {};

  const title = post?.seo?.metaTitle ?? post?.title ?? "Article";
  const description = post?.seo?.metaDescription ?? post?.excerpt;
  const path = `/posts/${slug}`;

  const canonicalPath = post?.seo?.canonicalUrl
    ? post.seo.canonicalUrl.startsWith("http")
      ? new URL(post.seo.canonicalUrl).pathname
      : post.seo.canonicalUrl
    : path;

  const base = buildPageMetadata({
    title,
    description,
    path: canonicalPath,
    noIndex: post?.seo?.noIndex,
    ogImage: ogImageUrl,
    keywords: post?.seo?.keywords,
  });

  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: post?.publishedAt,
      authors: post?.author?.name ? [post.author.name] : undefined,
    },
  };
}

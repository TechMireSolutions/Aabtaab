import type { Metadata } from "next";
import { sanityFetch, CACHE_TAGS } from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";
import {
  postsQuery,
  postsSearchQuery,
  pageBySlugQuery,
} from "@/sanity/lib/queries";
import ContentCard from "@/components/cards/ContentCard";
import { buildPageMetadata } from "@/lib/seo";
import type { PostCardSummary, CmsPageSummary } from "@/types/cms-page";
import type { SeoData } from "@/types/sanity";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q } = await searchParams;
  const searchTerm = q?.trim() ?? "";
  const page = await sanityFetch<CmsPageSummary & { seo?: SeoData }>({
    query: pageBySlugQuery,
    params: { slug: "posts" },
    tags: [CACHE_TAGS.siteSettings],
    revalidate: 86400,
  });

  return buildPageMetadata({
    title: searchTerm
      ? `Search: ${searchTerm}`
      : page?.seo?.metaTitle || page?.title || "Articles",
    description:
      page?.seo?.metaDescription ||
      page?.subtitle ||
      "Islamic articles, knowledge, and reflections from Aabtaab scholars.",
    path: searchTerm
      ? `/posts?q=${encodeURIComponent(searchTerm)}`
      : "/posts",
    noIndex: Boolean(searchTerm),
  });
}

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const searchTerm = q?.trim() ?? "";

  const [posts, page] = await Promise.all([
    sanityFetch<PostCardSummary[]>({
      query: searchTerm ? postsSearchQuery : postsQuery,
      params: searchTerm ? { term: searchTerm } : {},
      tags: [CACHE_TAGS.posts],
      revalidate: 3600,
    }),
    sanityFetch<CmsPageSummary>({
      query: pageBySlugQuery,
      params: { slug: "posts" },
      tags: [CACHE_TAGS.siteSettings],
      revalidate: 86400,
    }),
  ]);

  const postList = posts ?? [];

  return (
    <div>
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <p className="flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.18em] text-cyan-600 mb-3">
            <span className="w-5 h-px bg-cyan-400 inline-block" />
            {page?.eyebrow || "Knowledge"}
          </p>
          <h1 className="font-bold text-[26px] sm:text-[30px] text-slate-900 tracking-[-0.02em] mb-2">
            {searchTerm
              ? `Search: “${searchTerm}”`
              : page?.title || "Articles"}
          </h1>
          <p className="text-[13.5px] text-gray-500">
            {searchTerm
              ? `${postList.length} result${postList.length === 1 ? "" : "s"} found`
              : page?.subtitle || "Islamic knowledge, news & reflections"}
          </p>
        </div>
      </div>

      <div className="py-8 sm:py-12 bg-slate-50/40 min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {postList.length === 0 ? (
            <p className="text-center text-gray-400 text-[15px] py-24">
              {searchTerm
                ? `No articles found for “${searchTerm}”.`
                : "No articles published yet."}
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {postList.map((post) => (
                <ContentCard
                  key={post._id}
                  href={`/posts/${post.slug.current}`}
                  image={
                    post.mainImage
                      ? urlFor(post.mainImage).width(600).height(450).url()
                      : null
                  }
                  title={post.title}
                  description={post.excerpt || null}
                  badge={post.categories?.[0]?.title || null}
                  ctaLabel="Read More"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

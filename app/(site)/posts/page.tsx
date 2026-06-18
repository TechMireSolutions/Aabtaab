import type { Metadata } from "next";
import { sanityFetch, CACHE_TAGS } from "@/sanity/lib/fetch";
import { postsQuery, postsSearchQuery } from "@/sanity/lib/queries";
import CatalogPageLayout from "@/components/layout/CatalogPageLayout";
import PageHeader from "@/components/layout/PageHeader";
import PostCardGrid from "@/components/content/PostCardGrid";
import { buildCmsPageMetadata } from "@/lib/cms/page";
import { getCmsPage } from "@/lib/cms/queries";
import type { PostCardSummary } from "@/types/cms-page";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q } = await searchParams;
  const searchTerm = q?.trim() ?? "";
  const page = await getCmsPage("posts");

  return buildCmsPageMetadata(page, {
    title: searchTerm ? `Search: ${searchTerm}` : undefined,
    path: searchTerm
      ? `/posts?q=${encodeURIComponent(searchTerm)}`
      : "/posts",
    fallbackTitle: "Articles",
    fallbackDescription:
      "Islamic articles, knowledge, and reflections from Aabtaab scholars.",
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
    getCmsPage("posts"),
  ]);

  const postList = posts ?? [];

  if (searchTerm) {
    return (
      <div>
        <PageHeader
          eyebrow={page?.eyebrow || "Knowledge"}
          title={`Search: “${searchTerm}”`}
          subtitle={`${postList.length} result${postList.length === 1 ? "" : "s"} found`}
        />
        <div className="py-8 sm:py-12 bg-slate-50/40 min-h-[50vh]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <PostCardGrid
              posts={postList}
              emptyMessage={`No articles found for “${searchTerm}”.`}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <CatalogPageLayout
      eyebrow={page?.eyebrow || "Knowledge"}
      title={page?.title || "Articles"}
      subtitle={page?.subtitle || "Islamic knowledge, news & reflections"}
      isEmpty={postList.length === 0}
      emptyMessage="No articles published yet."
    >
      <PostCardGrid posts={postList} />
    </CatalogPageLayout>
  );
}

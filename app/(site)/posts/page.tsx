import type { Metadata } from "next";
import { redirect } from "next/navigation";
import CatalogPageLayout from "@/components/layout/CatalogPageLayout";
import PostCardGrid from "@/components/content/PostCardGrid";
import { buildCmsPageMetadata } from "@/lib/cms/page";
import { getCmsPage, getPosts } from "@/lib/cms/queries";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPage("posts");

  return buildCmsPageMetadata(page, {
    path: "/posts",
    fallbackTitle: "Articles",
    fallbackDescription:
      "Islamic articles, knowledge, and reflections from Aabtaab scholars.",
  });
}

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const searchTerm = q?.trim() ?? "";
  if (searchTerm) {
    redirect(`/search?q=${encodeURIComponent(searchTerm)}`);
  }

  const [posts, page] = await Promise.all([getPosts(), getCmsPage("posts")]);
  const postList = posts ?? [];

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

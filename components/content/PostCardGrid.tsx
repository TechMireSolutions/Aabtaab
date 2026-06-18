import ContentCard from "@/components/cards/ContentCard";
import { cardImageUrl } from "@/sanity/lib/image";
import type { PostCardSummary } from "@/types/cms-page";

interface PostCardGridProps {
  posts: PostCardSummary[];
  emptyMessage?: string;
}

export default function PostCardGrid({
  posts,
  emptyMessage = "No articles published yet.",
}: PostCardGridProps) {
  if (posts.length === 0) {
    return (
      <p className="text-center text-gray-400 text-[15px] py-24">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {posts.map((post) => (
        <ContentCard
          key={post._id}
          href={`/posts/${post.slug.current}`}
          image={post.mainImage ? cardImageUrl(post.mainImage) : null}
          title={post.title}
          description={post.excerpt || null}
          badge={post.categories?.[0]?.title || null}
          ctaLabel="Read More"
        />
      ))}
    </div>
  );
}

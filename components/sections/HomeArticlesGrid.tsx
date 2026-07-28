import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PostCardGrid from "@/components/content/PostCardGrid";
import type { HomePostSummary, HomepageSettings } from "@/types/homepage";

interface HomeArticlesGridProps {
  posts: HomePostSummary[];
  homepage: HomepageSettings | null;
}

export default function HomeArticlesGrid({
  posts,
  homepage: hp,
}: HomeArticlesGridProps) {
  const list = (posts ?? []).slice(0, 3);
  if (list.length === 0) return null;

  return (
    <section className="section-deferred section-y-lg border-b border-gray-100 dark:border-slate-900 bg-white dark:bg-slate-950">
      <div className="container-page">
        <div className="mb-7 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-eyebrow mb-2 flex items-center gap-2">
              <span className="eyebrow-line" />
              Knowledge
            </p>
            <h2 className="heading-section">
              {hp?.articlesHeading || "Latest Articles"}
            </h2>
            {hp?.articlesSubheading && (
              <p className="text-body-muted mt-1.5">{hp.articlesSubheading}</p>
            )}
          </div>
          <Link
            href="/posts"
            className="link-brand group inline-flex shrink-0 items-center gap-1.5 sm:ml-6"
          >
            View all
            <ArrowRight
              size={14}
              strokeWidth={2.5}
              className="transition-transform duration-150 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
        <PostCardGrid posts={list} />
      </div>
    </section>
  );
}

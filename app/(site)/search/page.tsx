import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { searchSite } from "@/lib/cms/search";
import { getSiteSettings } from "@/lib/cms/queries";
import { resolveSiteName } from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo";
import { SEARCH_TYPE_LABELS } from "@/types/search";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const [{ q }, settings] = await Promise.all([
    searchParams,
    getSiteSettings(),
  ]);
  const term = q?.trim() ?? "";
  const siteName = resolveSiteName(settings);

  return buildPageMetadata({
    title: term ? `Search: ${term}` : "Search",
    description: term
      ? `Search results for “${term}” on ${siteName}`
      : "Search articles, courses, services, and events.",
    path: term ? `/search?q=${encodeURIComponent(term)}` : "/search",
    noIndex: true,
  });
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const term = q?.trim() ?? "";
  const results = term ? (await searchSite(term)) ?? [] : [];

  return (
    <div>
      <PageHeader
        eyebrow="Search"
        title={term ? `Results for “${term}”` : "Search the site"}
        subtitle={
          term
            ? `${results.length} result${results.length === 1 ? "" : "s"} found`
            : "Find articles, courses, services, and events"
        }
      />

      <section className="section-muted min-h-catalog">
        <div className="container-content">
          {!term && (
            <p className="text-body-muted">
              Use the search box in the header, or add{" "}
              <code className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-sm">
                ?q=your+query
              </code>{" "}
              to this page URL.
            </p>
          )}

          {term && results.length === 0 && (
            <p className="empty-state">
              No results for “{term}”. Try different keywords.
            </p>
          )}

          {results.length > 0 && (
            <ul className="space-y-3">
              {results.map((item) => (
                <li key={item._id}>
                  <Link
                    href={item.href}
                    className="card-interactive flex flex-col gap-1 p-4 sm:p-5"
                  >
                    <span className="badge-pill w-fit">
                      {SEARCH_TYPE_LABELS[item._type]}
                    </span>
                    <span className="text-base-plus font-semibold text-slate-900 dark:text-white">
                      {item.title}
                    </span>
                    {item.summary && (
                      <span className="text-sm-plus text-slate-600 dark:text-slate-400 line-clamp-2">
                        {item.summary}
                      </span>
                    )}
                    <span className="link-brand mt-1 inline-flex items-center gap-1 text-sm-plus">
                      View
                      <ArrowRight size={12} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

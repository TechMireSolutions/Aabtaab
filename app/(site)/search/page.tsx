import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import SearchEmptyState from "@/components/layout/SearchEmptyState";
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
      ? `Search results for "${term}" on ${siteName}`
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
  const response = term ? await searchSite(term) : null;
  const { keywordMatch, suggestions, results } = response ?? { keywordMatch: null, suggestions: [], results: [] };
  const totalCount = (keywordMatch ? 1 : 0) + suggestions.length + results.length;

  return (
    <div>
      <PageHeader
        eyebrow="Search"
        title={term ? `Results for "${term}"` : "Search the site"}
        subtitle={
          term
            ? keywordMatch
              ? "Direct match found"
              : `${totalCount} result${totalCount === 1 ? "" : "s"} found`
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

          {term && totalCount === 0 && (
            <SearchEmptyState term={term} className="py-12" />
          )}

          {keywordMatch && (
            <div className="mb-8">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-3">
                Direct Match
              </h2>
              <Link
                href={keywordMatch.href}
                className="flex items-center gap-4 rounded-2xl border border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-950/30 p-5 transition-colors hover:bg-brand-100 dark:hover:bg-brand-950/50"
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-100 dark:bg-brand-900/40 border border-brand-200 dark:border-brand-800">
                  <Sparkles size={20} className="text-brand-600 dark:text-brand-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="badge-pill bg-brand-100/80 border-brand-200 dark:bg-brand-900/50 dark:border-brand-800">
                      Quick Match
                    </span>
                    <span className="badge-pill">
                      {SEARCH_TYPE_LABELS[keywordMatch.category as keyof typeof SEARCH_TYPE_LABELS] || keywordMatch.category}
                    </span>
                  </div>
                  <span className="text-lg font-semibold text-slate-900 dark:text-white">
                    {keywordMatch.label}
                  </span>
                </div>
                <ArrowRight size={18} className="text-brand-600 dark:text-brand-400 shrink-0" />
              </Link>
            </div>
          )}

          {suggestions.length > 0 && (
            <div className="mb-8">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-3">
                Related Suggestions
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {suggestions.map((sug) => (
                  <Link
                    key={sug.href}
                    href={sug.href}
                    className="card-interactive flex items-center gap-3 p-4"
                  >
                    <span className="badge-pill">
                      {SEARCH_TYPE_LABELS[sug.category as keyof typeof SEARCH_TYPE_LABELS] || sug.category}
                    </span>
                    <span className="text-sm-plus font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                      {sug.label}
                    </span>
                    <ArrowRight size={14} className="ml-auto text-gray-400 dark:text-slate-500 shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {results.length > 0 && (
            <div>
              {(keywordMatch || suggestions.length > 0) && (
                <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-3">
                  Search Results
                </h2>
              )}
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
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

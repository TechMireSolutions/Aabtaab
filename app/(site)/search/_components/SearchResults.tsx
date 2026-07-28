import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import SearchEmptyState from "@/components/layout/SearchEmptyState";
import {
  SearchQuickMatchBadge,
  SearchResultBody,
  SearchSectionHeading,
  SearchTypeBadge,
} from "@/components/ui/SearchResultMeta";
import type { SearchResponse } from "@/types/search";

interface SearchResultsProps {
  term: string;
  keywordMatch: SearchResponse["keywordMatch"];
  suggestions: SearchResponse["suggestions"];
  results: SearchResponse["results"];
  totalCount: number;
}

export default function SearchResults({
  term,
  keywordMatch,
  suggestions,
  results,
  totalCount,
}: SearchResultsProps) {
  return (
    <>
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
          <SearchSectionHeading>Direct Match</SearchSectionHeading>
          <Link
            href={keywordMatch.href}
            className="flex items-center gap-4 rounded-2xl border border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-950/30 p-5 transition-colors hover:bg-brand-100 dark:hover:bg-brand-950/50"
          >
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-100 dark:bg-brand-900/40 border border-brand-200 dark:border-brand-800">
              <Sparkles size={20} className="text-brand-600 dark:text-brand-400" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <SearchQuickMatchBadge />
                <SearchTypeBadge type={keywordMatch.category} />
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
          <SearchSectionHeading>Related Suggestions</SearchSectionHeading>
          <div className="grid gap-3 sm:grid-cols-2">
            {suggestions.map((sug) => (
              <Link
                key={sug.href}
                href={sug.href}
                className="card-interactive flex items-center gap-3 p-4"
              >
                <SearchTypeBadge type={sug.category} />
                <span className="text-sm-plus font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                  {sug.label}
                </span>
                <ArrowRight
                  size={14}
                  className="ml-auto text-gray-400 dark:text-slate-500 shrink-0"
                />
              </Link>
            ))}
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div>
          {(keywordMatch || suggestions.length > 0) && (
            <SearchSectionHeading>Search Results</SearchSectionHeading>
          )}
          <ul className="space-y-3">
            {results.map((item) => (
              <li key={item._id}>
                <Link
                  href={item.href}
                  className="card-interactive flex flex-col gap-1 p-4 sm:p-5"
                >
                  <SearchTypeBadge type={item._type} className="w-fit" />
                  <SearchResultBody
                    title={item.title}
                    summary={item.summary}
                    titleClassName="text-base-plus font-semibold text-slate-900 dark:text-white"
                    summaryClassName="text-sm-plus text-slate-600 dark:text-slate-400 line-clamp-2"
                  />
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
    </>
  );
}


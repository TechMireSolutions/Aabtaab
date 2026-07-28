import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import { searchSite } from "@/lib/cms/search";
import { getSiteSettings } from "@/lib/cms/queries";
import { resolveSiteName } from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo";
import SearchResults from "./_components/SearchResults";

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
  const { keywordMatch, suggestions, results } = response ?? {
    keywordMatch: null,
    suggestions: [],
    results: [],
  };
  const totalCount =
    (keywordMatch ? 1 : 0) + suggestions.length + results.length;

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
          <SearchResults
            term={term}
            keywordMatch={keywordMatch}
            suggestions={suggestions}
            results={results}
            totalCount={totalCount}
          />
        </div>
      </section>
    </div>
  );
}

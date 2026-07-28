import { searchTypeLabel } from "@/lib/cms/search-labels";

interface SearchTypeBadgeProps {
  type: string;
  className?: string;
}

/** Shared type/category pill used by search page and command palette. */
export function SearchTypeBadge({ type, className = "" }: SearchTypeBadgeProps) {
  return (
    <span className={`badge-pill ${className}`.trim()}>
      {searchTypeLabel(type)}
    </span>
  );
}

/** Emphasized "Quick Match" pill shared by search page and palette. */
export function SearchQuickMatchBadge() {
  return <span className="badge-quick-match">Quick Match</span>;
}

interface SearchSectionHeadingProps {
  children: React.ReactNode;
}

/** Section label above search result groups. */
export function SearchSectionHeading({ children }: SearchSectionHeadingProps) {
  return <h2 className="search-section-label">{children}</h2>;
}

interface SearchResultBodyProps {
  title: string;
  summary?: string | null;
  titleClassName?: string;
  summaryClassName?: string;
}

/** Title + optional excerpt shared by search result rows. */
export function SearchResultBody({
  title,
  summary,
  titleClassName = "text-sm-plus font-semibold text-slate-800 dark:text-slate-200 line-clamp-1",
  summaryClassName = "mt-0.5 text-xs text-gray-500 dark:text-slate-400 line-clamp-1",
}: SearchResultBodyProps) {
  return (
    <>
      <p className={titleClassName}>{title}</p>
      {summary ? <p className={summaryClassName}>{summary}</p> : null}
    </>
  );
}

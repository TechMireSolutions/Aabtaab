"use client";

import {
  BookOpen,
  Calendar,
  FileText,
  Settings,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import type { SiteSearchResult, KeywordMatch } from "@/types/search";
import { SEARCH_TYPE_LABELS } from "@/lib/cms/search-labels";

const TYPE_ICONS = {
  course: BookOpen,
  event: Calendar,
  post: FileText,
  service: Settings,
};

const SUGGESTION_ICONS: Record<string, typeof BookOpen> = {
  course: BookOpen,
  event: Calendar,
  article: FileText,
  service: Settings,
};

function rowClass(active: boolean) {
  return `flex w-full items-start gap-3.5 rounded-xl px-4 py-3 text-left transition-all duration-150 ${
    active
      ? "bg-brand-50 dark:bg-brand-950/30 border border-brand-100 dark:border-brand-900/50"
      : "border border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/40"
  }`;
}

function iconWrapClass(active: boolean, emphasized = false) {
  if (active) {
    return "flex size-9 shrink-0 items-center justify-center rounded-lg border transition-colors bg-brand-100 border-brand-200 dark:bg-brand-900/40 dark:border-brand-800";
  }
  if (emphasized) {
    return "flex size-9 shrink-0 items-center justify-center rounded-lg border transition-colors bg-brand-50 border-brand-200 dark:bg-brand-900/30 dark:border-brand-800";
  }
  return "flex size-9 shrink-0 items-center justify-center rounded-lg border transition-colors bg-slate-50 border-gray-200 dark:bg-slate-800/60 dark:border-slate-800";
}

function GoHint() {
  return (
    <div className="flex items-center gap-1.5 self-center text-brand-600 dark:text-brand-400 shrink-0">
      <span className="text-2xs font-semibold uppercase tracking-widest hidden sm:inline">
        Go
      </span>
      <ArrowRight size={14} />
    </div>
  );
}

interface SearchPaletteResultsProps {
  keywordMatch: KeywordMatch | null;
  suggestions: KeywordMatch[];
  results: SiteSearchResult[];
  selectedIndex: number;
  onSelect: (href: string) => void;
}

export default function SearchPaletteResults({
  keywordMatch,
  suggestions,
  results,
  selectedIndex,
  onSelect,
}: SearchPaletteResultsProps) {
  let flatIndex = 0;

  return (
    <ul className="space-y-1">
      {keywordMatch &&
        (() => {
          const idx = flatIndex++;
          const active = idx === selectedIndex;
          return (
            <li key={`kw-${keywordMatch.href}`}>
              <button
                onClick={() => onSelect(keywordMatch.href)}
                data-active={active}
                className={rowClass(active)}
              >
                <div className={iconWrapClass(active, true)}>
                  <Sparkles
                    size={15}
                    className="text-brand-600 dark:text-brand-400"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="badge-pill bg-brand-100/80 border-brand-200 dark:bg-brand-900/50 dark:border-brand-800">
                      Quick Match
                    </span>
                    <span className="badge-pill">
                      {SEARCH_TYPE_LABELS[
                        keywordMatch.category as keyof typeof SEARCH_TYPE_LABELS
                      ] || keywordMatch.category}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm-plus font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                    {keywordMatch.label}
                  </p>
                  <p className="mt-0.5 text-xs text-brand-600 dark:text-brand-400 line-clamp-1">
                    Go directly to this page
                  </p>
                </div>
                {active && <GoHint />}
              </button>
            </li>
          );
        })()}

      {suggestions.length > 0 && (
        <li key="suggestions-header" className="px-4 pt-2 pb-1">
          <span className="text-2xs font-semibold uppercase tracking-widest text-gray-400 dark:text-slate-500">
            Related suggestions
          </span>
        </li>
      )}

      {suggestions.map((sug) => {
        const idx = flatIndex++;
        const active = idx === selectedIndex;
        const SugIcon = SUGGESTION_ICONS[sug.category] || FileText;
        return (
          <li key={`sug-${sug.href}`}>
            <button
              onClick={() => onSelect(sug.href)}
              data-active={active}
              className={rowClass(active)}
            >
              <div className={iconWrapClass(active)}>
                <SugIcon
                  size={15}
                  className={
                    active
                      ? "text-brand-700 dark:text-brand-400"
                      : "text-gray-500 dark:text-slate-400"
                  }
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`badge-pill ${
                      active
                        ? "bg-brand-100/80 border-brand-200 dark:bg-brand-900/50 dark:border-brand-800"
                        : ""
                    }`}
                  >
                    {SEARCH_TYPE_LABELS[
                      sug.category as keyof typeof SEARCH_TYPE_LABELS
                    ] || sug.category}
                  </span>
                </div>
                <p className="mt-1.5 text-sm-plus font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                  {sug.label}
                </p>
              </div>
              {active && <GoHint />}
            </button>
          </li>
        );
      })}

      {results.length > 0 && suggestions.length > 0 && (
        <li key="results-header" className="px-4 pt-2 pb-1">
          <span className="text-2xs font-semibold uppercase tracking-widest text-gray-400 dark:text-slate-500">
            Search results
          </span>
        </li>
      )}

      {results.map((item) => {
        const idx = flatIndex++;
        const active = idx === selectedIndex;
        const Icon = TYPE_ICONS[item._type] || FileText;
        return (
          <li key={item._id}>
            <button
              onClick={() => onSelect(item.href)}
              data-active={active}
              className={rowClass(active)}
            >
              <div className={iconWrapClass(active)}>
                <Icon
                  size={15}
                  className={
                    active
                      ? "text-brand-700 dark:text-brand-400"
                      : "text-gray-500 dark:text-slate-400"
                  }
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`badge-pill ${
                      active
                        ? "bg-brand-100/80 border-brand-200 dark:bg-brand-900/50 dark:border-brand-800"
                        : ""
                    }`}
                  >
                    {SEARCH_TYPE_LABELS[item._type]}
                  </span>
                </div>
                <p className="mt-1.5 text-sm-plus font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                  {item.title}
                </p>
                {item.summary && (
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-slate-400 line-clamp-1">
                    {item.summary}
                  </p>
                )}
              </div>
              {active && <GoHint />}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

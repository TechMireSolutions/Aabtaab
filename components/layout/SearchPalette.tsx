"use client";

import { useEffect, useRef, useState, useTransition, useCallback, useMemo } from "react";
import { Search, X, BookOpen, Calendar, FileText, Settings, ArrowRight, CornerDownLeft, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import type { SiteSearchResult, KeywordMatch } from "@/types/search";
import { SEARCH_TYPE_LABELS } from "@/types/search";
import SearchEmptyState, { QuickNavChips } from "@/components/layout/SearchEmptyState";

interface SearchPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

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

export default function SearchPalette({ isOpen, onClose }: SearchPaletteProps) {
  const [query, setQuery] = useState("");
  const [keywordMatch, setKeywordMatch] = useState<KeywordMatch | null>(null);
  const [suggestions, setSuggestions] = useState<KeywordMatch[]>([]);
  const [results, setResults] = useState<SiteSearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const id = setTimeout(() => inputRef.current?.focus(), 50);
      return () => {
        clearTimeout(id);
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) return;

    const delayDebounceFn = setTimeout(() => {
      startTransition(async () => {
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
          if (res.ok) {
            const data = await res.json();
            setKeywordMatch(data.keywordMatch ?? null);
            setSuggestions(data.suggestions ?? []);
            setResults(data.results ?? []);
          }
        } catch (err) {
          console.error("Search failed:", err);
        } finally {
          setIsLoading(false);
        }
      });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const resolvedHasQuery = query.trim() !== "";
  const resolvedIsLoading = resolvedHasQuery ? isLoading : false;

  const totalItems = useMemo(() => {
    let count = 0;
    if (keywordMatch) count++;
    count += suggestions.length;
    count += results.length;
    return count;
  }, [keywordMatch, suggestions, results]);

  const [prevTotal, setPrevTotal] = useState(totalItems);
  if (totalItems !== prevTotal) {
    setPrevTotal(totalItems);
    setSelectedIndex(0);
  }

  const handleSelect = useCallback((href: string) => {
    onClose();
    setQuery("");
    setKeywordMatch(null);
    setSuggestions([]);
    setResults([]);
    setIsLoading(false);
    router.push(href);
  }, [onClose, router]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (totalItems > 0 ? (prev + 1) % totalItems : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (totalItems > 0 ? (prev - 1 + totalItems) % totalItems : 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (keywordMatch && selectedIndex === 0) {
          handleSelect(keywordMatch.href);
        } else {
          const adjustedIndex = keywordMatch ? selectedIndex - 1 : selectedIndex;
          if (adjustedIndex < suggestions.length) {
            handleSelect(suggestions[adjustedIndex].href);
          } else {
            const resultIndex = adjustedIndex - suggestions.length;
            if (results[resultIndex]) {
              handleSelect(results[resultIndex].href);
            }
          }
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, totalItems, selectedIndex, keywordMatch, suggestions, results, onClose, handleSelect]);

  useEffect(() => {
    const activeEl = scrollContainerRef.current?.querySelector("[data-active='true']");
    if (activeEl) {
      activeEl.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  let flatIndex = 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search site"
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:p-6 sm:pt-20 md:p-20 md:pt-28"
    >
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="relative z-10 flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl transition-all duration-300 animate-scale-in">
        <div className="relative flex items-center border-b border-gray-100 dark:border-slate-800 px-4 py-3.5">
          <Search className="size-5 text-gray-400 dark:text-slate-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              const val = e.target.value;
              setQuery(val);
              if (!val.trim()) {
                setKeywordMatch(null);
                setSuggestions([]);
                setResults([]);
              }
              setIsLoading(val.trim() !== "");
            }}
            placeholder="Search classes, events, articles..."
            aria-label="Search site content"
            className="ml-3 h-11 w-full bg-transparent text-base-plus text-slate-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 outline-none"
          />
          {resolvedIsLoading && (
            <div className="mr-2 animate-spin rounded-full border-2 border-brand-500 border-t-transparent size-4 shrink-0" />
          )}
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 dark:text-slate-500 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            aria-label="Close search"
          >
            <X className="size-5" />
          </button>
        </div>

        <div
          ref={scrollContainerRef}
          className="max-h-[420px] overflow-y-auto p-2 scrollbar-hide"
        >
          {!resolvedHasQuery ? (
            <QuickNavChips onSelect={handleSelect} />
          ) : totalItems === 0 && !resolvedIsLoading ? (
            <SearchEmptyState
              term={query}
              variant="button"
              onSelect={handleSelect}
              className="px-4 py-8"
            />
          ) : (
            <ul className="space-y-1">
              {keywordMatch && (() => {
                const idx = flatIndex++;
                const active = idx === selectedIndex;
                return (
                  <li key={`kw-${keywordMatch.href}`}>
                    <button
                      onClick={() => handleSelect(keywordMatch.href)}
                      data-active={active}
                      className={`flex w-full items-start gap-3.5 rounded-xl px-4 py-3 text-left transition-all duration-150 ${
                        active
                          ? "bg-brand-50 dark:bg-brand-950/30 border border-brand-100 dark:border-brand-900/50"
                          : "border border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/40"
                      }`}
                    >
                      <div
                        className={`flex size-9 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                          active
                            ? "bg-brand-100 border-brand-200 dark:bg-brand-900/40 dark:border-brand-800"
                            : "bg-brand-50 border-brand-200 dark:bg-brand-900/30 dark:border-brand-800"
                        }`}
                      >
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
                            {SEARCH_TYPE_LABELS[keywordMatch.category as keyof typeof SEARCH_TYPE_LABELS] || keywordMatch.category}
                          </span>
                        </div>
                        <p className="mt-1.5 text-sm-plus font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                          {keywordMatch.label}
                        </p>
                        <p className="mt-0.5 text-xs text-brand-600 dark:text-brand-400 line-clamp-1">
                          Go directly to this page
                        </p>
                      </div>
                      {active && (
                        <div className="flex items-center gap-1.5 self-center text-brand-600 dark:text-brand-400 shrink-0">
                          <span className="text-2xs font-semibold uppercase tracking-widest hidden sm:inline">
                            Go
                          </span>
                          <ArrowRight size={14} />
                        </div>
                      )}
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
                      onClick={() => handleSelect(sug.href)}
                      data-active={active}
                      className={`flex w-full items-start gap-3.5 rounded-xl px-4 py-3 text-left transition-all duration-150 ${
                        active
                          ? "bg-brand-50 dark:bg-brand-950/30 border border-brand-100 dark:border-brand-900/50"
                          : "border border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/40"
                      }`}
                    >
                      <div
                        className={`flex size-9 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                          active
                            ? "bg-brand-100 border-brand-200 dark:bg-brand-900/40 dark:border-brand-800"
                            : "bg-slate-50 border-gray-200 dark:bg-slate-800/60 dark:border-slate-800"
                        }`}
                      >
                        <SugIcon
                          size={15}
                          className={active ? "text-brand-700 dark:text-brand-400" : "text-gray-500 dark:text-slate-400"}
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
                            {SEARCH_TYPE_LABELS[sug.category as keyof typeof SEARCH_TYPE_LABELS] || sug.category}
                          </span>
                        </div>
                        <p className="mt-1.5 text-sm-plus font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                          {sug.label}
                        </p>
                      </div>
                      {active && (
                        <div className="flex items-center gap-1.5 self-center text-brand-600 dark:text-brand-400 shrink-0">
                          <span className="text-2xs font-semibold uppercase tracking-widest hidden sm:inline">
                            Go
                          </span>
                          <ArrowRight size={14} />
                        </div>
                      )}
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
                      onClick={() => handleSelect(item.href)}
                      data-active={active}
                      className={`flex w-full items-start gap-3.5 rounded-xl px-4 py-3 text-left transition-all duration-150 ${
                        active
                          ? "bg-brand-50 dark:bg-brand-950/30 border border-brand-100 dark:border-brand-900/50"
                          : "border border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/40"
                      }`}
                    >
                      <div
                        className={`flex size-9 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                          active
                            ? "bg-brand-100 border-brand-200 dark:bg-brand-900/40 dark:border-brand-800"
                            : "bg-slate-50 border-gray-200 dark:bg-slate-800/60 dark:border-slate-800"
                        }`}
                      >
                        <Icon
                          size={15}
                          className={active ? "text-brand-700 dark:text-brand-400" : "text-gray-500 dark:text-slate-400"}
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
                      {active && (
                        <div className="flex items-center gap-1.5 self-center text-brand-600 dark:text-brand-400 shrink-0">
                          <span className="text-2xs font-semibold uppercase tracking-widest hidden sm:inline">
                            Go
                          </span>
                          <ArrowRight size={14} />
                        </div>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-4 py-3 text-2xs font-medium text-gray-400 dark:text-slate-500">
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <span className="rounded border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-1 py-0.5 shadow-xs">
                ↑↓
              </span>{" "}
              to navigate
            </span>
            <span className="flex items-center gap-1">
              <span className="rounded border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-1 py-0.5 shadow-xs flex items-center gap-0.5">
                <CornerDownLeft size={8} /> Enter
              </span>{" "}
              to select
            </span>
            <span className="flex items-center gap-1">
              <span className="rounded border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-1.5 py-0.5 shadow-xs">
                Esc
              </span>{" "}
              to close
            </span>
          </div>
          <div className="hidden sm:block">
            Press{" "}
            <span className="rounded border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-1.5 py-0.5 shadow-xs">
              ⌘K
            </span>{" "}
            to open
          </div>
        </div>
      </div>
    </div>
  );
}

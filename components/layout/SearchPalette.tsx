"use client";

import { useEffect, useRef, useState, useTransition, useCallback, useMemo } from "react";
import { Search, X, CornerDownLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import type { SiteSearchResult, KeywordMatch } from "@/types/search";
import SearchEmptyState, { QuickNavChips } from "@/components/layout/SearchEmptyState";
import SearchPaletteResults from "@/components/layout/SearchPaletteResults";

interface SearchPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

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

  const handleSelect = useCallback(
    (href: string) => {
      onClose();
      setQuery("");
      setKeywordMatch(null);
      setSuggestions([]);
      setResults([]);
      setIsLoading(false);
      router.push(href);
    },
    [onClose, router],
  );

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          totalItems > 0 ? (prev + 1) % totalItems : 0,
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          totalItems > 0 ? (prev - 1 + totalItems) % totalItems : 0,
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (keywordMatch && selectedIndex === 0) {
          handleSelect(keywordMatch.href);
        } else {
          const adjustedIndex = keywordMatch
            ? selectedIndex - 1
            : selectedIndex;
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
  }, [
    isOpen,
    totalItems,
    selectedIndex,
    keywordMatch,
    suggestions,
    results,
    onClose,
    handleSelect,
  ]);

  useEffect(() => {
    const activeEl = scrollContainerRef.current?.querySelector(
      "[data-active='true']",
    );
    if (activeEl) {
      activeEl.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

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
            <SearchPaletteResults
              keywordMatch={keywordMatch}
              suggestions={suggestions}
              results={results}
              selectedIndex={selectedIndex}
              onSelect={handleSelect}
            />
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

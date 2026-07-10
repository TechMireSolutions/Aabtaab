"use client";

import { useEffect, useRef, useState, useTransition, useCallback, useMemo } from "react";
import { Search, X, BookOpen, Calendar, FileText, Settings, ArrowRight, CornerDownLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import type { SiteSearchResult } from "@/types/search";
import { SEARCH_TYPE_LABELS } from "@/types/search";

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

export default function SearchPalette({ isOpen, onClose }: SearchPaletteProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SiteSearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Focus input when opened
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

  // Debounced search fetch
  useEffect(() => {
    if (!query.trim()) {
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      startTransition(async () => {
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
          if (res.ok) {
            const data = await res.json();
            setResults(data);
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

  // Compute resolved states dynamically to prevent setState in effect
  const resolvedResults = useMemo<SiteSearchResult[]>(() => {
    return query.trim() ? results : [];
  }, [query, results]);
  const resolvedIsLoading = query.trim() ? isLoading : false;

  // Reset selected index when results change
  const [prevResults, setPrevResults] = useState(results);
  if (results !== prevResults) {
    setPrevResults(results);
    setSelectedIndex(0);
  }

  const handleSelect = useCallback((href: string) => {
    onClose();
    setQuery("");
    setIsLoading(false);
    router.push(href);
  }, [onClose, router]);

  // Key navigation handler
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (resolvedResults.length > 0 ? (prev + 1) % resolvedResults.length : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (resolvedResults.length > 0 ? (prev - 1 + resolvedResults.length) % resolvedResults.length : 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (resolvedResults[selectedIndex]) {
          handleSelect(resolvedResults[selectedIndex].href);
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, resolvedResults, selectedIndex, onClose, handleSelect]);

  // Scroll active item into view
  useEffect(() => {
    const activeEl = scrollContainerRef.current?.querySelector("[data-active='true']");
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
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Palette Box */}
      <div className="relative z-10 flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl transition-all duration-300 animate-scale-in">
        {/* Search Input Area */}
        <div className="relative flex items-center border-b border-gray-100 dark:border-slate-800 px-4 py-3.5">
          <Search className="size-5 text-gray-400 dark:text-slate-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              const val = e.target.value;
              setQuery(val);
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

        {/* Results / Empty States */}
        <div
          ref={scrollContainerRef}
          className="max-h-[360px] overflow-y-auto p-2 scrollbar-hide"
        >
          {query.trim() === "" ? (
            <div className="px-4 py-8 text-center text-sm-plus text-gray-500 dark:text-slate-400">
              <p className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
                Quick Navigation
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {[
                  { label: "Online Courses", href: "/online-courses" },
                  { label: "Our Services", href: "/services" },
                  { label: "Upcoming Events", href: "/events" },
                  { label: "Read Articles", href: "/posts" },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleSelect(item.href)}
                    className="chip-outline-sm dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300 dark:hover:border-brand-500"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ) : resolvedResults.length === 0 && !resolvedIsLoading ? (
            <div className="px-4 py-12 text-center text-sm-plus text-gray-400 dark:text-slate-500">
              No results found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <ul className="space-y-1">
              {resolvedResults.map((item, index) => {
                const Icon = TYPE_ICONS[item._type] || FileText;
                const active = index === selectedIndex;
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

        {/* Footer shortcuts */}
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

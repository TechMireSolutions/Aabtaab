"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

interface MobileSearchButtonProps {
  searchPlaceholder?: string;
}

export default function MobileSearchButton({
  searchPlaceholder = "Search the site…",
}: MobileSearchButtonProps) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      const id = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(id);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Close when clicking outside both the toggle button and the search panel
  useEffect(() => {
    if (!open) return;
    function handleMouseDown(e: MouseEvent) {
      const target = e.target as Node;
      if (
        !buttonRef.current?.contains(target) &&
        !panelRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [open]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = inputRef.current?.value.trim() ?? "";
    setOpen(false);
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label={open ? "Close search" : "Search"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="ml-auto flex h-11 w-11 items-center justify-center rounded-full text-gray-600 dark:text-slate-400 transition-colors hover:bg-gray-100 dark:hover:bg-slate-900 focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 lg:hidden"
      >
        {open ? (
          <X className="size-5" aria-hidden="true" />
        ) : (
          <Search className="size-5" aria-hidden="true" />
        )}
      </button>

      {open && (
        <>
          {/* Dim backdrop — pointer-events-none so clicks pass through to the document listener */}
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
            aria-hidden="true"
          />

          {/* Search bar — below the sticky header */}
          <div
            ref={panelRef}
            className="fixed inset-x-0 z-40 border-b border-gray-200 bg-white px-4 py-3 shadow-card dark:border-slate-800 dark:bg-slate-950 lg:hidden"
            style={{ top: "var(--spacing-header)" }}
          >
            <form
              role="search"
              onSubmit={handleSubmit}
              className="flex overflow-hidden rounded-xl border border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-600/30"
            >
              <label htmlFor="mobile-header-search" className="sr-only">
                Search
              </label>
              <input
                ref={inputRef}
                id="mobile-header-search"
                type="search"
                name="q"
                enterKeyHint="search"
                inputMode="search"
                placeholder={searchPlaceholder}
                autoComplete="off"
                className="min-h-11 min-w-0 flex-1 border-0 bg-transparent px-3 text-sm-plus text-slate-700 dark:text-slate-200 outline-none placeholder:text-gray-400 dark:placeholder:text-slate-500"
              />
              <button
                type="submit"
                aria-label="Search"
                className="btn-search-submit shrink-0"
              >
                <Search className="size-3.5 text-white" aria-hidden="true" />
              </button>
            </form>
          </div>
        </>
      )}
    </>
  );
}

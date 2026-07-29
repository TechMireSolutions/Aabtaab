import Link from "next/link";
import { Info } from "lucide-react";
import { SEARCH_QUICK_LINKS } from "@/lib/fallbacks/nav";

interface SearchEmptyStateProps {
  term: string;
  /** `link` for full page; `button` for palette (calls onSelect) */
  variant?: "link" | "button";
  onSelect?: (href: string) => void;
  className?: string;
}

export default function SearchEmptyState({
  term,
  variant = "link",
  onSelect,
  className = "",
}: SearchEmptyStateProps) {
  return (
    <div className={`text-center ${className}`}>
      <div className="badge-notice mb-4">
        <Info size={14} className="text-gold-600 shrink-0" aria-hidden="true" />
        <span>
          &ldquo;{term}&rdquo; is not available yet
        </span>
      </div>
      <p className="mx-auto mb-6 max-w-copy text-sm-plus text-gray-500 dark:text-slate-400">
        We don&apos;t have content matching this keyword right now. Try something
        else, or explore these pages:
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {SEARCH_QUICK_LINKS.map((item) =>
          variant === "button" && onSelect ? (
            <button
              key={item.href}
              type="button"
              onClick={() => onSelect(item.href)}
              className="chip-outline-sm dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300 dark:hover:border-brand-500"
            >
              {item.label}
            </button>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className="card-interactive px-5 py-3 text-sm-plus font-semibold text-slate-800 dark:text-slate-200"
            >
              {item.label}
            </Link>
          ),
        )}
      </div>
    </div>
  );
}

interface QuickNavChipsProps {
  onSelect: (href: string) => void;
}

export function QuickNavChips({ onSelect }: QuickNavChipsProps) {
  return (
    <div className="px-4 py-8 text-center text-sm-plus text-gray-500 dark:text-slate-400">
      <p className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
        Quick Navigation
      </p>
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {SEARCH_QUICK_LINKS.map((item) => (
          <button
            key={item.href}
            type="button"
            onClick={() => onSelect(item.href)}
            className="chip-outline-sm dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300 dark:hover:border-brand-500"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

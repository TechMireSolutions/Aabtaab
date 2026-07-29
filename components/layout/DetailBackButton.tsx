import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface DetailBackButtonProps {
  href: string;
  label: string;
}

export default function DetailBackButton({ href, label }: DetailBackButtonProps) {
  return (
    <div className="sticky-below-header z-10 border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950">
      <div className="container-content py-3">
        <Link
          href={href}
          className="inline-flex min-h-11 items-center gap-1.5 text-sm-plus font-medium text-gray-500 dark:text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 group"
        >
          <ArrowLeft
            size={13}
            strokeWidth={2}
            aria-hidden="true"
            className="transition-transform group-hover:-translate-x-0.5"
          />
          {label}
        </Link>
      </div>
    </div>
  );
}

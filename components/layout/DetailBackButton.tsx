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
          className="inline-flex items-center gap-1.5 text-sm-plus font-medium text-gray-500 dark:text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-white group"
        >
          <ArrowLeft
            size={13}
            strokeWidth={2}
            className="transition-transform group-hover:-translate-x-0.5"
          />
          {label}
        </Link>
      </div>
    </div>
  );
}

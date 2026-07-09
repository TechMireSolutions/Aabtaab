import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface DetailBackButtonProps {
  href: string;
  label: string;
}

export default function DetailBackButton({ href, label }: DetailBackButtonProps) {
  return (
    <div className="sticky-below-header z-10 border-b border-gray-100 bg-white">
      <div className="container-content py-3">
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 text-sm-plus font-medium text-gray-500 transition-colors hover:text-slate-900 group"
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

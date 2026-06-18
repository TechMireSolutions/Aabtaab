import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { BreadcrumbJsonLd } from "@/lib/seo";
import { ancestryPathSegment } from "@/lib/paths";
import type { ContentAncestor } from "@/types/sanity";

interface NestedBreadcrumbsProps {
  base: "online-courses" | "services";
  baseLabel: string;
  ancestry: ContentAncestor[];
  currentTitle: string;
  currentPath: string;
  breadcrumbItems: Array<{ name: string; url: string }>;
}

export default function NestedBreadcrumbs({
  base,
  baseLabel,
  ancestry,
  currentTitle,
  breadcrumbItems,
}: NestedBreadcrumbsProps) {
  const baseHref = `/${base}`;

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center flex-wrap gap-1 text-[12.5px] text-gray-400">
            <Link
              href={baseHref}
              className="hover:text-cyan-600 transition-colors font-medium"
            >
              {baseLabel}
            </Link>
            {ancestry.map(({ title, slug }, index) => (
              <span key={slug} className="flex items-center gap-1">
                <ChevronRight size={12} className="text-gray-300" />
                <Link
                  href={`${baseHref}/${ancestryPathSegment(ancestry, index)}`}
                  className="hover:text-cyan-600 transition-colors"
                >
                  {title}
                </Link>
              </span>
            ))}
            <span className="flex items-center gap-1">
              <ChevronRight size={12} className="text-gray-300" />
              <span className="text-slate-700 font-medium">{currentTitle}</span>
            </span>
          </nav>
        </div>
      </div>
    </>
  );
}

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
      <div className="border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="container-page py-3">
          <nav aria-label="Breadcrumb" className="text-caption flex flex-wrap items-center gap-1">
            <Link href={baseHref} className="link-brand font-medium">
              {baseLabel}
            </Link>
            {ancestry.map(({ title, slug }, index) => (
              <span key={slug} className="flex items-center gap-1">
                <ChevronRight
                  size={12}
                  aria-hidden="true"
                  className="text-gray-400"
                />
                <Link href={`${baseHref}/${ancestryPathSegment(ancestry, index)}`} className="link-brand">
                  {title}
                </Link>
              </span>
            ))}
            <span className="flex items-center gap-1">
              <ChevronRight
                size={12}
                aria-hidden="true"
                className="text-gray-400"
              />
              <span aria-current="page" className="font-medium text-slate-700">
                {currentTitle}
              </span>
            </span>
          </nav>
        </div>
      </div>
    </>
  );
}

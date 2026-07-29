import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";
import PortableTextBody from "@/components/portable-text/PortableTextBody";
import { urlFor } from "@/sanity/lib/image";
import { safeContactHref } from "@/lib/urls";
import type { Scholar } from "@/types/scholar";

export default function ScholarsGrid({ scholars }: { scholars: Scholar[] }) {
  if (scholars.length === 0) {
    return (
      <div className="empty-state card-surface">
        <p className="font-medium text-slate-700 dark:text-slate-300">
          No scholars listed yet.
        </p>
        <p className="text-sm-plus mt-1 text-slate-500 dark:text-slate-400">
          Check back soon as we publish faculty profiles.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-8 md:gap-10">
      {scholars.map((scholar) => {
        const contactHref = safeContactHref(scholar.contactDetails);
        return (
          <div
            key={scholar._id}
            className="group card-surface card-hover-lift relative flex w-full max-w-sm flex-col overflow-hidden"
          >
            <div className="relative h-80 w-full shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-800">
              {scholar.image ? (
                <Image
                  src={urlFor(scholar.image).width(600).height(800).url()}
                  alt={scholar.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="hover-scale-image object-top"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center media-placeholder">
                  <span className="text-4xl font-bold text-slate-400 dark:text-slate-500">
                    {scholar.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col p-6 sm:p-8">
              <h3 className="mb-4 heading-section text-xl sm:text-2xl">
                {scholar.name}
              </h3>

              {scholar.qualifications && scholar.qualifications.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-2">
                  {scholar.qualifications.map((qual) => (
                    <span key={qual} className="badge-pill">
                      {qual}
                    </span>
                  ))}
                </div>
              )}

              {scholar.bio && (
                <div className="prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 mb-8 line-clamp-4">
                  <PortableTextBody value={scholar.bio} />
                </div>
              )}

              <div className="mt-auto pt-2">
                {contactHref ? (
                  <Link
                    href={contactHref}
                    className="btn-primary w-full justify-center"
                  >
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    Get in Touch
                  </Link>
                ) : (
                  <div className="h-11" aria-hidden="true" />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

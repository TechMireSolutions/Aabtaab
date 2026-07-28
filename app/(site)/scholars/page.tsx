import { getScholars } from "@/lib/cms/queries";
import PageHeader from "@/components/layout/PageHeader";
import PortableTextBody from "@/components/portable-text/PortableTextBody";
import Image from "next/image";
import { Mail } from "lucide-react";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { safeContactHref } from "@/lib/urls/safe-href";
import type { Scholar } from "@/types/scholar";

export const metadata = buildPageMetadata({
  title: "Our Scholars",
  description:
    "Learn directly from highly qualified and experienced teachers of the Hawza.",
  path: "/scholars",
});

export default async function ScholarsPage() {
  const scholars = (await getScholars()) || [];

  return (
    <>
      <PageHeader
        eyebrow="Faculty"
        title="Our Scholars"
        subtitle="Learn directly from highly qualified and experienced teachers of the Hawza, dedicated to your spiritual and academic growth."
      />

      <section className="section-y relative bg-slate-50 dark:bg-slate-950 overflow-hidden flex-1">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[40rem] bg-brand-500/5 dark:bg-brand-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="container-narrow relative z-10">
          {scholars.length === 0 ? (
            <div className="empty-state card-surface">
              <p className="font-medium text-slate-700 dark:text-slate-300">
                No scholars listed yet.
              </p>
              <p className="text-sm-plus mt-1 text-slate-500 dark:text-slate-400">
                Check back soon as we publish faculty profiles.
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-8 md:gap-10">
              {scholars.map((scholar: Scholar) => {
                const contactHref = safeContactHref(scholar.contactDetails);
                return (
                  <div
                    key={scholar._id}
                    className="group card-surface card-hover-lift relative flex w-full max-w-[24rem] flex-col overflow-hidden"
                  >
                    <div className="relative h-[20rem] w-full overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
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

                      {scholar.qualifications &&
                        scholar.qualifications.length > 0 && (
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
          )}
        </div>
      </section>
    </>
  );
}

import PageHeader from "@/components/layout/PageHeader";
import { BookOpen, Download } from "lucide-react";
import { defineCmsPageMetadata } from "@/lib/cms/page";
import { getCmsPage, getPublications } from "@/lib/cms/queries";
import ProseSection from "@/components/portable-text/ProseSection";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

export const generateMetadata = defineCmsPageMetadata("publications", {
  path: "/publications",
  fallbackTitle: "Publications",
  fallbackDescription:
    "Explore our collection of ebooks, PDFs, and Islamic literature.",
});

export default async function PublicationsPage() {
  const [page, publications] = await Promise.all([
    getCmsPage("publications"),
    getPublications(),
  ]);

  return (
    <div>
      <PageHeader
        eyebrow={page?.eyebrow || "Library"}
        title={page?.title || "Publications"}
        subtitle={
          page?.subtitle ||
          "Explore our collection of ebooks, PDFs, and Islamic literature."
        }
      />

      <div className="section-y bg-white dark:bg-slate-950">
        <div className="container-page">
          {page?.body && (
            <div className="prose prose-sm mb-12 max-w-none text-gray-700 dark:text-gray-300">
              <ProseSection value={page.body} variant="article" />
            </div>
          )}

          {publications && publications.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {publications.map((pub) => (
                <div key={pub._id} className="card-surface card-hover-lift flex flex-col overflow-hidden">
                  <div className="relative aspect-video w-full bg-gray-100 dark:bg-slate-800/50">
                    {pub.coverImage ? (
                      <Image
                        src={urlFor(pub.coverImage).width(600).height(338).url()}
                        alt={pub.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-400 dark:text-slate-500">
                        <BookOpen size={48} strokeWidth={1} />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white line-clamp-2">
                      {pub.title}
                    </h3>
                    {pub.description && (
                      <p className="mb-5 text-sm-plus text-gray-600 dark:text-slate-400 line-clamp-3">
                        {pub.description}
                      </p>
                    )}
                    <div className="mt-auto pt-2">
                      {pub.fileUrl ? (
                        <a
                          href={pub.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary w-full flex items-center justify-center gap-2"
                        >
                          <Download size={16} className="shrink-0" />
                          <span className="whitespace-nowrap">Download</span>
                          {pub.fileSize && (
                            <span className="text-xs font-medium opacity-80 whitespace-nowrap">
                              ({(pub.fileSize / 1024 / 1024).toFixed(1)} MB)
                            </span>
                          )}
                        </a>
                      ) : (
                        <button disabled className="btn-secondary w-full opacity-50 cursor-not-allowed">
                          File unavailable
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !page?.body && (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-16 text-center sm:py-24 dark:border-slate-800 dark:bg-slate-900/50">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">
                  <BookOpen size={32} strokeWidth={1.5} />
                </div>
                <h2 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">
                  Coming Soon
                </h2>
                <p className="mx-auto max-w-md text-base text-gray-500 dark:text-slate-400">
                  We are currently compiling our collection of ebooks and PDFs. Please check back later to download our publications.
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

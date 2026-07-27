import { Metadata } from "next";
import { getScholars } from "@/lib/cms/queries";
import PageHeader from "@/components/layout/PageHeader";
import PortableTextBody from "@/components/portable-text/PortableTextBody";
import Image from "next/image";
import { Mail } from "lucide-react";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";

export const metadata: Metadata = {
  title: "Our Scholars",
  description: "Learn directly from highly qualified and experienced teachers of the Hawza.",
};

export default async function ScholarsPage() {
  const scholars = await getScholars() || [];

  return (
    <>
      <PageHeader
        eyebrow="Faculty"
        title="Our Scholars"
        subtitle="Learn directly from highly qualified and experienced teachers of the Hawza, dedicated to your spiritual and academic growth."
      />

      <section className="section-y relative bg-slate-50 dark:bg-slate-950 overflow-hidden flex-1">
        {/* Subtle background glows for premium feel */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[40rem] bg-brand-500/5 dark:bg-brand-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container-narrow relative z-10">
          {scholars.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/50">
              <p className="text-slate-500 font-medium">No scholars found yet.</p>
              <p className="text-slate-400 text-sm mt-1">Check back later as we update our faculty profiles.</p>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-8 md:gap-10">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {scholars.map((scholar: any) => (
                <div
                  key={scholar._id}
                  className="group relative flex w-full max-w-[24rem] flex-col rounded-3xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200/50 dark:border-slate-800/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-brand-900/10 dark:hover:shadow-brand-900/30"
                >
                  {/* Image Container */}
                  <div className="relative h-[20rem] w-full overflow-hidden rounded-t-3xl bg-slate-100 dark:bg-slate-800 shrink-0">
                    {scholar.image ? (
                      <Image
                        src={urlFor(scholar.image).width(600).height(800).url()}
                        alt={scholar.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                        <div className="h-24 w-24 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                          <span className="text-4xl font-bold text-slate-400 dark:text-slate-500">
                            {scholar.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Text Content Block */}
                  <div className="flex flex-1 flex-col p-6 sm:p-8">
                    <h3 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
                      {scholar.name}
                    </h3>

                    {/* Beautiful Pill Badges for Qualifications */}
                    {scholar.qualifications && scholar.qualifications.length > 0 && (
                      <div className="mb-6 flex flex-wrap gap-2">
                        {scholar.qualifications.map((qual: string, idx: number) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400 border border-brand-200/50 dark:border-brand-500/20"
                          >
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
                      {scholar.contactDetails ? (
                        <Link 
                          href={scholar.contactDetails.includes("@") ? `mailto:${scholar.contactDetails}` : scholar.contactDetails}
                          className="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-brand-600 transition-all hover:bg-brand-700 shadow-md shadow-brand-900/10 hover:shadow-lg hover:-translate-y-0.5 group/btn"
                        >
                          <Mail className="h-4 w-4 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:rotate-6" />
                          Get in Touch
                        </Link>
                      ) : (
                        <div className="h-[44px]"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

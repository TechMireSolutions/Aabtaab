import Link from "next/link";
import { FOOTER_CTA } from "@/lib/fallbacks/footer-nav";

/** Stay-connected CTA band at the top of the site footer. */
export default function FooterCtaBand() {
  return (
    <div className="border-b border-slate-900">
      <div className="container-page pt-6 pb-fab-safe sm:pt-10 lg:pt-12 lg:pb-12">
        <div className="footer-cta-band">
          <div
            className="pointer-events-none absolute top-0 right-0 -mt-20 -mr-20 size-64 rounded-full bg-brand-500/10 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative z-10 max-w-xl">
            <h2 className="mb-2 text-xl font-bold text-balance text-white sm:text-2xl">
              {FOOTER_CTA.title}
            </h2>
            <p className="text-pretty text-sm leading-relaxed text-slate-400 sm:text-base">
              {FOOTER_CTA.body}
            </p>
          </div>
          <div className="relative z-10 flex w-full lg:max-w-md">
            <Link
              href={FOOTER_CTA.actionHref}
              className="btn-primary w-full justify-center lg:w-auto"
            >
              {FOOTER_CTA.actionLabel}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

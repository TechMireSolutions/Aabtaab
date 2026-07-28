import Link from "next/link";
import ProseSection from "@/components/portable-text/ProseSection";
import DynamicPaymentMethods from "./_components/DynamicPaymentMethods";
import PageHeader from "@/components/layout/PageHeader";
import { ArrowRight } from "lucide-react";
import { defineCmsPageMetadata } from "@/lib/cms/page";
import {
  getCmsPage,
  getSiteSettings,
  getPaymentMethods,
} from "@/lib/cms/queries";
import {
  DEFAULT_DONATE_CAUSES,
} from "@/lib/fallbacks/donate";
import { EXTERNAL_LINK_PROPS } from "@/lib/urls";
import OpensInNewTab from "@/components/ui/OpensInNewTab";

export const generateMetadata = defineCmsPageMetadata("donate", {
  path: "/donate",
  fallbackTitle: "Donate",
  fallbackDescription:
    "Support Aabtaab's mission to spread Shia Islamic knowledge and community services.",
});

export default async function DonatePage() {
  const [settings, page, paymentMethods] = await Promise.all([
    getSiteSettings(),
    getCmsPage("donate"),
    getPaymentMethods(),
  ]);

  const causes = settings?.donateCauses?.length
    ? settings.donateCauses
    : [...DEFAULT_DONATE_CAUSES];

  return (
    <div>
      <PageHeader
        centered
        maxWidth="lg"
        above={
          <p
            className="font-arabic mb-3 text-xl-plus leading-none text-brand-700 sm:text-2xl"
            lang="ar"
            dir="rtl"
          >
            {settings?.donateArabicVerse || "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ"}
          </p>
        }
        eyebrow={page?.eyebrow || "Give Back"}
        title={page?.title || "Donate"}
        subtitle={
          page?.subtitle ||
          "Your generosity keeps the light of Ahlul Bayt (A.S.) alive. Every donation — big or small — makes a difference."
        }
      />

      <div className="section-y bg-white dark:bg-slate-950">
        <div className="container-content">
          {page?.body && (
            <div className="prose prose-sm mb-8 max-w-none text-gray-700 dark:text-gray-300 sm:mb-10">
              <ProseSection value={page.body} variant="article" />
            </div>
          )}

          <div className="mb-8 grid grid-cols-1 gap-4 sm:mb-10 sm:grid-cols-2">
            {causes.map(({ title, description }, i) => (
              <div
                key={title}
                className="card-surface card-hover-lift p-4 sm:p-5"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-brand-100 bg-brand-50">
                  <span className="text-base-plus font-bold leading-none text-brand-700">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mb-1 text-sm-plus font-semibold text-slate-900 dark:text-white">
                  {title}
                </h3>
                <p className="text-sm-plus leading-relaxed text-gray-500 dark:text-slate-400">
                  {description}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-slate-900 p-6 text-center sm:p-8">
            <h2 className="heading-section mb-2 text-white">
              {settings?.donateHowToHeading || "How to Donate"}
            </h2>
            <p className="text-body-muted mx-auto mb-6 max-w-sm text-slate-400">
              {settings?.donateHowToText ||
                (settings?.donateUrl
                  ? "Contact us for bank transfer details or use the online payment link below."
                  : "Contact us for bank transfer details and local payment options.")}
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              {settings?.donateUrl ? (
                <a
                  href={settings.donateUrl}
                  {...EXTERNAL_LINK_PROPS}
                  className="group btn-paypal"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 2.28a.78.78 0 0 1 .77-.65h7.794c2.728 0 4.636.602 5.668 1.79.49.56.802 1.147.952 1.795.157.676.13 1.484-.08 2.47l-.007.045v.387l.277.157c.232.13.442.29.625.472.31.318.524.72.636 1.194.115.483.103 1.056-.036 1.705-.164.76-.428 1.42-.785 1.963a5.09 5.09 0 0 1-1.247 1.39c-.478.365-1.04.64-1.674.82-.617.175-1.32.264-2.09.264h-.497a1.41 1.41 0 0 0-1.393 1.19l-.112.61-.58 3.672-.026.14a.78.78 0 0 1-.77.648z" />
                  </svg>
                  {settings?.donatePayOnlineLabel || "Donate via PayPal"}
                  <OpensInNewTab />
                  <ArrowRight
                    size={14}
                    strokeWidth={2.5}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </a>
              ) : null}
              <Link href="/contact" className="btn-pill-ghost">
                {settings?.donateContactLabel || "Contact Us"}
              </Link>
            </div>
          </div>

          <div className="mt-8 sm:mt-10">
            <div className="mb-5 text-center">
              <p className="text-eyebrow mb-2 flex items-center justify-center gap-2">
                <span className="eyebrow-line" aria-hidden="true" />
                Local Payment Methods
                <span className="eyebrow-line" aria-hidden="true" />
              </p>
              <h2 className="heading-section">
                Donate via Pakistani Payment Methods
              </h2>
              <p className="text-body-muted mx-auto mt-2 max-w-md">
                Use any of these local payment options for easy bank transfers and mobile payments.
              </p>
            </div>
            <DynamicPaymentMethods methods={paymentMethods ?? []} />
          </div>

          <p className="text-caption mt-6 text-center">
            {settings?.donateClosingMessage ||
              "Jazakallah Khair — May Allah (SWT) accept your donations."}
          </p>
        </div>
      </div>
    </div>
  );
}

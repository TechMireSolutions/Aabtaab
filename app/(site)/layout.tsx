import type { ReactNode } from "react";
import { draftMode } from "next/headers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PreviewBanner from "@/components/layout/PreviewBanner";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { getSiteLayoutData } from "@/lib/cms/queries";
import { urlFor } from "@/sanity/lib/image";

export default async function SiteLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { settings, headerNav, footerNav, footerServices } = await getSiteLayoutData();
  const { isEnabled: previewMode } = await draftMode();

  // Extract once — used for both the padding guard and the FAB render
  const whatsappNumber = settings?.whatsapp ?? null;

  // Fetch at 2× the largest display size (52px footer logo on sm+) for Retina sharpness
  const logoUrl = settings?.logo
    ? urlFor(settings.logo).width(104).height(104).url()
    : null;

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Header
        darulQuranUrl={settings?.darulQuranUrl}
        siteName={settings?.siteName}
        logoUrl={logoUrl}
        navItems={headerNav?.items}
        searchPlaceholder={settings?.searchPlaceholder}
      />
      <main
        id="main-content"
        className={`min-h-screen flex flex-col scroll-mt-header ${
          // pb-fab-safe reserves space for the FAB on mobile.
          // lg:pb-0 removes it on desktop where the FAB floats
          // above the footer without overlapping content.
          whatsappNumber ? "pb-fab-safe lg:pb-0" : ""
        }`}
      >
        {children}
      </main>
      <Footer
        settings={settings ?? undefined}
        logoUrl={logoUrl}
        footerNav={footerNav ?? undefined}
        footerServices={footerServices ?? undefined}
      />
      {whatsappNumber && <WhatsAppButton phoneNumber={whatsappNumber} />}
      {previewMode && <PreviewBanner />}
    </>
  );
}

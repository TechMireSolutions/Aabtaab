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
  children: React.ReactNode;
}) {
  const { settings, headerNav, footerServices } = await getSiteLayoutData();
  const { isEnabled: previewMode } = await draftMode();

  const logoUrl = settings?.logo
    ? urlFor(settings.logo).width(72).height(72).url()
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
        className={`min-h-screen scroll-mt-header ${
          settings?.whatsapp ? "pb-fab-safe lg:pb-0" : ""
        }`}
      >
        {children}
      </main>
      <Footer
        settings={settings ?? undefined}
        logoUrl={logoUrl}
        footerServices={footerServices ?? undefined}
      />
      {settings?.whatsapp && <WhatsAppButton number={settings.whatsapp} />}
      {previewMode && <PreviewBanner />}
    </>
  );
}

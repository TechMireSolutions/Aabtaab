import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { sanityFetch, CACHE_TAGS } from "@/sanity/lib/sanityFetch";
import {
  siteSettingsQuery,
  headerNavQuery,
  footerServicesQuery,
} from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

interface LayoutSettings {
  logo?: { asset: { _ref: string } };
  darulQuranUrl?: string;
  siteName?: string;
  searchPlaceholder?: string;
  whatsapp?: string;
  tagline?: string;
  email?: string;
  phone?: string;
  address?: string;
  facebook?: string;
  youtube?: string;
}

interface HeaderNav {
  items?: { label: string; href: string; external?: boolean }[];
}

interface FooterService {
  _id: string;
  title: string;
  slug: string;
}

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, headerNav, footerServices] = await Promise.all([
    sanityFetch<LayoutSettings>({
      query: siteSettingsQuery,
      tags: [CACHE_TAGS.siteSettings],
      revalidate: 86400,
    }),
    sanityFetch<HeaderNav>({
      query: headerNavQuery,
      tags: [CACHE_TAGS.siteSettings],
      revalidate: 86400,
    }),
    sanityFetch<FooterService[]>({
      query: footerServicesQuery,
      tags: [CACHE_TAGS.services],
      revalidate: 3600,
    }),
  ]);

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
        className={`min-h-screen scroll-mt-[68px] ${
          settings?.whatsapp ? "pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-0" : ""
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
    </>
  );
}

import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { resolveSiteName } from "@/lib/constants";
import { env } from "@/lib/env";
import { getSiteSettings } from "@/lib/cms/queries";
import { urlFor } from "@/sanity/lib/image";
import { JsonLd, WebSiteJsonLd } from "@/lib/seo";
import { getSiteUrl } from "@/lib/seo";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

// ── Viewport (separate export — required in Next.js 15) ──────────────────────
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a2e" },
  ],
  colorScheme: "light",
};

// ── Site-level Metadata ──────────────────────────────────────────────────────
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  const siteName = resolveSiteName(settings);
  const siteUrl = settings?.siteUrl || "https://aabtaab.com";
  const description =
    settings?.description ||
    "Shia Islamic knowledge, online courses, and community services for Muslims in the United States.";
  const faviconUrl = settings?.favicon
    ? urlFor(settings.favicon).width(256).height(256).url()
    : undefined;

  // OG image: use logo as fallback if no dedicated OG image in settings
  const ogImageUrl = settings?.logo
    ? urlFor(settings.logo)
        .width(1200)
        .height(630)
        .fit("fill")
        .bg("1a1a2e")
        .url()
    : `${siteUrl}/og-default.png`;

  return {
    // ── Title ───────────────────────────────────────────────────────────────
    // template applies to all child pages: "Article Title | Aabtaab"
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },

    // ── Core meta ───────────────────────────────────────────────────────────
    description,
    keywords: [
      "Shia Islam",
      "Islamic education",
      "Shia Muslim",
      "Quran for kids",
      "Islamic school USA",
      "Shia parenting",
      "online Islamic courses",
      "Muharram events",
      "Shia community United States",
    ],

    // ── Robots ──────────────────────────────────────────────────────────────
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    // ── Canonical / Alternate ────────────────────────────────────────────────
    metadataBase: new URL(siteUrl),

    formatDetection: {
      telephone: false,
      email: false,
      address: false,
    },

    // ── Mobile web app hints ───────────────────────────────────────────────
    appleWebApp: {
      capable: true,
      title: siteName,
      statusBarStyle: "default",
    },
    // Consumed by Facebook, LinkedIn, WhatsApp, Telegram
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteUrl,
      siteName,
      title: siteName,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${siteName} — Shia Islamic Knowledge & Community`,
        },
      ],
    },

    // ── Twitter / X Card ─────────────────────────────────────────────────────
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description,
      site: settings?.twitterHandle || "@aabtaab",
      images: [ogImageUrl],
    },

    // ── Icons ────────────────────────────────────────────────────────────────
    icons: faviconUrl
      ? { icon: faviconUrl, apple: faviconUrl, shortcut: faviconUrl }
      : undefined,

    // ── Verification ─────────────────────────────────────────────────────────
    // Add your Google Search Console verification token to .env.local:
    // NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=xxxx
    ...(env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && {
      verification: {
        google: env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      },
    }),
  };
}

// ── Organization JSON-LD (site-wide structured data) ────────────────────────
// Rendered in <head> on every page.
// schema.org/Organization is the foundation of E-E-A-T trust signals.
async function SiteSchemas() {
  const settings = await getSiteSettings();
  const siteUrl = getSiteUrl();
  const logoUrl = settings?.logo
    ? urlFor(settings.logo).width(600).height(60).url()
    : undefined;

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${siteUrl}/#organization`,
    name: resolveSiteName(settings),
    url: siteUrl,
    description: settings?.description,
    ...(logoUrl && {
      logo: {
        "@type": "ImageObject",
        url: logoUrl,
        width: 600,
        height: 60,
      },
    }),
    ...(settings?.email && { email: settings.email }),
    ...(settings?.phone && { telephone: settings.phone }),
    ...(settings?.phone || settings?.email
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            ...(settings?.phone && { telephone: settings.phone }),
            ...(settings?.email && { email: settings.email }),
            availableLanguage: ["English"],
          },
        }
      : {}),
    ...(settings?.address && {
      address: {
        "@type": "PostalAddress",
        streetAddress: settings.address,
        addressLocality: settings.city,
        addressRegion: settings.state,
        addressCountry: settings.country || "US",
      },
    }),
    sameAs: [settings?.facebook, settings?.youtube].filter(
      Boolean,
    ) as string[],
  };

  return (
    <>
      <JsonLd schema={organizationSchema} />
      <WebSiteJsonLd
        siteName={resolveSiteName(settings)}
        siteUrl={siteUrl}
        description={settings?.description}
      />
    </>
  );
}

// ── Root Layout ──────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
      </head>
      <body
        className={`${jakarta.variable} font-sans antialiased relative`}
        suppressHydrationWarning
      >
        {/* Organization schema injected into every page */}
        <SiteSchemas />
        {children}
      </body>
    </html>
  );
}

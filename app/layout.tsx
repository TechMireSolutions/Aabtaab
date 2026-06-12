import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import {
  sanityFetch,
  fetchSiteSettings,
  type SiteSettings,
} from "@/sanity/lib/sanityFetch";
import { urlFor } from "@/sanity/lib/image";
import { JsonLd } from "@/components/JsonLd";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

// ── Viewport (separate export — required in Next.js 15) ──────────────────────
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1a1a2e",
};

// ── Site-level Metadata ──────────────────────────────────────────────────────
export async function generateMetadata(): Promise<Metadata> {
  const settings: SiteSettings = await fetchSiteSettings();

  const siteName = settings?.siteName || "Aabtaab";
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
    alternates: { canonical: "/" },

    // ── OpenGraph ────────────────────────────────────────────────────────────
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
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && {
      verification: {
        google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      },
    }),
  };
}

// ── Organization JSON-LD (site-wide structured data) ────────────────────────
// Rendered in <head> on every page.
// schema.org/Organization is the foundation of E-E-A-T trust signals.
async function OrganizationSchema() {
  const settings: SiteSettings = await fetchSiteSettings();
  const siteUrl = settings?.siteUrl || "https://aabtaab.com";
  const logoUrl = settings?.logo
    ? urlFor(settings.logo).width(600).height(60).url()
    : undefined;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings?.siteName || "Aabtaab",
    url: siteUrl,
    description: settings?.description,
    ...(logoUrl && { logo: logoUrl }),
    ...(settings?.email && { email: settings.email }),
    ...(settings?.phone && { telephone: settings.phone }),
    ...(settings?.address && {
      address: {
        "@type": "PostalAddress",
        streetAddress: settings.address,
        addressLocality: settings.city,
        addressRegion: settings.state,
        addressCountry: settings.country || "US",
      },
    }),
    sameAs: [
      settings?.facebookUrl,
      settings?.instagramUrl,
      settings?.youtubeUrl,
    ].filter(Boolean) as string[],
  };

  return <JsonLd schema={schema} />;
}

// ── Root Layout ──────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <body
        className={`${jakarta.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        {/* Organization schema injected into every page */}
        <OrganizationSchema />
        {children}
      </body>
    </html>
  );
}

import { Suspense } from "react";
import type { Metadata } from "next";
import { buildPageMetadata, JsonLd, getSiteUrl } from "@/lib/seo";
import { resolveSiteName } from "@/lib/constants";
import { getHomepageHeroData } from "@/lib/cms/queries";
import { ogImageUrl } from "@/sanity/lib/image";
import dynamic from "next/dynamic";
import HomeHero from "@/components/sections/HomeHero";
import HomeSections from "@/components/sections/HomeSections";
import HomeSectionsSkeleton from "@/components/sections/HomeSectionsSkeleton";

const HomeAbout = dynamic(() => import("@/components/sections/HomeAbout"), {
  ssr: true,
});

const UpcomingEventsCountdown = dynamic(() => import("@/components/sections/UpcomingEventsCountdown"), {
  ssr: true,
});

const HomeCountries = dynamic(() => import("@/components/sections/HomeCountries"), {
  ssr: true,
});

export async function generateMetadata(): Promise<Metadata> {
  const { settings, homepage: hp } = await getHomepageHeroData();
  const ogImage =
    (hp?.heroImage ? ogImageUrl(hp.heroImage) : undefined) ??
    (settings?.logo ? ogImageUrl(settings.logo) : undefined);

  return buildPageMetadata({
    title: resolveSiteName(settings),
    description:
      settings?.description ||
      "Shia Islamic knowledge, online courses, and community services for Muslims worldwide.",
    path: "/",
    absoluteTitle: true,
    ogImage,
  });
}

export default async function HomePage() {
  const { settings, homepage: hp, quotes, courseCount, scholarCount, countryCount } = await getHomepageHeroData();
  const siteName = resolveSiteName(settings);
  const siteUrl = getSiteUrl();

  return (
    <>
      <JsonLd
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": `${siteUrl}/#webpage`,
          url: siteUrl,
          name: siteName,
          description: settings?.description || hp?.heroSubtitle,
          isPartOf: { "@id": `${siteUrl}/#organization` },
          inLanguage: "en-US",
        }}
      />
      <HomeHero settings={settings} homepage={hp} siteName={siteName} courseCount={courseCount} />
      <Suspense fallback={null}>
        <UpcomingEventsCountdown />
      </Suspense>
      <HomeAbout 
        homepage={hp} 
        quotes={quotes} 
        scholarCount={scholarCount} 
        countryCount={countryCount} 
      />
      <Suspense fallback={null}>
        <HomeCountries />
      </Suspense>
      <Suspense fallback={<HomeSectionsSkeleton />}>
        <HomeSections />
      </Suspense>
    </>
  );
}

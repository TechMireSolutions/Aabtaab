import { Suspense } from "react";
import type { Metadata } from "next";
import { buildPageMetadata, JsonLd, getSiteUrl } from "@/lib/seo";
import { resolveSiteName } from "@/lib/constants";
import { getHomepageHeroData } from "@/lib/cms/queries";
import { ogImageUrl } from "@/sanity/lib/image";
import HomeHero from "@/components/home/HomeHero";
import HomeSections from "@/components/home/HomeSections";
import HomeSectionsSkeleton from "@/components/home/HomeSectionsSkeleton";
import HomeHeroSkeleton from "@/components/home/HomeHeroSkeleton";

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

async function HomeHeroBlock() {
  const { settings, homepage: hp } = await getHomepageHeroData();
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
      <HomeHero settings={settings} homepage={hp} siteName={siteName} />
    </>
  );
}

export default function HomePage() {
  return (
    <>
      <Suspense fallback={<HomeHeroSkeleton />}>
        <HomeHeroBlock />
      </Suspense>
      <Suspense fallback={<HomeSectionsSkeleton />}>
        <HomeSections />
      </Suspense>
    </>
  );
}

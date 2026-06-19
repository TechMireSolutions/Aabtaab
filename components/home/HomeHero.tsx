import { urlFor } from "@/sanity/lib/image";
import HeroSection from "@/components/sections/HeroSection";
import type { HomepageSettings } from "@/types/homepage";
import type { SiteSettings } from "@/types/sanity";

interface HomeHeroProps {
  settings: SiteSettings | null;
  homepage: HomepageSettings | null;
  siteName: string;
}

export default function HomeHero({
  settings,
  homepage: hp,
  siteName,
}: HomeHeroProps) {
  const heroImageUrl = hp?.heroImage
    ? urlFor(hp.heroImage).width(1200).height(700).url()
    : null;

  return (
    <HeroSection
      siteName={siteName}
      subtitle={hp?.heroArabicText || undefined}
      title={hp?.heroTitle ? hp.heroTitle.replace(/\\n/g, "\n") : undefined}
      description={hp?.heroSubtitle || settings?.description || undefined}
      heroImage={heroImageUrl}
      heroImageAlt={hp?.heroTitle?.replace(/\\n/g, " ") || siteName}
      cta1Label={hp?.heroCta1Label || undefined}
      cta1Link={hp?.heroCta1Link || undefined}
      cta2Label={hp?.heroCta2Label || undefined}
      cta2Link={hp?.heroCta2Link || undefined}
    />
  );
}

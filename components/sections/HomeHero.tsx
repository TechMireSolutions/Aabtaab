import { urlFor } from "@/sanity/lib/image";
import HeroSection from "@/components/sections/HeroSection";
import type { HomepageSettings } from "@/types/homepage";
import type { SiteSettings } from "@/types/site-settings";
import { sanitizePublicCopy } from "@/lib/fallbacks/cms-copy";

interface HomeHeroProps {
  settings: SiteSettings | null;
  homepage: HomepageSettings | null;
  siteName: string;
  courseCount?: number;
  scholarCount?: number;
}

export default function HomeHero({
  settings,
  homepage: hp,
  siteName,
  courseCount,
  scholarCount,
}: HomeHeroProps) {
  const heroImageUrl = hp?.heroImage
    ? urlFor(hp.heroImage).width(1200).height(700).url()
    : null;

  const cta1Label = hp?.heroCta1Label || "Explore Courses";
  const cta1Link = "/online-courses";

  return (
    <HeroSection
      siteName={siteName}
      subtitle={hp?.heroArabicText || undefined}
      title={hp?.heroTitle ? hp.heroTitle.replace(/\\n/g, "\n") : undefined}
      description={sanitizePublicCopy(
        hp?.heroSubtitle || settings?.description || undefined,
      )}
      heroImage={heroImageUrl}
      heroImageAlt={hp?.heroTitle?.replace(/\\n/g, " ") || siteName}
      enrollingBadge={hp?.heroBadgeText || undefined}
      cta1Label={cta1Label}
      cta1Link={cta1Link}
      cta2Label={hp?.heroCta2Label || undefined}
      cta2Link={hp?.heroCta2Link || undefined}
      courseCount={courseCount}
      scholarCount={scholarCount}
      studentStat={hp?.aboutStat1Value}
      studentLabel={hp?.aboutStat1Label}
    />
  );
}

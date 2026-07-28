import CatalogDarkHero from "@/components/content/CatalogDarkHero";

interface ServiceHeroSectionProps {
  title: string;
  price?: string;
  heroSubtitle?: string;
  heroBody?: string;
  excerpt?: string;
  imageUrl?: string | null;
}

export default function ServiceHeroSection({
  title,
  price,
  heroSubtitle,
  heroBody,
  excerpt,
  imageUrl,
}: ServiceHeroSectionProps) {
  const bodyText = heroBody || (!heroSubtitle && excerpt ? excerpt : undefined);

  return (
    <CatalogDarkHero title={title} imageSrc={imageUrl} imageAlt={title} compact>
      {price && <span className="badge-hero mb-6 inline-block">{price}</span>}
      <h1 className="text-hero mb-5 text-white">{title}</h1>
      {heroSubtitle && (
        <p className="mb-4 text-base-plus font-semibold leading-relaxed text-white/90 sm:text-lg-plus">
          {heroSubtitle}
        </p>
      )}
      {bodyText && (
        <p className="mx-auto max-w-copy text-base-plus leading-relaxed text-slate-300">
          {bodyText}
        </p>
      )}
    </CatalogDarkHero>
  );
}

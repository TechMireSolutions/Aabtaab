import Image from "next/image";

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
    <section className="relative flex min-h-hero-compact items-center justify-center overflow-hidden bg-slate-900">
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="100vw"
          className="object-cover opacity-hero-image"
          priority
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-slate-900/60 via-transparent to-slate-900/80" />
      <div className="container-content relative py-20 text-center sm:py-28">
        {price && <span className="badge-hero mb-6 inline-block">{price}</span>}
        <h1 className="text-hero mb-5 text-white">{title}</h1>
        {heroSubtitle && (
          <p className="mb-4 text-base-plus font-semibold leading-relaxed text-white/90 sm:text-lg-plus">
            {heroSubtitle}
          </p>
        )}
        {bodyText && (
          <p className="mx-auto max-w-2xl text-base-plus leading-relaxed text-slate-300">
            {bodyText}
          </p>
        )}
      </div>
    </section>
  );
}

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
    <section className="relative bg-slate-900 overflow-hidden min-h-[340px] flex items-center justify-center">
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="100vw"
          className="object-cover opacity-[0.18]"
          priority
        />
      )}
      <div className="absolute inset-0 bg-linear-to-b from-slate-900/60 via-transparent to-slate-900/80 pointer-events-none" />
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
        {price && (
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] text-cyan-400 border border-cyan-700/60 rounded-full px-3.5 py-1 bg-cyan-950/40 mb-6">
            {price}
          </span>
        )}
        <h1 className="font-bold text-[36px] sm:text-[50px] text-white tracking-[-0.03em] leading-[1.1] mb-5">
          {title}
        </h1>
        {heroSubtitle && (
          <p className="text-[16px] sm:text-[18px] font-semibold text-white/90 mb-4 leading-relaxed">
            {heroSubtitle}
          </p>
        )}
        {bodyText && (
          <p className="text-[15px] text-slate-300 max-w-2xl mx-auto leading-[1.85]">
            {bodyText}
          </p>
        )}
      </div>
    </section>
  );
}

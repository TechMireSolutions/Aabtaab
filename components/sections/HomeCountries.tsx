import { Globe2 } from "lucide-react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import type { Country } from "@/types/country";

function getFlagEmoji(flagStr: string) {
  if (!flagStr) return "";
  const trimmed = flagStr.trim();
  if (/^[a-zA-Z]{2}$/.test(trimmed)) {
    return trimmed
      .toUpperCase()
      .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397));
  }
  return trimmed;
}

// Fallback letters if flags don't render on some OS (like Windows)
function getCountryCode(flagStr: string) {
  if (!flagStr) return "";
  const trimmed = flagStr.trim();
  if (/^[a-zA-Z]{2}$/.test(trimmed)) {
    return trimmed.toUpperCase();
  }
  return trimmed.substring(0, 2).toUpperCase();
}

export default function HomeCountries({
  countries,
}: {
  countries: Country[];
}) {
  if (countries.length === 0) return null;

  const isSmallList = countries.length < 5;
  
  // Only duplicate for marquee if we have enough variety (don't repeat 1 country 15 times)
  let displayCountries = [...countries];
  if (!isSmallList) {
    while (displayCountries.length < 15) {
      displayCountries = [...displayCountries, ...countries];
    }
  }

  const renderCountryCard = (country: Country, key: string) => (
    <div
      key={key}
      className="flex items-center gap-4 px-6 py-4 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-white dark:border-slate-800 shadow-xl shadow-brand-900/5 rounded-3xl transition-transform hover:-translate-y-1"
    >
      {country.flagImage ? (
        <div className="relative h-8 w-11 shrink-0 overflow-hidden rounded-[4px] shadow-sm ring-1 ring-black/10 dark:ring-white/10">
          <Image
            src={urlFor(country.flagImage).width(120).height(80).url()}
            alt={`${country.name} Flag`}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-brand-400 to-brand-600 shadow-inner text-white text-lg font-bold overflow-hidden">
          <span title={getCountryCode(country.flagIcon ?? country.name)}>
            {getFlagEmoji(country.flagIcon ?? country.name)}
          </span>
        </div>
      )}
      <span className="font-bold text-slate-800 dark:text-slate-200 text-lg pr-2">
        {country.name}
      </span>
    </div>
  );

  return (
    <section className="relative overflow-hidden bg-slate-50 dark:bg-slate-950 py-24 sm:py-32">
      {/* Premium Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[80rem] h-[40rem] bg-brand-500/10 dark:bg-brand-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Subtle globe overlay in background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] dark:opacity-[0.02]">
        <Globe2 className="w-[120vw] h-[120vw] max-w-[80rem] max-h-[80rem] text-brand-900 dark:text-white" />
      </div>

      <div className="container-narrow relative z-10 text-center mb-16">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-3xl bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 mb-6 shadow-sm">
          <Globe2 className="h-8 w-8" />
        </div>
        <h2 className="heading-section-lg mb-6">
          Serving Students Worldwide
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          We proudly provide authentic Islamic education to families across the globe. Join our growing international community.
        </p>
      </div>

      <div className="relative z-10 w-full overflow-hidden px-4">
        {isSmallList ? (
          <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
            {countries.map((country, idx) => 
              renderCountryCard(country, `orig-${country._id}-${idx}`)
            )}
          </div>
        ) : (
          <div className="relative flex overflow-hidden group">
            <div className="animate-marquee flex min-w-full shrink-0 items-center justify-around gap-6 pr-6 group-hover:pause">
              {displayCountries.map((country, idx) => 
                renderCountryCard(country, `marquee-1-${country._id}-${idx}`)
              )}
            </div>
            <div className="animate-marquee flex min-w-full shrink-0 items-center justify-around gap-6 pr-6 group-hover:pause" aria-hidden="true">
              {displayCountries.map((country, idx) => 
                renderCountryCard(country, `marquee-2-${country._id}-${idx}`)
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

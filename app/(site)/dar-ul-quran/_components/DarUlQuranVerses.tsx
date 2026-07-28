import { AlertCircle, BookMarked } from "lucide-react";
import { SHIA_INSIGHTS, type Ayah } from "@/lib/fallbacks/dar-ul-quran";

interface DarUlQuranVersesProps {
  selectedSurah: number;
  selectedAyah: number;
  arabicVerses: Ayah[];
  englishVerses: Ayah[];
  loading: boolean;
  error: string;
  expandedTafsir: number | null;
  setExpandedTafsir: (value: number | null | ((prev: number | null) => number | null)) => void;
}

export default function DarUlQuranVerses({
  selectedSurah,
  selectedAyah,
  arabicVerses,
  englishVerses,
  loading,
  error,
  expandedTafsir,
  setExpandedTafsir,
}: DarUlQuranVersesProps) {
  if (loading) {
    return (
      <div className="card-glass flex flex-col items-center justify-center py-24 text-center">
        <div className="animate-spin rounded-full border-4 border-brand-500 border-t-transparent size-8" />
        <p className="text-sm-plus text-gray-500 mt-4">
          Retrieving holy script...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50/50 p-5 text-center text-red-700">
        <AlertCircle className="mx-auto mb-2" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="card-glass p-6 sm:p-8 space-y-8">
      {selectedSurah !== 9 && selectedAyah === 0 && (
        <div className="text-center border-b border-gray-100 dark:border-slate-800 pb-6">
          <p
            className="font-arabic text-3xl text-slate-900 dark:text-white leading-loose"
            dir="rtl"
            lang="ar"
          >
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </p>
          <p className="text-xs-plus uppercase tracking-widest text-gold-600 mt-2 font-semibold">
            In the Name of Allah, the Beneficent, the Merciful
          </p>
        </div>
      )}

      <div className="divide-y divide-gray-100 dark:divide-slate-800/60">
        {arabicVerses
          .filter(
            (v) => selectedAyah === 0 || v.numberInSurah === selectedAyah,
          )
          .map((verse, index) => {
            const engVerse = englishVerses.find(
              (ev) => ev.numberInSurah === verse.numberInSurah,
            );
            const verseKey = `${selectedSurah}:${verse.numberInSurah}`;
            const isShiaVerse = SHIA_INSIGHTS.some((i) => i.key === verseKey);
            const insight = SHIA_INSIGHTS.find((i) => i.key === verseKey);

            return (
              <div
                key={verse.number}
                className={`py-6 flex flex-col ${index === 0 ? "pt-0" : ""}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="flex size-7 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {verse.numberInSurah}
                  </span>
                  {isShiaVerse && (
                    <button
                      onClick={() =>
                        setExpandedTafsir((prev) =>
                          prev === verse.numberInSurah
                            ? null
                            : verse.numberInSurah,
                        )
                      }
                      className={`badge-pill cursor-pointer text-2xs uppercase tracking-wider font-bold transition-all ${
                        expandedTafsir === verse.numberInSurah
                          ? "bg-gold-500 text-white border-gold-600"
                          : "bg-gold-100/70 dark:bg-gold-950/20 border-gold-200 dark:border-gold-800/40 text-gold-600 dark:text-gold-400"
                      }`}
                    >
                      {expandedTafsir === verse.numberInSurah
                        ? "Hide Tafsir"
                        : "Tafsir Available"}
                    </button>
                  )}
                </div>

                <p
                  className="font-arabic text-2xl sm:text-3xl text-right text-slate-900 dark:text-white leading-loose mb-4 select-all"
                  dir="rtl"
                  lang="ar"
                >
                  {verse.text}
                </p>

                {engVerse && (
                  <p className="text-sm-plus leading-relaxed text-slate-700 dark:text-slate-300 select-all border-l-2 border-brand-500/20 pl-4">
                    {engVerse.text}
                  </p>
                )}

                {expandedTafsir === verse.numberInSurah &&
                  isShiaVerse &&
                  insight && (
                    <div className="mt-4 rounded-2xl border border-gold-500/20 bg-gold-50/30 dark:bg-gold-950/10 p-4 sm:p-5 motion-safe:animate-scale-in text-slate-900 dark:text-slate-100">
                      <div className="flex items-start gap-2.5">
                        <BookMarked
                          className="text-gold-600 dark:text-gold-400 mt-0.5 shrink-0"
                          size={18}
                        />
                        <div>
                          <h4 className="font-display font-bold text-sm-plus text-gold-700 dark:text-gold-400">
                            {insight.title}
                          </h4>
                          <p className="text-2xs text-gold-600/70 dark:text-gold-400/60 uppercase tracking-widest mt-0.5 font-bold">
                            {insight.source}
                          </p>
                          <p className="text-sm-plus leading-relaxed text-slate-700 dark:text-slate-300 mt-3 border-t border-gold-500/10 pt-2.5">
                            {insight.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            );
          })}
      </div>
    </div>
  );
}

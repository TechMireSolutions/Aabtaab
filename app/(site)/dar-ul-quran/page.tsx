"use client";

import { useEffect, useState, useTransition } from "react";
import { BookOpen, AlertCircle, BookMarked, HelpCircle } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
}

interface Ayah {
  number: number;
  audio: string;
  audioSecondary: string[];
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean;
}

// Built-in Shia Tafsir for key verses
const SHIA_TAFSIR: Record<string, { title: string; verse: string; text: string }> = {
  "5:55": {
    title: "Ayah of Wilayah (Verse of Leadership)",
    verse: "Surah Al-Ma'idah (5:55)",
    text: "Revealed when Imam Ali (A.S.) gave his ring to a beggar as charity (Zakat) while bowing down in prayer (Ruku). Scholars of Tafsir (both Shia and Sunni, e.g., Tafsir al-Mizan, al-Tabari) record this verse as definitive proof of the Wilayah (divine authority and leadership) of Imam Ali (A.S.) succeeding the Prophet (S.A.W.W.).",
  },
  "33:33": {
    title: "Ayah of Tatheer (Verse of Purification)",
    verse: "Surah Al-Ahzab (33:33)",
    text: "Refers specifically to the Ahlul Bayt (A.S.) — Prophet Muhammad (S.A.W.W.), Imam Ali (A.S.), Sayyida Fatima (S.A.), Imam Hasan (A.S.), and Imam Husayn (A.S.) under the Cloak (Hadith al-Kisa). The verse confirms their divine purification and absolute infallibility (Ismah) from all forms of spiritual impurity or sin.",
  },
  "3:61": {
    title: "Ayah of Mubahalah (Verse of Mutual Imprecation)",
    verse: "Surah Aal-Imran (3:61)",
    text: "Revealed during the debate with the Christians of Najran. The Prophet (S.A.W.W.) brought Imam Hasan and Imam Husayn (A.S.) as his 'sons', Sayyida Fatima (S.A.) as his 'women', and Imam Ali (A.S.) as his 'self' (nafs). This highlights the elevated status of the Ahlul Bayt (A.S.) as equal to the Prophet's own soul.",
  },
  "42:23": {
    title: "Ayah of Mawaddah (Verse of Love)",
    verse: "Surah Ash-Shura (42:23)",
    text: "Commanding the Muslims to offer love and devotion to the Prophet's close relatives (Ahlul Bayt) as the sole recompense for his propagation of the message of Islam. This love is a prerequisite for faith and spiritual guidance.",
  },
};

const COMMON_SURAHS = [
  { number: 1, name: "الفاتحة", englishName: "Al-Fatiha", numberOfAyahs: 7 },
  { number: 36, name: "يس", englishName: "Yaseen", numberOfAyahs: 83 },
  { number: 55, name: "الرحمن", englishName: "Ar-Rahman", numberOfAyahs: 78 },
  { number: 56, name: "الواقعة", englishName: "Al-Waqi'ah", numberOfAyahs: 96 },
  { number: 67, name: "الملك", englishName: "Al-Mulk", numberOfAyahs: 30 },
  { number: 112, name: "الإخلاص", englishName: "Al-Ikhlaas", numberOfAyahs: 4 },
];

export default function DarUlQuranPage() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<number>(1);
  const [selectedAyah, setSelectedAyah] = useState<number>(0); // 0 means all ayahs
  const [arabicVerses, setArabicVerses] = useState<Ayah[]>([]);
  const [englishVerses, setEnglishVerses] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [, startTransition] = useTransition();

  const [prevSurah, setPrevSurah] = useState(selectedSurah);
  if (selectedSurah !== prevSurah) {
    setPrevSurah(selectedSurah);
    setLoading(true);
    setError("");
  }

  // Fetch Surahs list
  useEffect(() => {
    async function fetchSurahs() {
      try {
        const res = await fetch("https://api.alquran.cloud/v1/surah");
        if (res.ok) {
          const data = await res.json();
          setSurahs(data.data);
        } else {
          // fallback to common list if offline
          setSurahs(COMMON_SURAHS as Surah[]);
        }
      } catch {
        setSurahs(COMMON_SURAHS as Surah[]);
      }
    }
    fetchSurahs();
  }, []);

  // Fetch selected Surah content (Arabic & English Shakir)
  useEffect(() => {
    startTransition(async () => {
      try {
        const [arabicRes, englishRes] = await Promise.all([
          fetch(`https://api.alquran.cloud/v1/surah/${selectedSurah}/quran-uthmani`),
          fetch(`https://api.alquran.cloud/v1/surah/${selectedSurah}/en.shakir`),
        ]);

        if (arabicRes.ok && englishRes.ok) {
          const arabicData = await arabicRes.json();
          const englishData = await englishRes.json();
          setArabicVerses(arabicData.data.ayahs);
          setEnglishVerses(englishData.data.ayahs);
        } else {
          setError("Failed to fetch surah content from the public Quran database.");
        }
      } catch {
        setError("Network error. Please check your connection and try again.");
      } finally {
        setLoading(false);
      }
    });
  }, [selectedSurah]);

  const activeSurahDetails = surahs.find((s) => s.number === selectedSurah);
  const keyTafsir = selectedAyah > 0 ? SHIA_TAFSIR[`${selectedSurah}:${selectedAyah}`] : null;

  return (
    <div>
      <PageHeader
        eyebrow="Affiliated with Dar ul Quran"
        title="Dar ul Quran Reader"
        subtitle="Explore the Quranic verses with authentic Shakir English translation and Shia Tafsir insights."
        maxWidth="lg"
      />

      <div className="section-muted min-h-screen">
        <div className="container-page">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Selector panel */}
            <div className="lg:col-span-4 space-y-4">
              <div className="card-glass p-5">
                <h3 className="text-base-plus font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <BookOpen size={16} className="text-brand-600 dark:text-brand-400" />
                  Select Scripture
                </h3>

                <div className="space-y-3.5">
                  <div>
                    <label className="text-caption font-semibold mb-1 block">Surah (Chapter)</label>
                    <select
                      value={selectedSurah}
                      onChange={(e) => {
                        setSelectedSurah(Number(e.target.value));
                        setSelectedAyah(0); // Reset ayah selection
                      }}
                      className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 text-sm-plus text-slate-700 dark:text-slate-300 focus:border-brand-600 focus:outline-none"
                    >
                      {surahs.length === 0 ? (
                        <option>Loading Surahs...</option>
                      ) : (
                        surahs.map((surah) => (
                          <option key={surah.number} value={surah.number}>
                            {surah.number}. {surah.englishName} ({surah.name})
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="text-caption font-semibold mb-1 block">Ayah (Verse)</label>
                    <select
                      value={selectedAyah}
                      onChange={(e) => setSelectedAyah(Number(e.target.value))}
                      className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 text-sm-plus text-slate-700 dark:text-slate-300 focus:border-brand-600 focus:outline-none"
                    >
                      <option value={0}>Show Full Surah</option>
                      {activeSurahDetails &&
                        Array.from({ length: activeSurahDetails.numberOfAyahs }).map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            Verse {i + 1}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Shia Tafsir Insight Widget */}
              {keyTafsir ? (
                <div className="rounded-3xl border border-gold-500/30 bg-gold-950/20 dark:bg-gold-950/10 p-5 shadow-sm text-slate-900 dark:text-slate-100">
                  <div className="flex items-start gap-2.5">
                    <BookMarked className="text-gold-500 mt-0.5 shrink-0" size={18} />
                    <div>
                      <h4 className="font-display font-bold text-sm-plus text-gold-600 dark:text-gold-400">
                        {keyTafsir.title}
                      </h4>
                      <p className="text-2xs text-gold-600/70 dark:text-gold-400/60 uppercase tracking-widest mt-0.5 font-bold">
                        {keyTafsir.verse}
                      </p>
                      <p className="text-sm-plus leading-relaxed text-slate-700 dark:text-slate-300 mt-3 border-t border-gold-500/10 pt-2.5">
                        {keyTafsir.text}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-gray-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/10 p-5 text-center text-sm-plus text-gray-400 dark:text-slate-500">
                  <HelpCircle className="mx-auto text-gray-300 dark:text-slate-700 mb-2" size={24} />
                  Select verse 5:55, 33:33, 3:61, or 42:23 to view Shia Tafsir insights.
                </div>
              )}
            </div>

            {/* Right Column: Verses display */}
            <div className="lg:col-span-8 space-y-4">
              {loading ? (
                <div className="card-glass flex flex-col items-center justify-center py-24 text-center">
                  <div className="animate-spin rounded-full border-4 border-brand-500 border-t-transparent size-8" />
                  <p className="text-sm-plus text-gray-500 mt-4">Retrieving holy script...</p>
                </div>
              ) : error ? (
                <div className="rounded-2xl border border-red-100 bg-red-50/50 p-5 text-center text-red-700">
                  <AlertCircle className="mx-auto mb-2" />
                  <p>{error}</p>
                </div>
              ) : (
                <div className="card-glass p-6 sm:p-8 space-y-8">
                  {/* Bismillah header (except for Surah 9) */}
                  {selectedSurah !== 9 && selectedAyah === 0 && (
                    <div className="text-center border-b border-gray-100 dark:border-slate-800 pb-6">
                      <p className="font-serif text-3xl text-slate-900 dark:text-white leading-loose" dir="rtl" lang="ar">
                        بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
                      </p>
                      <p className="text-xs-plus uppercase tracking-widest text-gold-600 mt-2 font-semibold">
                        In the Name of Allah, the Beneficent, the Merciful
                      </p>
                    </div>
                  )}

                  <div className="divide-y divide-gray-100 dark:divide-slate-800/60">
                    {arabicVerses
                      .filter((v) => selectedAyah === 0 || v.numberInSurah === selectedAyah)
                      .map((verse, index) => {
                        const engVerse = englishVerses.find((ev) => ev.numberInSurah === verse.numberInSurah);
                        const isShiaVerse = SHIA_TAFSIR[`${selectedSurah}:${verse.numberInSurah}`] !== undefined;

                        return (
                          <div
                            key={verse.number}
                            className={`py-6 flex flex-col ${
                              index === 0 ? "pt-0" : ""
                            }`}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <span className="flex size-7 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
                                {verse.numberInSurah}
                              </span>
                              {isShiaVerse && (
                                <button
                                  onClick={() => setSelectedAyah(verse.numberInSurah)}
                                  className="badge-pill bg-gold-100/70 dark:bg-gold-950/20 border-gold-200 dark:border-gold-800/40 text-gold-600 dark:text-gold-400 cursor-pointer text-2xs uppercase tracking-wider font-bold"
                                >
                                  Tafsir Available
                                </button>
                              )}
                            </div>

                            <p className="font-serif text-2xl sm:text-3xl text-right text-slate-900 dark:text-white leading-loose mb-4 select-all" dir="rtl" lang="ar">
                              {verse.text}
                            </p>

                            {engVerse && (
                              <p className="text-sm-plus leading-relaxed text-slate-700 dark:text-slate-300 select-all border-l-2 border-brand-500/20 pl-4">
                                {engVerse.text}
                              </p>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

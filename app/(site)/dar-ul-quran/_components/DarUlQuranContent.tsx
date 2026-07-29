"use client";

import { BookOpen } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { useDarUlQuran } from "./useDarUlQuran";
import DarUlQuranInsight from "./DarUlQuranInsight";
import DarUlQuranVerses from "./DarUlQuranVerses";

export default function DarUlQuranContent() {
  const {
    surahs,
    selectedSurah,
    setSelectedSurah,
    selectedAyah,
    setSelectedAyah,
    arabicVerses,
    englishVerses,
    loading,
    error,
    expandedTafsir,
    setExpandedTafsir,
    activeInsight,
    activeSurahDetails,
  } = useDarUlQuran();

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
            <div className="lg:col-span-4 space-y-4">
              <div className="card-glass p-5">
                <h3 className="text-base-plus font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <BookOpen
                    size={16}
                    className="text-brand-600 dark:text-brand-400"
                  />
                  Select Scripture
                </h3>

                <div className="space-y-3.5">
                  <div>
                    <label
                      htmlFor="surah-select"
                      className="text-caption font-semibold mb-1 block"
                    >
                      Surah (Chapter)
                    </label>
                    <select
                      id="surah-select"
                      value={selectedSurah}
                      onChange={(e) => {
                        setSelectedSurah(Number(e.target.value));
                        setSelectedAyah(0);
                      }}
                      className="select-field p-2.5"
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
                    <label
                      htmlFor="ayah-select"
                      className="text-caption font-semibold mb-1 block"
                    >
                      Ayah (Verse)
                    </label>
                    <select
                      id="ayah-select"
                      value={selectedAyah}
                      onChange={(e) => setSelectedAyah(Number(e.target.value))}
                      className="select-field p-2.5"
                    >
                      <option value={0}>Show Full Surah</option>
                      {activeSurahDetails &&
                        Array.from({
                          length: activeSurahDetails.numberOfAyahs,
                        }).map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            Verse {i + 1}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>

              <DarUlQuranInsight insight={activeInsight} />
            </div>

            <div className="lg:col-span-8 space-y-4">
              <DarUlQuranVerses
                selectedSurah={selectedSurah}
                selectedAyah={selectedAyah}
                arabicVerses={arabicVerses}
                englishVerses={englishVerses}
                loading={loading}
                error={error}
                expandedTafsir={expandedTafsir}
                setExpandedTafsir={setExpandedTafsir}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

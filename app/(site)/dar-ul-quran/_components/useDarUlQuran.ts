"use client";

import { useEffect, useState, useTransition } from "react";
import {
  SHIA_INSIGHTS,
  COMMON_SURAHS,
  type Surah,
  type Ayah,
  type ShiaInsight,
} from "@/lib/fallbacks/dar-ul-quran";

export function useDarUlQuran() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState(1);
  const [selectedAyah, setSelectedAyah] = useState(0);
  const [arabicVerses, setArabicVerses] = useState<Ayah[]>([]);
  const [englishVerses, setEnglishVerses] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [, startTransition] = useTransition();
  const [expandedTafsir, setExpandedTafsir] = useState<number | null>(null);
  const [activeInsight, setActiveInsight] = useState<ShiaInsight | null>(null);

  const [prevSurah, setPrevSurah] = useState(selectedSurah);
  if (selectedSurah !== prevSurah) {
    setPrevSurah(selectedSurah);
    setLoading(true);
    setError("");
    setExpandedTafsir(null);
  }

  const [prevAyah, setPrevAyah] = useState(selectedAyah);
  if (selectedAyah !== prevAyah) {
    setPrevAyah(selectedAyah);
    setExpandedTafsir(null);
    const verseKey = `${selectedSurah}:${selectedAyah}`;
    const verseInsight = SHIA_INSIGHTS.find((i) => i.key === verseKey);
    if (verseInsight) {
      setActiveInsight(verseInsight);
    } else if (activeInsight?.key) {
      setActiveInsight(SHIA_INSIGHTS.find((i) => !i.key) || null);
    }
  }

  useEffect(() => {
    async function fetchSurahs() {
      try {
        const storage =
          typeof window !== "undefined" ? window.localStorage : null;
        const cached = storage?.getItem("aabtaab:surahs");
        if (cached) {
          setSurahs(JSON.parse(cached));
        }
      } catch (e) {
        console.error("Failed to read surahs from localStorage", e);
      }

      try {
        const res = await fetch("https://api.alquran.cloud/v1/surah");
        if (res.ok) {
          const data = await res.json();
          setSurahs(data.data);
          try {
            const storage =
              typeof window !== "undefined" ? window.localStorage : null;
            storage?.setItem("aabtaab:surahs", JSON.stringify(data.data));
          } catch (e) {
            console.error("Failed to save surahs to localStorage", e);
          }
        } else {
          setSurahs((prev) =>
            prev.length > 0 ? prev : (COMMON_SURAHS as Surah[]),
          );
        }
      } catch {
        setSurahs((prev) =>
          prev.length > 0 ? prev : (COMMON_SURAHS as Surah[]),
        );
      }
    }
    fetchSurahs();
  }, []);

  useEffect(() => {
    startTransition(async () => {
      try {
        const storage =
          typeof window !== "undefined" ? window.localStorage : null;
        const cached = storage?.getItem(`aabtaab:surah:${selectedSurah}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (
            parsed &&
            Array.isArray(parsed.arabic) &&
            Array.isArray(parsed.english)
          ) {
            setArabicVerses(parsed.arabic);
            setEnglishVerses(parsed.english);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.error("Failed to read cached surah from localStorage", e);
      }

      try {
        const [arabicRes, englishRes] = await Promise.all([
          fetch(
            `https://api.alquran.cloud/v1/surah/${selectedSurah}/quran-uthmani`,
          ),
          fetch(
            `https://api.alquran.cloud/v1/surah/${selectedSurah}/en.shakir`,
          ),
        ]);

        if (arabicRes.ok && englishRes.ok) {
          const arabicData = await arabicRes.json();
          const englishData = await englishRes.json();
          const arabicAyahs = arabicData.data.ayahs;
          const englishAyahs = englishData.data.ayahs;

          setArabicVerses(arabicAyahs);
          setEnglishVerses(englishAyahs);

          try {
            const storage =
              typeof window !== "undefined" ? window.localStorage : null;
            storage?.setItem(
              `aabtaab:surah:${selectedSurah}`,
              JSON.stringify({ arabic: arabicAyahs, english: englishAyahs }),
            );
          } catch (e) {
            console.error("Failed to save surah content to localStorage", e);
          }
        } else {
          setError(
            "Failed to fetch surah content from the public Quran database.",
          );
        }
      } catch {
        setError("Network error. Please check your connection and try again.");
      } finally {
        setLoading(false);
      }
    });
  }, [selectedSurah]);

  useEffect(() => {
    if (!activeInsight) {
      const nonVerseSpecific = SHIA_INSIGHTS.filter((i) => !i.key);
      const randomIndex = Math.floor(Math.random() * nonVerseSpecific.length);
      const timer = setTimeout(() => {
        setActiveInsight(nonVerseSpecific[randomIndex]);
      }, 0);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeSurahDetails = surahs.find((s) => s.number === selectedSurah);

  return {
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
  };
}

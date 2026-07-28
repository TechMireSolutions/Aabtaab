import type { QuoteItem } from "@/types/quote";

/** Homepage hadith carousel when CMS quotes are empty. */
export const FALLBACK_QUOTES: QuoteItem[] = [
  {
    arabic:
      "إِنَّ الْقَلْبَ الْحَدَثَ كَالأَرْضِ الْخَالِيَةِ مَا أُلْقِيَ فِيهَا مِنْ شَيْءٍ قَبِلَتْهُ",
    translation:
      "Indeed, the heart of a youth is like uncultivated land; whatever is sown in it, it accepts.",
    attribution: "Imam Ali (A.S.)",
    reference: "Nahjul Balagha, Letter 31",
  },
  {
    arabic:
      "طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ، أَلَا إِنَّ اللَّهَ يُحِبُّ بُغَاةَ الْعِلْمِ",
    translation:
      "The acquisition of knowledge is a duty upon every Muslim; indeed Allah loves the seekers of knowledge.",
    attribution: "Imam Ja'far al-Sadiq (A.S.)",
    reference: "Al-Kafi, Vol 1, Page 30",
  },
  {
    arabic: "شَهْرُ رَمَضَانَ الَّذِي أُنزِلَ فِيهِ الْقُرْآنُ هُدًى لِّلنَّاسِ",
    translation:
      "The month of Ramadhan [is that] in which was revealed the Qur'an, a guidance for the people.",
    attribution: "Quran",
    reference: "Surah Al-Baqarah (2:185)",
  },
];

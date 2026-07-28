/** Static Dar Ul Quran insights and common surah shortcuts (not CMS). */

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
}

export interface Ayah {
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

export interface ShiaInsight {
  key?: string; // e.g., "5:55" for verse-specific tafsir
  type: "Tafsir" | "Hadith";
  title: string;
  source: string;
  arabic?: string;
  text: string;
  reference: string;
}

// A collection of built-in Shia Tafsir and Hadith with authentic references.
export const SHIA_INSIGHTS: ShiaInsight[] = [
  {
    key: "5:55",
    type: "Tafsir",
    title: "Ayah of Wilayah (Verse of Leadership)",
    source: "Surah Al-Ma'idah, Verse 55",
    arabic:
      "إِنَّمَا وَلِيُّكُمُ اللَّهُ وَرَسُولُهُ وَالَّذِينَ آمَنُوا الَّذِينَ يُقِيمُونَ الصَّلَاةَ وَيُؤْتُونَ الزَّكَاةَ وَهُمْ رَاكِعُونَ",
    text: "Revealed when Imam Ali (A.S.) gave his ring to a beggar as charity (Zakat) while bowing down in prayer (Ruku). Scholars of Tafsir (both Shia and Sunni, e.g., Tafsir al-Mizan, al-Tabari) record this verse as definitive proof of the Wilayah (divine authority and leadership) of Imam Ali (A.S.) succeeding the Prophet (S.A.W.W.).",
    reference: "Tafsir al-Mizan, Tafsir al-Tabari, Asbab al-Nuzul by al-Wahidi.",
  },
  {
    key: "33:33",
    type: "Tafsir",
    title: "Ayah of Tatheer (Verse of Purification)",
    source: "Surah Al-Ahzab, Verse 33",
    arabic:
      "إِنَّمَا يُرِيدُ اللَّهُ لِيُذْهِبَ عَنكُمُ الرِّجْسَ أَهْلَ الْبَيْتِ وَيُطَهِّرَكُمْ تَطْهِيرًا",
    text: "Refers specifically to the Ahlul Bayt (A.S.) — Prophet Muhammad (S.A.W.W.), Imam Ali (A.S.), Sayyida Fatima (S.A.), Imam Hasan (A.S.), and Imam Husayn (A.S.) under the Cloak (Hadith al-Kisa). The verse confirms their divine purification and absolute infallibility (Ismah) from all forms of spiritual impurity or sin.",
    reference: "Sahih Muslim, Book 31, Hadith 5955; Jami` at-Tirmidhi, Vol. 5, Book 44, Hadith 3205.",
  },
  {
    key: "3:61",
    type: "Tafsir",
    title: "Ayah of Mubahalah (Verse of Mutual Imprecation)",
    source: "Surah Aal-Imran, Verse 61",
    text: "Revealed during the debate with the Christians of Najran. The Prophet (S.A.W.W.) brought Imam Hasan and Imam Husayn (A.S.) as his 'sons', Sayyida Fatima (S.A.) as his 'women', and Imam Ali (A.S.) as his 'self' (nafs). This highlights the elevated status of the Ahlul Bayt (A.S.) as equal to the Prophet's own soul.",
    reference: "Sahih Muslim, Book 31, Hadith 5915; Tafsir al-Qurtubi.",
  },
  {
    key: "42:23",
    type: "Tafsir",
    title: "Ayah of Mawaddah (Verse of Love)",
    source: "Surah Ash-Shura, Verse 23",
    text: "Commanding the Muslims to offer love and devotion to the Prophet's close relatives (Ahlul Bayt) as the sole recompense for his propagation of the message of Islam. This love is a prerequisite for faith and spiritual guidance.",
    reference: "Al-Kashshaf by al-Zamakhshari; Tafsir Ibn Kathir.",
  },
  {
    type: "Hadith",
    title: "Hadith of the Two Weighty Things (Thaqalayn)",
    source: "The Prophet Muhammad (S.A.W.W.)",
    arabic: "إِنِّي تَارِكٌ فِيكُمُ الثَّقَلَيْنِ: كِتَابَ اللَّهِ وَعِتْرَتِي أَهْلَ بَيْتِي",
    text: "I am leaving among you two weighty things: the first of which is the Book of Allah, in which there is guidance and light, so hold fast to it. And the second is my Ahlul Bayt (my household). I remind you of Allah with regard to my Ahlul Bayt.",
    reference: "Sahih Muslim, Book 31, Hadith 5920; Jami` at-Tirmidhi, Hadith 3788.",
  },
  {
    type: "Hadith",
    title: "The Ark of Noah",
    source: "The Prophet Muhammad (S.A.W.W.)",
    text: "Behold! My Ahlul Bayt are like the Ark of Noah. Whoever embarked on it was saved, and whoever turned away from it was drowned.",
    reference: "Mustadrak al-Hakim, Vol. 2, Page 343; Al-Mu'jam al-Kabir by al-Tabarani.",
  },
];

export const COMMON_SURAHS = [
  { number: 1, name: "الْفَاتِحَة", englishName: "Al-Fatiha", numberOfAyahs: 7 },
  { number: 36, name: "يٰسٓ", englishName: "Yaseen", numberOfAyahs: 83 },
  { number: 55, name: "الرَّحْمَٰن", englishName: "Ar-Rahman", numberOfAyahs: 78 },
  { number: 56, name: "الْوَاقِعَة", englishName: "Al-Waqi'ah", numberOfAyahs: 96 },
  { number: 67, name: "الْمُلْك", englishName: "Al-Mulk", numberOfAyahs: 30 },
  { number: 112, name: "الْإِخْلَاص", englishName: "Al-Ikhlaas", numberOfAyahs: 4 },
];

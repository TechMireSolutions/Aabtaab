import { BookOpen, Heart, Star, type LucideIcon } from "lucide-react";
import { DEFAULT_SITE_NAME } from "@/lib/constants";

export interface AboutPillar {
  title: string;
  description: string;
  icon: "book" | "heart" | "star";
}

export const ABOUT_PILLARS: AboutPillar[] = [
  {
    icon: "book",
    title: "Education",
    description:
      "Online Quran, Fiqh, Ethics & History courses from qualified scholars",
  },
  {
    icon: "heart",
    title: "Services",
    description:
      "Authentic religious services — Niyabat Ziarat, Zakat, Khums & more",
  },
  {
    icon: "star",
    title: "Community",
    description:
      "Majalis, programs and reliable Islamic content for the Ummah",
  },
];

export const ABOUT_PILLAR_ICONS: Record<AboutPillar["icon"], LucideIcon> = {
  book: BookOpen,
  heart: Heart,
  star: Star,
};

export function aboutIntro(siteName: string = DEFAULT_SITE_NAME) {
  return {
    siteName,
    luminous: "luminous" as const,
    leadAfterName:
      " is a dedicated platform for the promotion of Islamic knowledge rooted in the teachings of the Holy Quran and the Ahlul Bayt (A.S.). Our name — meaning ",
    leadAfterLuminous:
      " — reflects our mission to spread light through education and authentic Islamic content.",
    darUlQuranBefore:
      "We are affiliated with Dar Ul Quran, our dedicated Quranic institute providing structured Quran education programs for students of all ages.",
  };
}


import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";
import DarUlQuranContent from "./_components/DarUlQuranContent";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "Dar ul Quran Reader",
    description: "Explore the Quranic verses with authentic Shakir English translation and Shia Tafsir insights.",
    path: "/dar-ul-quran",
  });
}

export default function DarUlQuranPage() {
  return <DarUlQuranContent />;
}

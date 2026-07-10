import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";
import dynamic from "next/dynamic";

const DarUlQuranContent = dynamic(() => import("./_components/DarUlQuranContent"), {
  loading: () => (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-slate-950">
      <div className="text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-600 border-t-transparent mx-auto"></div>
        <p className="mt-4 text-sm-plus text-slate-500">Loading Quran Reader...</p>
      </div>
    </div>
  ),
});

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

import { BookMarked, HelpCircle } from "lucide-react";
import type { ShiaInsight } from "@/lib/fallbacks/dar-ul-quran";

export default function DarUlQuranInsight({
  insight,
}: {
  insight: ShiaInsight | null;
}) {
  if (!insight) {
    return (
      <div className="rounded-3xl border border-dashed border-gray-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/10 p-5 text-center text-sm-plus text-gray-400 dark:text-slate-500">
        <HelpCircle className="mx-auto text-gray-300 dark:text-slate-700 mb-2" size={24} />
        Select a verse like 5:55, 33:33, 3:61, or 42:23 to view specific Tafsir,
        or explore the Quran.
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-gold-500/30 bg-gold-950/20 dark:bg-gold-950/10 p-5 shadow-sm text-slate-900 dark:text-slate-100">
      <div className="flex items-start gap-2.5">
        <BookMarked className="text-gold-500 mt-0.5 shrink-0" size={18} />
        <div>
          <p className="badge-sm-gold-ghost mb-2">{insight.type}</p>
          <h4 className="font-display font-bold text-base-plus text-gold-600 dark:text-gold-400">
            {insight.title}
          </h4>
          <p className="text-2xs text-gold-600/70 dark:text-gold-400/60 uppercase tracking-widest mt-0.5 font-bold">
            {insight.source}
          </p>
          {insight.arabic && (
            <p
              className="font-arabic text-lg text-right text-slate-800 dark:text-slate-200 leading-relaxed mt-3"
              dir="rtl"
              lang="ar"
            >
              {insight.arabic}
            </p>
          )}
          <p className="text-sm-plus leading-relaxed text-slate-700 dark:text-slate-300 mt-3 border-t border-gold-500/10 pt-2.5">
            {insight.text}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-3 pt-2 border-t border-gold-500/10">
            <span className="font-semibold">Reference:</span> {insight.reference}
          </p>
        </div>
      </div>
    </div>
  );
}

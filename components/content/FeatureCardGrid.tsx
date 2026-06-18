import { Check } from "lucide-react";
import type { LabeledDescription } from "@/types/content-sections";

interface FeatureCardGridProps {
  heading: string;
  items: LabeledDescription[];
  variant?: "check" | "numbered";
  bg?: "white" | "slate";
}

export default function FeatureCardGrid({
  heading,
  items,
  variant = "check",
  bg = "slate",
}: FeatureCardGridProps) {
  if (items.length === 0) return null;

  const bgClass = bg === "slate" ? "bg-slate-50" : "bg-white";

  return (
    <section className={`${bgClass} py-16 sm:py-20`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-bold text-[24px] sm:text-[32px] text-slate-900 tracking-[-0.02em]">
            {heading}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, index) =>
            variant === "check" ? (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center mb-4">
                  <Check
                    size={17}
                    className="text-cyan-600"
                    strokeWidth={2.5}
                  />
                </div>
                <h3 className="font-bold text-[15px] text-slate-900 mb-2">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-[13.5px] text-gray-500 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            ) : (
              <div
                key={index}
                className="flex gap-4 p-6 rounded-2xl border border-gray-100 hover:border-cyan-100 hover:bg-cyan-50/30 transition-colors duration-200"
              >
                <div className="shrink-0 w-8 h-8 rounded-lg bg-cyan-600 text-white text-[12px] font-bold flex items-center justify-center mt-0.5">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-bold text-[15px] text-slate-900 mb-1.5">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-[13.5px] text-gray-500 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

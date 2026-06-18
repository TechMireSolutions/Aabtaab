import { ChevronRight, Plus } from "lucide-react";
import PortableTextBody from "@/components/portable-text/PortableTextBody";

interface FaqItem {
  question?: string;
  answer?: unknown[] | string;
}

interface FaqAccordionSectionProps {
  heading?: string;
  items?: FaqItem[];
  icon?: "chevron" | "plus";
}

function FaqAnswer({ answer }: { answer: unknown[] | string }) {
  if (typeof answer === "string") {
    return (
      <p className="px-5 pb-4 pt-1 text-[14px] text-gray-600 leading-relaxed border-t border-gray-100">
        {answer}
      </p>
    );
  }

  if (!Array.isArray(answer) || answer.length === 0) return null;

  return (
    <div className="px-6 pb-5 pt-1 text-[14px] text-gray-600 leading-relaxed border-t border-gray-50 prose prose-sm max-w-none">
      <PortableTextBody value={answer} />
    </div>
  );
}

export default function FaqAccordionSection({
  heading = "Frequently Asked Questions",
  items = [],
  icon = "plus",
}: FaqAccordionSectionProps) {
  if (items.length === 0) return null;

  const ToggleIcon = icon === "chevron" ? ChevronRight : Plus;

  return (
    <section className="bg-slate-50 py-16 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="font-bold text-[24px] sm:text-[30px] text-slate-900 tracking-[-0.02em]">
            {heading}
          </h2>
        </div>
        <div className="space-y-3">
          {items.map((item, index) => (
            <details
              key={index}
              className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm"
            >
              <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer list-none font-semibold text-[15px] text-slate-900 hover:text-cyan-700 transition-colors">
                {item.question}
                <ToggleIcon
                  size={icon === "chevron" ? 15 : 16}
                  strokeWidth={2}
                  className={`shrink-0 text-gray-400 transition-transform duration-200 ${
                    icon === "chevron"
                      ? "group-open:rotate-90"
                      : "group-open:rotate-45"
                  }`}
                />
              </summary>
              {item.answer !== undefined && item.answer !== null && (
                <FaqAnswer answer={item.answer} />
              )}
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

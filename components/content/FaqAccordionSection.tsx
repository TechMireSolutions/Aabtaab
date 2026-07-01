import { ChevronRight, Plus } from "lucide-react";
import PortableTextBody from "@/components/portable-text/PortableTextBody";
import "@/app/styles/prose.css";

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
      <p className="border-t border-gray-100 px-5 pb-4 pt-1 text-sm-plus leading-relaxed text-gray-600">
        {answer}
      </p>
    );
  }

  if (!Array.isArray(answer) || answer.length === 0) return null;

  return (
    <div className="prose prose-sm max-w-none border-t border-gray-50 px-6 pb-5 pt-1 text-sm-plus leading-relaxed text-gray-600">
      <PortableTextBody value={answer} />
    </div>
  );
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function FaqAccordionSection({
  heading = "Frequently Asked Questions",
  items = [],
  icon = "plus",
}: FaqAccordionSectionProps) {
  if (!items || items.length === 0) return null;

  const headingId = `faq-heading-${slugify(heading)}`;
  const ToggleIcon = icon === "chevron" ? ChevronRight : Plus;

  return (
    <section className="section-muted" aria-labelledby={headingId}>
      <div className="container-content">
        <div className="mb-10 text-center">
          <h2 id={headingId} className="heading-section">
            {heading}
          </h2>
        </div>
        <div className="space-y-3">
          {items.map((item, index) => (
            <details
              key={index}
              className="group card-surface overflow-hidden"
            >
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 rounded-sm px-6 py-5 text-base-plus font-semibold text-slate-900 transition-colors hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 [&::-webkit-details-marker]:hidden">
                {item.question}
                <ToggleIcon
                  aria-hidden="true"
                  size={icon === "chevron" ? 15 : 16}
                  strokeWidth={2}
                  className={`shrink-0 text-gray-500 transition-transform duration-200 ${icon === "chevron"
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

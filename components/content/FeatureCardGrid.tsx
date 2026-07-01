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
  if (!items || items.length === 0) return null;

  const sectionClass = bg === "slate" ? "section-muted" : "section-y bg-white";

  return (
    <section className={sectionClass}>
      <div className="container-page">
        <div className="mb-12 text-center">
          <h2 className="heading-section-lg">{heading}</h2>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) =>
            variant === "check" ? (
              <div
                key={index}
                className="card-surface p-6 transition-shadow duration-200 hover:shadow-card-hover"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-brand-100 bg-brand-50">
                  <Check
                    size={17}
                    className="text-brand-700"
                    strokeWidth={2.5}
                  />
                </div>
                <h3 className="mb-2 text-base-plus font-bold text-slate-900">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-sm-plus leading-relaxed text-gray-500">
                    {item.description}
                  </p>
                )}
              </div>
            ) : (
              <div
                key={index}
                className="card-surface flex gap-4 p-6 transition-colors duration-200 hover:border-brand-100 hover:bg-brand-50/30"
              >
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-700 text-2xs font-bold text-white">
                  {index + 1}
                </div>
                <div>
                  <h3 className="mb-1.5 text-base-plus font-bold text-slate-900">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-sm-plus leading-relaxed text-gray-500">
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

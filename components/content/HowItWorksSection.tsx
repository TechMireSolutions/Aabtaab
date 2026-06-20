import type { LabeledStep } from "@/types/course";

interface HowItWorksSectionProps {
  heading?: string;
  steps?: LabeledStep[];
  maxWidth?: "md" | "lg";
}

export default function HowItWorksSection({
  heading = "How It Works",
  steps = [],
  maxWidth = "md",
}: HowItWorksSectionProps) {
  if (steps.length === 0) return null;

  const containerClass =
    maxWidth === "lg" ? "container-narrow" : "container-content";

  return (
    <section className="section-y bg-brand-50">
      <div className={containerClass}>
        <div className="mb-12 text-center">
          <h2 className="heading-section-lg">{heading}</h2>
        </div>
        <ol className="space-y-4">
          {steps.map((step, index) => (
            <li
              key={index}
              className="card-surface flex items-start gap-5 px-6 py-5"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-700 text-sm-plus font-bold text-white">
                {index + 1}
              </span>
              <div className="pt-0.5">
                <span className="text-base-plus font-bold text-slate-900">
                  {step.label}
                </span>
                {step.description && (
                  <span className="text-sm-plus text-gray-500">
                    {" "}
                    — {step.description}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

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
    maxWidth === "lg"
      ? "max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"
      : "max-w-2xl mx-auto px-4 sm:px-6";

  return (
    <section className="bg-cyan-50 py-16 sm:py-20">
      <div className={containerClass}>
        <div className="text-center mb-12">
          <h2 className="font-bold text-[24px] sm:text-[32px] text-slate-900 tracking-[-0.02em]">
            {heading}
          </h2>
        </div>
        <ol className="space-y-4">
          {steps.map((step, index) => (
            <li
              key={index}
              className="flex items-start gap-5 bg-white rounded-2xl px-6 py-5 border border-cyan-100 shadow-sm"
            >
              <span className="shrink-0 w-9 h-9 rounded-full bg-cyan-600 text-white text-[13px] font-bold flex items-center justify-center">
                {index + 1}
              </span>
              <div className="pt-0.5">
                <span className="font-bold text-slate-900 text-[15px]">
                  {step.label}
                </span>
                {step.description && (
                  <span className="text-gray-500 text-[14px]">
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

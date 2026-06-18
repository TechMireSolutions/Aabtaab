import type { LabeledDescription } from "@/types/course";

interface CommitmentSectionProps {
  heading?: string;
  items?: LabeledDescription[];
  defaultHeading?: string;
}

export default function CommitmentSection({
  heading,
  items = [],
  defaultHeading = "Our Commitment",
}: CommitmentSectionProps) {
  if (items.length === 0) return null;

  return (
    <section className="bg-slate-900 py-16 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="font-bold text-[24px] sm:text-[32px] text-white tracking-[-0.02em] mb-10">
          {heading || defaultHeading}
        </h2>
        <ul className="space-y-5">
          {items.map((item, index) => (
            <li key={index} className="text-[14.5px] text-slate-300 leading-relaxed">
              <span className="font-semibold text-white">{item.title}:</span>
              {item.description && <span> {item.description}</span>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

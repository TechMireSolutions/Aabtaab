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
    <section className="bg-slate-900 section-y">
      <div className="container-content text-center">
        <h2 className="heading-section-lg mb-10 text-white">
          {heading || defaultHeading}
        </h2>
        <ul className="space-y-5">
          {items.map((item, index) => (
            <li
              key={index}
              className="text-base-plus leading-relaxed text-slate-300"
            >
              <span className="font-semibold text-white">{item.title}:</span>
              {item.description && <span> {item.description}</span>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

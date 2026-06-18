interface CenteredTextSectionProps {
  heading?: string;
  body?: string;
  bg?: "white" | "slate";
  headingSize?: "lg" | "md";
}

export default function CenteredTextSection({
  heading,
  body,
  bg = "white",
  headingSize = "lg",
}: CenteredTextSectionProps) {
  if (!heading && !body) return null;

  const bgClass = bg === "slate" ? "bg-slate-50" : "bg-white";
  const headingClass =
    headingSize === "md"
      ? "font-bold text-[24px] sm:text-[30px] text-slate-900 tracking-[-0.02em] mb-5"
      : "font-bold text-[24px] sm:text-[32px] text-slate-900 tracking-[-0.02em] mb-5";

  return (
    <section className={`${bgClass} py-16 sm:py-20`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        {heading && <h2 className={headingClass}>{heading}</h2>}
        {body && (
          <p className="text-[15px] sm:text-[16px] text-gray-600 leading-[1.9]">
            {body}
          </p>
        )}
      </div>
    </section>
  );
}

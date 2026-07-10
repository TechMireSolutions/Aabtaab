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

  const sectionClass = bg === "slate" ? "section-muted" : "section-y bg-white dark:bg-slate-950";
  const headingClass =
    headingSize === "md"
      ? "heading-section mb-5"
      : "heading-section-lg mb-5";

  return (
    <section className={sectionClass}>
      <div className="container-content text-center">
        {heading && <h2 className={headingClass}>{heading}</h2>}
        {body && <p className="text-lead">{body}</p>}
      </div>
    </section>
  );
}

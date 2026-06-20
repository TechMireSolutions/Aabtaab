interface PageHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  maxWidth?: "md" | "lg" | "xl";
}

const containerClass = {
  md: "container-content",
  lg: "container-narrow",
  xl: "container-page",
} as const;

export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  centered = false,
  maxWidth = "xl",
}: PageHeaderProps) {
  return (
    <div className="border-b border-gray-100 bg-white">
      <div
        className={`${containerClass[maxWidth]} section-header-py ${
          centered ? "text-center" : ""
        }`}
      >
        <p
          className={`text-eyebrow mb-3 flex items-center gap-2 ${
            centered ? "justify-center" : ""
          }`}
        >
          <span className="eyebrow-line" aria-hidden="true" />
          {eyebrow}
          {centered && <span className="eyebrow-line" aria-hidden="true" />}
        </p>
        <h1 className="heading-page mb-2">{title}</h1>
        {subtitle && (
          <p
            className={`text-lead ${centered ? "mx-auto" : "max-w-xl"}`}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

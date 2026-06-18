interface PageHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  maxWidth?: "md" | "lg" | "xl";
}

const maxWidthClass = {
  md: "max-w-3xl",
  lg: "max-w-5xl",
  xl: "max-w-7xl",
} as const;

export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  centered = false,
  maxWidth = "xl",
}: PageHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-100">
      <div
        className={`${maxWidthClass[maxWidth]} mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 ${
          centered ? "text-center" : ""
        }`}
      >
        <p
          className={`flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.18em] text-cyan-600 mb-3 ${
            centered ? "justify-center" : ""
          }`}
        >
          <span className="w-5 h-px bg-cyan-400 inline-block" />
          {eyebrow}
          {centered && <span className="w-5 h-px bg-cyan-400 inline-block" />}
        </p>
        <h1 className="font-bold text-[26px] sm:text-[30px] text-slate-900 tracking-[-0.02em] mb-2">
          {title}
        </h1>
        {subtitle && (
          <p
            className={`text-[13.5px] text-gray-500 leading-relaxed ${
              centered ? "mx-auto" : "max-w-xl"
            }`}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

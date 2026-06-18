import PortableTextBody from "@/components/portable-text/PortableTextBody";

const PROSE_ARTICLE =
  "prose prose-slate prose-base sm:prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-cyan-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-900";

const PROSE_PAGE =
  "prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-cyan-600 prose-a:no-underline hover:prose-a:underline";

interface ProseSectionProps {
  value: unknown;
  variant?: "article" | "page";
  className?: string;
}

export default function ProseSection({
  value,
  variant = "page",
  className = "",
}: ProseSectionProps) {
  return (
    <div className={`${variant === "article" ? PROSE_ARTICLE : PROSE_PAGE} ${className}`}>
      <PortableTextBody value={value} />
    </div>
  );
}

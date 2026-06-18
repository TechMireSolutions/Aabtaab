import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

interface CtaBandSectionProps {
  heading?: string;
  subtitle?: string;
  primaryLabel: string;
  primaryHref: string;
  primaryExternal?: boolean;
  secondaryLabel: string;
  secondaryHref: string;
  footer?: React.ReactNode;
}

const primaryButtonClass =
  "group inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold text-[14px] px-8 py-3.5 rounded-full shadow-[0_4px_20px_rgba(6,182,212,0.3)] transition-all duration-200 hover:-translate-y-px";

export default function CtaBandSection({
  heading,
  subtitle,
  primaryLabel,
  primaryHref,
  primaryExternal = false,
  secondaryLabel,
  secondaryHref,
  footer,
}: CtaBandSectionProps) {
  if (!heading && !subtitle) return null;

  const useAnchor =
    primaryExternal || primaryHref.startsWith("http");

  return (
    <section className="bg-slate-900 py-16 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        {heading && (
          <h2 className="font-bold text-[26px] sm:text-[34px] text-white tracking-[-0.02em] mb-4">
            {heading}
          </h2>
        )}
        {subtitle && (
          <p className="text-[15px] text-slate-400 mb-8 leading-relaxed">
            {subtitle}
          </p>
        )}
        <div className={`flex flex-wrap justify-center gap-3 ${footer ? "mb-8" : ""}`}>
          {useAnchor ? (
            <a
              href={primaryHref}
              target={primaryExternal ? "_blank" : undefined}
              rel={primaryExternal ? "noopener noreferrer" : undefined}
              className={primaryButtonClass}
            >
              {primaryLabel}
              <ArrowRight
                size={14}
                strokeWidth={2.5}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </a>
          ) : (
            <Link href={primaryHref} className={primaryButtonClass}>
              {primaryLabel}
              <ArrowRight
                size={14}
                strokeWidth={2.5}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </Link>
          )}
          <a
            href={secondaryHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white text-[14px] font-semibold px-8 py-3.5 rounded-full border border-white/20 transition-all duration-200 hover:-translate-y-px"
          >
            <MessageCircle size={14} />
            {secondaryLabel}
          </a>
        </div>
        {footer}
      </div>
    </section>
  );
}

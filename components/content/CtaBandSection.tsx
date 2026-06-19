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

  const useAnchor = primaryExternal || primaryHref.startsWith("http");

  return (
    <section className="section-y-cta bg-slate-900">
      <div className="container-content text-center">
        {heading && (
          <h2 className="heading-section-lg mb-4 text-white">{heading}</h2>
        )}
        {subtitle && (
          <p className="text-body-muted mb-8 text-slate-400">{subtitle}</p>
        )}
        <div className={`flex flex-wrap justify-center gap-3 ${footer ? "mb-8" : ""}`}>
          {useAnchor ? (
            <a
              href={primaryHref}
              target={primaryExternal ? "_blank" : undefined}
              rel={primaryExternal ? "noopener noreferrer" : undefined}
              className="btn-pill-accent group"
            >
              {primaryLabel}
              <ArrowRight
                size={14}
                strokeWidth={2.5}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </a>
          ) : (
            <Link href={primaryHref} className="btn-pill-accent group">
              {primaryLabel}
              <ArrowRight
                size={14}
                strokeWidth={2.5}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          )}
          <a
            href={secondaryHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pill-ghost"
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

import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import OpensInNewTab from "@/components/ui/OpensInNewTab";
import { EXTERNAL_LINK_PROPS } from "@/lib/urls";

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
        <div
          className={`flex flex-wrap justify-center gap-3 ${footer ? "mb-8" : ""}`}
        >
          {useAnchor ? (
            <a
              href={primaryHref}
              {...(primaryExternal ? EXTERNAL_LINK_PROPS : {})}
              className="btn-pill-accent group"
            >
              {primaryLabel}
              {primaryExternal ? <OpensInNewTab /> : null}
              <ArrowRight
                size={14}
                strokeWidth={2.5}
                className="motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5"
              />
            </a>
          ) : (
            <Link href={primaryHref} className="btn-pill-accent group">
              {primaryLabel}
              <ArrowRight
                size={14}
                strokeWidth={2.5}
                className="motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5"
              />
            </Link>
          )}
          <a
            href={secondaryHref}
            {...EXTERNAL_LINK_PROPS}
            className="btn-pill-ghost"
          >
            <MessageCircle size={14} aria-hidden="true" />
            {secondaryLabel}
            <OpensInNewTab />
          </a>
        </div>
        {footer}
      </div>
    </section>
  );
}

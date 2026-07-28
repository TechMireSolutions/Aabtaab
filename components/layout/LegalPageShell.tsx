import type { ReactNode } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { DEFAULT_SITE_NAME } from "@/lib/constants";

interface LegalPageShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

/** Shared layout for privacy / terms legal pages. */
export default function LegalPageShell({
  title,
  subtitle,
  children,
}: LegalPageShellProps) {
  return (
    <div>
      <PageHeader
        maxWidth="md"
        eyebrow="Legal"
        title={title}
        subtitle={subtitle}
      />
      <div className="section-y bg-white dark:bg-slate-950">
        <div className="container-content max-w-3xl">
          <div className="space-y-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

interface LegalSectionProps {
  heading: string;
  children: ReactNode;
}

export function LegalSection({ heading, children }: LegalSectionProps) {
  return (
    <section>
      <h2 className="heading-section mb-4 mt-2 text-xl">{heading}</h2>
      <p className="text-base-plus leading-relaxed text-slate-600 dark:text-slate-400">
        {children}
      </p>
    </section>
  );
}

export function legalSiteName(name?: string | null) {
  return name || DEFAULT_SITE_NAME;
}

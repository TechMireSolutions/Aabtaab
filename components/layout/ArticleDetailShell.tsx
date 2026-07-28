import type { ReactNode } from "react";
import DetailBackButton from "@/components/layout/DetailBackButton";

interface ArticleDetailShellProps {
  backHref: string;
  backLabel: string;
  children: ReactNode;
}

/** Shared chrome for flat detail pages (posts, events). */
export default function ArticleDetailShell({
  backHref,
  backLabel,
  children,
}: ArticleDetailShellProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <DetailBackButton href={backHref} label={backLabel} />
      <article className="container-content section-y">{children}</article>
    </div>
  );
}

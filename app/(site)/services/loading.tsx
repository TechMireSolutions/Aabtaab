import CatalogSkeletonGrid from "@/components/content/CatalogSkeletonGrid";

export default function ServicesLoading() {
  return (
    <div className="flex-1 section-y" aria-busy="true" aria-live="polite">
      <div className="container-page space-y-8 animate-pulse">
        <div className="space-y-3">
          <div className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-10 w-48 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-96 max-w-full rounded bg-slate-100 dark:bg-slate-900" />
        </div>
        <CatalogSkeletonGrid count={6} />
      </div>
      <span className="sr-only">Loading services…</span>
    </div>
  );
}

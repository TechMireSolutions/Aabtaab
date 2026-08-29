import CatalogSkeletonGrid from "@/components/content/CatalogSkeletonGrid";

export default function CoursesLoading() {
  return (
    <div className="flex-1 section-y" aria-busy="true" aria-live="polite">
      <div className="container-page space-y-8 animate-pulse">
        <div className="space-y-3">
          <div className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-10 w-64 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-96 max-w-full rounded bg-slate-100 dark:bg-slate-900" />
        </div>
        <div className="h-14 w-full rounded-2xl bg-slate-100 dark:bg-slate-900" />
        <CatalogSkeletonGrid count={6} />
      </div>
      <span className="sr-only">Loading courses…</span>
    </div>
  );
}

export default function CatalogSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div aria-hidden="true" className="grid-catalog-cards">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="card-surface overflow-hidden flex flex-col h-full animate-pulse"
        >
          <div className="aspect-3/2 w-full bg-slate-200 dark:bg-slate-800" />
          <div className="p-4 flex flex-col flex-1 space-y-3">
            <div className="h-4 w-20 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="h-5 w-4/5 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-full rounded bg-slate-100 dark:bg-slate-900" />
            <div className="h-4 w-2/3 rounded bg-slate-100 dark:bg-slate-900" />
            <div className="pt-2 mt-auto">
              <div className="h-4 w-24 rounded bg-brand-100 dark:bg-brand-900/40" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

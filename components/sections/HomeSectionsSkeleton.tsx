export default function HomeSectionsSkeleton() {
  return (
    <div aria-hidden="true" className="section-deferred border-b border-gray-100 dark:border-slate-900 bg-white dark:bg-slate-950">
      <div className="container-page section-y-lg space-y-6 pb-16">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
        <div className="flex gap-6 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-72 w-carousel-card shrink-0 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

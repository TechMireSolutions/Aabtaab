export default function Loading() {
  return (
    <div className="flex-1 section-y" aria-busy="true" aria-live="polite">
      <div className="container-content space-y-6 animate-pulse">
        <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-10 w-2/3 max-w-xl rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-4 w-full max-w-2xl rounded bg-slate-100 dark:bg-slate-900" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-40 rounded-2xl bg-slate-100 dark:bg-slate-900"
            />
          ))}
        </div>
      </div>
      <span className="sr-only">Loading page…</span>
    </div>
  );
}

export default function HomeHeroSkeleton() {
  return (
    <section
      aria-hidden="true"
      className="relative min-h-hero w-full overflow-hidden bg-white"
    >
      <div className="container-page flex min-h-hero flex-col justify-center py-12">
        <div className="max-w-hero-copy space-y-4">
          <div className="h-4 w-40 animate-pulse rounded bg-slate-100" />
          <div className="h-12 max-w-lg animate-pulse rounded bg-slate-100" />
          <div className="h-20 max-w-md animate-pulse rounded bg-slate-100" />
          <div className="flex gap-3 pt-2">
            <div className="h-10 w-36 animate-pulse rounded-full bg-slate-100" />
            <div className="h-10 w-32 animate-pulse rounded-full bg-slate-100" />
          </div>
        </div>
      </div>
    </section>
  );
}

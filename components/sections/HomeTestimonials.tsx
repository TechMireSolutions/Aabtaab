import type { HomepageSettings } from "@/types/homepage";
import type { Testimonial } from "@/types/testimonial";

interface HomeTestimonialsProps {
  testimonials: Testimonial[];
  homepage: HomepageSettings | null;
}

export default function HomeTestimonials({
  testimonials,
  homepage: hp,
}: HomeTestimonialsProps) {
  const list = testimonials ?? [];
  if (list.length === 0) return null;

  return (
    <section className="section-deferred section-y-lg border-b border-gray-100 dark:border-slate-900 bg-slate-50 dark:bg-slate-900/40">
      <div className="container-page">
        <div className="mb-10 text-center">
          <p className="text-eyebrow mb-3 flex items-center justify-center gap-2">
            <span className="eyebrow-line" />
            {hp?.testimonialsEyebrow || "Community"}
            <span className="eyebrow-line" />
          </p>
          <h2 className="heading-section">
            {hp?.testimonialsHeading || "What Our Community Says"}
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {list.map((t) => (
            <div key={t.name} className="card-surface flex flex-col px-6 py-6">
              <div className="mb-4 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`text-base-plus leading-none ${
                      i < (t.rating ?? 5) ? "text-gold-400" : "text-slate-300 dark:text-slate-700"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="text-body-muted mb-5 flex-1 text-gray-600 dark:text-slate-300">
                &quot;{t.quote}&quot;
              </p>
              <div className="flex items-center gap-3 border-t border-gray-100 dark:border-slate-800/80 pt-4">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/40">
                  <span className="text-sm-plus font-bold text-brand-700 dark:text-brand-400">
                    {t.name[0]}
                  </span>
                </div>
                <div>
                  <p className="text-sm-plus font-semibold text-slate-800 dark:text-white">
                    {t.name}
                  </p>
                  <p className="text-caption">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

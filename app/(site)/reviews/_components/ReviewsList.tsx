import { Quote, MessageSquareHeart, Sparkles } from "lucide-react";
import type { Testimonial } from "@/types/testimonial";

export default function ReviewsList({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  return (
    <div>
      <div className="flex flex-col items-center justify-center text-center mb-12">
        <div className="badge-trust mb-6 size-16 text-2xl">
          <MessageSquareHeart className="h-8 w-8" aria-hidden="true" />
        </div>
        <h2 className="heading-section-lg">What People Say</h2>
        <p className="text-lead mt-3 flex items-center justify-center gap-2">
          <Sparkles className="h-5 w-5 text-gold-500" aria-hidden="true" />
          Real stories from our students
        </p>
      </div>

      {testimonials.length === 0 ? (
        <div className="empty-state card-surface border-dashed">
          <MessageSquareHeart
            className="mx-auto mb-4 h-10 w-10 text-brand-600 dark:text-brand-400"
            aria-hidden="true"
          />
          <h3 className="heading-section text-xl mb-2">No reviews yet</h3>
          <p className="mx-auto max-w-copy text-sm-plus">
            Be the first to share your learning experience and inspire others.
          </p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {testimonials.map((t) => (
            <figure
              key={t._id}
              className="card-surface card-hover-lift relative flex flex-col p-8"
            >
              <Quote
                className="absolute top-8 right-8 h-10 w-10 text-slate-200 dark:text-slate-800"
                aria-hidden="true"
              />
              <blockquote className="mb-8 text-lg font-medium text-slate-700 dark:text-slate-300 italic leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-4 mt-auto">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-600 text-lg font-bold text-white"
                  aria-hidden="true"
                >
                  {t.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {t.name}
                  </p>
                  {t.role && (
                    <p className="text-sm-plus text-brand-600 dark:text-brand-400">
                      {t.role}
                    </p>
                  )}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}

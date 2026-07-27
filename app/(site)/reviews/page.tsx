import { Metadata } from "next";
import { getTestimonials } from "@/lib/cms/queries";
import PageHeader from "@/components/layout/PageHeader";
import ReviewForm from "@/components/sections/ReviewForm";
import { Quote, MessageSquareHeart, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Student Reviews",
  description: "Read what our students and community members say about Aabtaab, and submit your own review.",
};

export default async function ReviewsPage() {
  const testimonials = await getTestimonials() || [];

  return (
    <>
      <PageHeader
        eyebrow="Community"
        title="Student Reviews"
        subtitle="Feedback and experiences from our global community of learners."
      />

      <section className="section-y relative bg-slate-50 dark:bg-slate-950 overflow-hidden flex-1">
        {/* Vibrant Background Orbs for Premium Glassmorphism Effect */}
        <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-brand-500/10 dark:bg-brand-500/20 blur-[120px] rounded-full pointer-events-none transform translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-brand-400/10 dark:bg-brand-400/15 blur-[120px] rounded-full pointer-events-none transform -translate-x-1/3 translate-y-1/3" />
        
        <div className="container-narrow relative z-10 space-y-24">
          
          {/* Top Section: Reviews List */}
          <div>
            <div className="flex flex-col items-center justify-center text-center mb-12">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-brand-400 to-brand-600 shadow-lg shadow-brand-500/30 overflow-hidden group mb-6">
                <div className="absolute inset-0 bg-white/20 translate-y-full transition-transform duration-500 group-hover:translate-y-0" />
                <MessageSquareHeart className="relative z-10 h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                What People Say
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-3 flex items-center justify-center gap-2 text-lg">
                <Sparkles className="h-5 w-5 text-gold-500" />
                Real stories from our students
              </p>
            </div>
            
            {testimonials.length === 0 ? (
              <div className="mx-auto max-w-3xl group relative overflow-hidden rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-16 text-center backdrop-blur-xl transition-all duration-500 hover:border-brand-500/50 hover:bg-white/60 dark:hover:bg-slate-900/60">
                <div className="absolute inset-0 bg-linear-to-b from-brand-500/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 ring-8 ring-brand-50/50 dark:ring-brand-900/10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
                    <MessageSquareHeart className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No reviews yet</h3>
                  <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                    Our community is growing! Be the first to share your learning experience and inspire others on their journey.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2">
                {testimonials.map((t) => (
                  <div 
                    key={t._id} 
                    className="group relative overflow-hidden bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-3xl p-8 shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-200/50 dark:border-slate-700/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-900/10 dark:hover:border-brand-500/30 flex flex-col"
                  >
                    <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-brand-500/10 dark:bg-brand-500/5 blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-50" />
                    
                    <Quote className="absolute top-8 right-8 h-10 w-10 text-slate-200 dark:text-slate-800 transition-transform duration-500 group-hover:scale-110 group-hover:text-brand-100 dark:group-hover:text-brand-900/30" />
                    
                    <div className="relative z-10 flex flex-col flex-1">
                      <p className="mb-8 text-lg font-medium text-slate-700 dark:text-slate-300 italic leading-relaxed flex-1">
                        &quot;{t.quote}&quot;
                      </p>
                      <div className="flex items-center gap-4 mt-auto">
                        <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-linear-to-br from-brand-400 to-brand-600 text-lg font-bold text-white shadow-inner shadow-white/20">
                          {t.name.charAt(0).toUpperCase()}
                          <div className="absolute inset-0 rounded-full ring-2 ring-brand-500/30 ring-offset-2 ring-offset-white dark:ring-offset-slate-900" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-base">
                            {t.name}
                          </p>
                          {t.role && (
                            <p className="text-sm font-semibold text-brand-600 dark:text-brand-400">
                              {t.role}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Section: Submission Form */}
          <div className="mx-auto max-w-2xl w-full">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
                Share Your Journey
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Your feedback helps us improve and inspires others to join our community.
              </p>
            </div>
            <ReviewForm />
          </div>

        </div>
      </section>
    </>
  );
}

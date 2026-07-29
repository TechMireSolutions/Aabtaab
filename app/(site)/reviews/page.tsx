import type { Metadata } from "next";
import { getTestimonials } from "@/lib/cms/queries";
import PageHeader from "@/components/layout/PageHeader";
import ReviewForm from "./_components/ReviewForm";
import ReviewsList from "./_components/ReviewsList";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Student Reviews",
  description:
    "Read what our students and community members say about Aabtaab, and submit your own review.",
  path: "/reviews",
});

export default async function ReviewsPage() {
  const testimonials = (await getTestimonials()) || [];

  return (
    <>
      <PageHeader
        eyebrow="Community"
        title="Student Reviews"
        subtitle="Feedback and experiences from our global community of learners."
      />

      <section className="section-y relative bg-slate-50 dark:bg-slate-950 overflow-hidden flex-1">
        <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-brand-500/10 dark:bg-brand-500/20 blur-[120px] rounded-full pointer-events-none transform translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-brand-400/10 dark:bg-brand-400/15 blur-[120px] rounded-full pointer-events-none transform -translate-x-1/3 translate-y-1/3" />

        <div className="container-narrow relative z-10 space-y-24">
          <ReviewsList testimonials={testimonials} />

          <div className="mx-auto max-w-copy w-full">
            <div className="text-center mb-10">
              <h2 className="heading-section-lg mb-4">Share Your Journey</h2>
              <p className="text-lead">
                Your feedback helps us improve and inspires others to join our
                community.
              </p>
            </div>
            <ReviewForm />
          </div>
        </div>
      </section>
    </>
  );
}

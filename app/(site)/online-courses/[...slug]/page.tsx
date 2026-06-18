import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Mail, Phone } from "lucide-react";
import NestedBreadcrumbs from "@/components/content/NestedBreadcrumbs";
import NestedChildrenGrid from "@/components/content/NestedChildrenGrid";
import CourseHeroSection from "@/components/content/CourseHeroSection";
import CenteredTextSection from "@/components/content/CenteredTextSection";
import FeatureCardGrid from "@/components/content/FeatureCardGrid";
import CoursePricingSection from "@/components/content/CoursePricingSection";
import HowItWorksSection from "@/components/content/HowItWorksSection";
import CtaBandSection from "@/components/content/CtaBandSection";
import FaqAccordionSection from "@/components/content/FaqAccordionSection";
import PortableTextPageSection from "@/components/content/PortableTextPageSection";
import { buildNestedSlugMetadata } from "@/lib/cms/page";
import { getCourseBySlug, getSiteSettings } from "@/lib/cms/queries";
import { mapCourseChildForGrid } from "@/lib/catalog/nested-children";
import { buildNestedBreadcrumbItems, getContentAncestry } from "@/lib/paths";
import { getSiteUrl } from "@/lib/seo";
import { whatsappUrl } from "@/lib/urls";

const COURSE_CHILD_LABELS = { parent: "View Courses", leaf: "Enroll Now" } as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug[slug.length - 1]);
  return buildNestedSlugMetadata(course, "/online-courses", slug, "Course");
}

export default async function CourseCatchAllPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const currentSlug = slug[slug.length - 1];

  const [course, site] = await Promise.all([
    getCourseBySlug(currentSlug),
    getSiteSettings(),
  ]);
  if (!course) notFound();

  const childItems = Array.isArray(course.children) ? course.children : [];
  const hasChildren = childItems.length > 0;
  const ancestry = getContentAncestry(course);
  const currentPath = `/online-courses/${slug.join("/")}`;
  const siteUrl = getSiteUrl();
  const enrollHref = course.enrollmentLink || "/contact";
  const enrollExternal = Boolean(course.enrollmentLink);
  const whatsappHref = site?.whatsapp
    ? whatsappUrl(site.whatsapp)
    : "/contact";

  return (
    <div>
      <NestedBreadcrumbs
        base="online-courses"
        baseLabel="Online Courses"
        ancestry={ancestry}
        currentTitle={course.title}
        currentPath={currentPath}
        breadcrumbItems={buildNestedBreadcrumbItems(
          "online-courses",
          "Online Courses",
          ancestry,
          course.title,
          currentPath,
          siteUrl,
        )}
      />

      {hasChildren ? (
        <NestedChildrenGrid
          eyebrow="Courses"
          title={course.title}
          excerpt={course.excerpt}
          currentPath={currentPath}
          items={childItems.map((child) =>
            mapCourseChildForGrid(child, COURSE_CHILD_LABELS),
          )}
        />
      ) : (
        <div>
          <CourseHeroSection
            title={course.title}
            subject={course.subject}
            duration={course.duration}
            instructor={course.instructor}
            heroSubtitle={course.heroSubtitle}
            excerpt={course.excerpt}
            heroCtaLabel={course.heroCtaLabel}
            enrollHref={enrollHref}
            enrollExternal={enrollExternal}
            image={course.featuredImage}
          />

          <CenteredTextSection
            heading={course.overviewHeading}
            body={course.overviewBody}
          />

          <FeatureCardGrid
            heading={course.outcomesHeading || "What You'll Achieve"}
            items={course.outcomes ?? []}
            variant="check"
            bg="slate"
          />

          <FeatureCardGrid
            heading={course.whyUsHeading || "Why Our Course Stands Out"}
            items={course.whyUs ?? []}
            variant="numbered"
            bg="white"
          />

          <HowItWorksSection
            heading={course.howItWorksHeading}
            steps={course.howItWorks}
            maxWidth="lg"
          />

          <CoursePricingSection
            heading={course.pricingHeading}
            tables={course.pricingTables}
          />

          <CtaBandSection
            heading={course.ctaHeading}
            subtitle={course.ctaSubtitle}
            primaryLabel={course.ctaPrimaryLabel || "Join Now"}
            primaryHref={enrollHref}
            primaryExternal={enrollExternal}
            secondaryLabel={course.ctaSecondaryLabel || "WhatsApp Us"}
            secondaryHref={whatsappHref}
            footer={
              site?.email || site?.phone ? (
                <div className="flex flex-wrap justify-center gap-6 text-[13px] text-slate-500">
                  {site.email && (
                    <span className="flex items-center gap-1.5">
                      <Mail size={12} className="text-slate-600" />
                      {site.email}
                    </span>
                  )}
                  {site.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone size={12} className="text-slate-600" />
                      {site.phone}
                    </span>
                  )}
                </div>
              ) : undefined
            }
          />

          <CenteredTextSection
            heading={course.promiseHeading}
            body={course.promiseBody}
            headingSize="md"
          />

          <FaqAccordionSection
            heading={course.faqHeading || "FAQs"}
            items={course.faqItems}
            icon="chevron"
          />

          <PortableTextPageSection body={course.body} />
        </div>
      )}
    </div>
  );
}

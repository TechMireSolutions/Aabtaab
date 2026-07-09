import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
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
import SiteContactFooter from "@/components/content/SiteContactFooter";
import { buildNestedCatalogPageContext } from "@/lib/catalog/nested-page";
import type { CourseChild } from "@/types/course";
import type { SlugParent } from "@/types/sanity";
import { buildNestedSlugMetadata } from "@/lib/cms/page";
import { getCourseBySlug, getSiteSettings } from "@/lib/cms/queries";
import { mapCourseChildForGrid } from "@/lib/catalog/nested-children";
import { buildNestedBreadcrumbItems } from "@/lib/paths";
import { resolveSiteName } from "@/lib/constants";
import { absoluteUrl, CourseJsonLd, FaqPageJsonLd, faqItemsToSchema, resolveDocOgImage, buildNestedContentPath } from "@/lib/seo";

const COURSE_BASE = {
  segment: "online-courses" as const,
  label: "Online Courses",
  eyebrow: "Courses",
};

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

  const [course, site] = await Promise.all([
    getCourseBySlug(slug[slug.length - 1]),
    getSiteSettings(),
  ]);
  if (!course) notFound();

  const {
    currentPath,
    childItems,
    hasChildren,
    ancestry,
    siteUrl,
    whatsappHref,
  } = buildNestedCatalogPageContext(COURSE_BASE, slug, course, site);

  const canonicalPath = buildNestedContentPath(
    COURSE_BASE.segment,
    course.slug.current,
    course.parent as SlugParent | null,
  );
  if (currentPath !== canonicalPath) {
    redirect(canonicalPath);
  }

  const enrollHref = course.enrollmentLink || "/contact";
  const enrollExternal = Boolean(course.enrollmentLink);
  const coursePageUrl = absoluteUrl(currentPath);
  const courseImageUrl = resolveDocOgImage(course);
  const courseFaqSchema = faqItemsToSchema(course.faqItems);

  return (
    <div>
      {!hasChildren && (
        <>
          <CourseJsonLd
            title={course.title}
            description={course.excerpt}
            imageUrl={courseImageUrl}
            siteName={resolveSiteName(site)}
            siteUrl={siteUrl}
            url={coursePageUrl}
            price={course.pricingTables?.[0]?.rows?.[0]?.monthlyTotal}
            instructor={course.instructor}
            duration={course.duration}
          />
          <FaqPageJsonLd faqItems={courseFaqSchema} />
        </>
      )}
      <NestedBreadcrumbs
        base={COURSE_BASE.segment}
        baseLabel={COURSE_BASE.label}
        ancestry={ancestry}
        currentTitle={course.title}
        currentPath={currentPath}
        breadcrumbItems={buildNestedBreadcrumbItems(
          COURSE_BASE.segment,
          COURSE_BASE.label,
          ancestry,
          course.title,
          currentPath,
          siteUrl,
        )}
      />

      {hasChildren ? (
        <NestedChildrenGrid
          eyebrow={COURSE_BASE.eyebrow}
          title={course.title}
          excerpt={course.excerpt}
          currentPath={currentPath}
          items={(childItems as CourseChild[]).map((child) =>
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
            footer={<SiteContactFooter site={site} />}
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

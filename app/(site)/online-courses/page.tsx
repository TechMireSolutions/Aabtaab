import ContentCard from "@/components/cards/ContentCard";
import CatalogPageLayout from "@/components/layout/CatalogPageLayout";
import { defineCmsPageMetadata } from "@/lib/cms/page";
import { getCmsPage, getTopLevelCourses } from "@/lib/cms/queries";
import { cardImageUrl } from "@/sanity/lib/image";
import { formatPriceDuration, nestedListCtaLabel } from "@/lib/urls";

export const generateMetadata = defineCmsPageMetadata("online-courses", {
  path: "/online-courses",
  fallbackTitle: "Online Courses",
  fallbackDescription:
    "Online Shia Islamic courses — Quran, Fiqh, Ethics, and more from qualified scholars.",
});

export default async function CoursesPage() {
  const [courses, page] = await Promise.all([
    getTopLevelCourses(),
    getCmsPage("online-courses"),
  ]);
  const courseList = courses ?? [];

  return (
    <CatalogPageLayout
      eyebrow={page?.eyebrow || "Education"}
      title={page?.title || "Online Courses"}
      subtitle={
        page?.subtitle ||
        "Learn from qualified scholars — Quran, Nahjul Balagha, Jurisprudence, Ethics & History."
      }
      isEmpty={courseList.length === 0}
      emptyMessage="Courses coming soon."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {courseList.map((course) => (
          <ContentCard
            key={course._id}
            href={`/online-courses/${course.slug.current}`}
            image={
              course.featuredImage ? cardImageUrl(course.featuredImage) : null
            }
            title={course.title}
            description={
              course.excerpt ||
              formatPriceDuration(course.price, course.duration) ||
              null
            }
            ctaLabel={nestedListCtaLabel(course.childCount, {
              parent: "View Courses",
              leaf: "Enroll Now",
            })}
          />
        ))}
      </div>
    </CatalogPageLayout>
  );
}

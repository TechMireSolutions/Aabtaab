import CatalogPageLayout from "@/components/layout/CatalogPageLayout";
import { defineCmsPageMetadata } from "@/lib/cms/page";
import { getCmsPage, getTopLevelCourses } from "@/lib/cms/queries";
import CourseExplorer from "./_components/CourseExplorer";

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
      <CourseExplorer courses={courseList} />
    </CatalogPageLayout>
  );
}

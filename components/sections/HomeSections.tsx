import HomeArticlesGrid from "@/components/sections/HomeArticlesGrid";
import HomeCoursesCarousel from "@/components/sections/HomeCoursesCarousel";
import HomeDonateCta from "@/components/sections/HomeDonateCta";
import HomeEventsCarousel from "@/components/sections/HomeEventsCarousel";
import HomeServicesCarousel from "@/components/sections/HomeServicesCarousel";
import HomeTestimonials from "@/components/sections/HomeTestimonials";
import type { EventSummary } from "@/types/event";
import type {
  HomeCourseSummary,
  HomePostSummary,
  HomeServiceSummary,
  HomepageSettings,
} from "@/types/homepage";
import type { Testimonial } from "@/types/testimonial";

export interface HomeSectionsProps {
  posts: HomePostSummary[];
  services: HomeServiceSummary[];
  courses: HomeCourseSummary[];
  homepage: HomepageSettings | null;
  testimonials: Testimonial[];
  upcomingEvents: EventSummary[];
}

export default function HomeSections({
  posts,
  services,
  courses,
  homepage,
  testimonials,
  upcomingEvents,
}: HomeSectionsProps) {
  return (
    <>
      <HomeCoursesCarousel courses={courses} homepage={homepage} />
      <HomeServicesCarousel services={services} homepage={homepage} />
      <HomeEventsCarousel upcomingEvents={upcomingEvents} />
      <HomeArticlesGrid posts={posts} homepage={homepage} />
      <HomeTestimonials testimonials={testimonials} homepage={homepage} />
      <HomeDonateCta homepage={homepage} />
    </>
  );
}

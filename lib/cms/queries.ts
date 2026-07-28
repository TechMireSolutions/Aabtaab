/**
 * Cached CMS read facade — public API for app pages.
 * Domain modules: queries-{site,homepage,catalog,content}.ts
 */
export {
  getSiteSettings,
  getSiteLayoutData,
  getPaymentMethods,
} from "@/lib/cms/queries-site";

export {
  getHomepageHeroData,
  getHomepageCarouselsData,
} from "@/lib/cms/queries-homepage";

export {
  getCourseBySlug,
  getServiceBySlug,
  getTopLevelCourses,
  getTopLevelServices,
  getSitemapSlugs,
} from "@/lib/cms/queries-catalog";

export {
  getCmsPage,
  getPostBySlug,
  getPosts,
  getEvents,
  getEventBySlug,
  getTestimonials,
  getScholars,
  getCountries,
  getContactFormOptions,
} from "@/lib/cms/queries-content";

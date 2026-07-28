import NotFoundContent from "@/components/layout/NotFoundContent";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Page not found",
  description: "The page you requested could not be found.",
  path: "/404",
  noIndex: true,
});

/** Segment not-found for `notFound()` inside (site) pages — keeps site chrome. */
export default function SiteNotFound() {
  return <NotFoundContent />;
}

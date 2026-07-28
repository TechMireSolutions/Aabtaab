import NotFoundContent from "@/components/layout/NotFoundContent";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Page not found",
  description: "The page you requested could not be found.",
  path: "/404",
  noIndex: true,
});

/** Handles unmatched URLs (outside any segment that calls notFound()). */
export default function NotFound() {
  return <NotFoundContent />;
}

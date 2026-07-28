import NotFoundContent from "@/components/layout/NotFoundContent";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Page not found",
  description: "The page you requested could not be found.",
  path: "/404",
  noIndex: true,
});

/** Global unmatched routes (e.g. /this-page-does-not-exist). */
export default function RootNotFound() {
  return <NotFoundContent />;
}

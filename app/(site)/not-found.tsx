import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Page not found",
  description: "The page you requested could not be found.",
  path: "/404",
  noIndex: true,
});

export default function NotFound() {
  return (
    <div className="section-y flex flex-1 items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="container-narrow text-center">
        <p className="text-eyebrow mb-3">404</p>
        <h1 className="heading-section-lg mb-3">Page not found</h1>
        <p className="text-lead mx-auto mb-8 max-w-md">
          The page may have moved or no longer exists. Try searching or return
          to the homepage.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn-primary">
            Back to home
          </Link>
          <Link href="/search" className="btn-pill-ghost">
            Search the site
          </Link>
          <Link href="/contact" className="btn-pill-ghost">
            Contact us
          </Link>
        </div>
      </div>
    </div>
  );
}

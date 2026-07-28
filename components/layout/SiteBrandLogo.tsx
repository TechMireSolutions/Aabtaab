import Image from "next/image";
import { LOGO_DISPLAY_PX } from "@/lib/constants";

type SiteBrandLogoVariant = "header" | "footer";

interface SiteBrandLogoProps {
  siteName: string;
  logoUrl?: string | null;
  variant?: SiteBrandLogoVariant;
  /** Header logo is LCP-adjacent; footer should stay lazy. */
  priority?: boolean;
}

const FRAME: Record<SiteBrandLogoVariant, string> = {
  header:
    "size-logo shrink-0 overflow-hidden rounded-full border-2 border-brand-400 motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:scale-105",
  footer:
    "size-logo shrink-0 overflow-hidden rounded-full border border-slate-800 motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-105",
};

const FALLBACK: Record<SiteBrandLogoVariant, string> = {
  header:
    "flex h-full w-full select-none items-center justify-center bg-linear-to-br from-brand-100 to-brand-50 text-lg font-bold text-brand-700",
  footer:
    "flex h-full w-full select-none items-center justify-center bg-slate-900 text-lg font-bold text-brand-400",
};

const LABEL: Record<SiteBrandLogoVariant, string> = {
  header:
    "hidden text-lg-plus font-bold tracking-heading text-slate-900 dark:text-slate-50 md:block",
  footer:
    "text-xl font-bold tracking-tight text-white transition-colors duration-200 group-hover:text-brand-400",
};

/**
 * Shared site mark for header + footer chrome.
 * Parent should be a home `Link` with `group` for hover scale.
 */
export default function SiteBrandLogo({
  siteName,
  logoUrl,
  variant = "header",
  priority = false,
}: SiteBrandLogoProps) {
  const size = LOGO_DISPLAY_PX;
  const initial = siteName.charAt(0).toUpperCase();

  return (
    <>
      <div className={FRAME[variant]}>
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={variant === "footer" ? siteName : ""}
            width={size}
            height={size}
            sizes={`${size}px`}
            priority={priority}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className={FALLBACK[variant]} aria-hidden="true">
            {initial}
          </div>
        )}
      </div>
      <span className={LABEL[variant]}>{siteName}</span>
    </>
  );
}

import { Mail, Phone } from "lucide-react";
import type { SiteSettings } from "@/types/sanity";

interface SiteContactFooterProps {
  site: SiteSettings | null | undefined;
}

export default function SiteContactFooter({ site }: SiteContactFooterProps) {
  if (!site?.email && !site?.phone) {
    return null;
  }

  return (
    <div className="flex flex-wrap justify-center gap-6 text-sm-plus text-slate-500">
      {site.email && (
        <span className="flex items-center gap-1.5">
          <Mail size={12} className="text-slate-600" />
          {site.email}
        </span>
      )}
      {site.phone && (
        <span className="flex items-center gap-1.5">
          <Phone size={12} className="text-slate-600" />
          {site.phone}
        </span>
      )}
    </div>
  );
}

"use client";

import dynamic from "next/dynamic";
import { TW_MOBILE_MENU_TRIGGER } from "@/components/layout/mobile-nav-classes";
import type { NavItem } from "@/types/site-navigation";

const MobileNavSidebar = dynamic(
  () => import("@/components/layout/MobileNavSidebar"),
  {
    ssr: false,
    loading: () => (
      <div className="lg:hidden" aria-hidden="true">
        <span
          className={`${TW_MOBILE_MENU_TRIGGER} pointer-events-none opacity-0`}
        />
      </div>
    ),
  },
);

interface MobileNavSidebarLoaderProps {
  siteName: string;
  logoUrl?: string | null;
  navLinks: NavItem[];
  onSearchClick?: () => void;
}

export default function MobileNavSidebarLoader(props: MobileNavSidebarLoaderProps) {
  return <MobileNavSidebar {...props} />;
}

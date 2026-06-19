import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/cms/queries";
import { resolveSiteName } from "@/lib/constants";
import { getSiteUrl } from "@/lib/seo";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getSiteSettings();
  const siteName = resolveSiteName(settings);

  return {
    name: siteName,
    short_name: siteName,
    description:
      settings?.description ||
      "Shia Islamic knowledge, online courses, and community services.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0891b2",
    lang: "en-US",
    orientation: "portrait-primary",
    scope: getSiteUrl(),
    icons: [
      {
        src: "/og-default.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/og-default.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}

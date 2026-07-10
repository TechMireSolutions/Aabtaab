import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/cms/queries";
import { resolveSiteName } from "@/lib/constants";
import { urlFor } from "@/sanity/lib/image";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getSiteSettings();
  const siteName = resolveSiteName(settings);

  const dynamicIconUrl = settings?.favicon
    ? urlFor(settings.favicon).width(512).height(512).fit("crop").format("png").url()
    : settings?.logo
      ? urlFor(settings.logo).width(512).height(512).fit("crop").format("png").url()
      : "/icon-512.png";

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
    scope: "/",
    icons: [
      {
        src: dynamicIconUrl,
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: dynamicIconUrl,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}

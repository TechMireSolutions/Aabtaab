import SanityStudio from "@/components/studio/SanityStudio";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <SanityStudio />;
}

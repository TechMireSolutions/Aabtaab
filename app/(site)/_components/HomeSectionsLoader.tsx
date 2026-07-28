import HomeSections from "@/components/sections/HomeSections";
import { getHomepageCarouselsData } from "@/lib/cms/queries";

export default async function HomeSectionsLoader() {
  const data = await getHomepageCarouselsData();
  return <HomeSections {...data} />;
}

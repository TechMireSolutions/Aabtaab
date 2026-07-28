import HomeCountries from "@/components/sections/HomeCountries";
import { getCountries } from "@/lib/cms/queries";

export default async function HomeCountriesLoader() {
  const countries = (await getCountries()) ?? [];
  return <HomeCountries countries={countries} />;
}

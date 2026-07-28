import { cache } from "react";
import {
  sanityFetch,
  CACHE_TAGS,
  fetchSiteSettings as fetchSiteSettingsUncached,
} from "@/sanity/lib/fetch";
import {
  headerNavQuery,
  footerNavQuery,
  footerServicesQuery,
  catalogCountsQuery,
  paymentMethodsQuery,
} from "@/sanity/lib/queries";
import type { PaymentMethod } from "@/types/payment";
import type { FooterNav, FooterService, HeaderNav } from "@/types/site-navigation";
import { filterNavForEmptyCatalogs, resolveFooterNavForLayout } from "@/lib/fallbacks/footer-nav";
import { FALLBACK_NAV } from "@/lib/fallbacks/nav";

export const getSiteSettings = cache(fetchSiteSettingsUncached);

export const getSiteLayoutData = cache(async () => {
  const [settings, headerNav, footerNav, footerServices, catalogCounts] =
    await Promise.all([
      getSiteSettings(),
      sanityFetch<HeaderNav>({
        query: headerNavQuery,
        tags: [CACHE_TAGS.siteSettings],
        revalidate: 86400,
      }),
      sanityFetch<FooterNav>({
        query: footerNavQuery,
        tags: [CACHE_TAGS.siteSettings],
        revalidate: 86400,
      }),
      sanityFetch<FooterService[]>({
        query: footerServicesQuery,
        tags: [CACHE_TAGS.services],
        revalidate: 3600,
      }),
      sanityFetch<{
        scholars?: number;
        events?: number;
        posts?: number;
        courses?: number;
        services?: number;
      } | null>({
        query: catalogCountsQuery,
        tags: [
          CACHE_TAGS.siteSettings,
          CACHE_TAGS.posts,
          CACHE_TAGS.events,
          CACHE_TAGS.courses,
          CACHE_TAGS.services,
        ],
        revalidate: 3600,
      }),
    ]);

  // null counts = unknown (fetch returned null) — fail open in nav filter
  const counts = {
    scholars: catalogCounts?.scholars ?? null,
    events: catalogCounts?.events ?? null,
    posts: catalogCounts?.posts ?? null,
    courses: catalogCounts?.courses ?? null,
    services: catalogCounts?.services ?? null,
  };

  const headerItems = filterNavForEmptyCatalogs(
    headerNav?.items?.length ? headerNav.items : FALLBACK_NAV,
    counts,
  );

  return {
    settings,
    headerNav: { items: headerItems },
    footerNav: { items: resolveFooterNavForLayout(footerNav, counts) },
    footerServices,
  };
});

export const getPaymentMethods = cache(async () => {
  return sanityFetch<PaymentMethod[]>({
    query: paymentMethodsQuery,
    tags: [CACHE_TAGS.siteSettings],
    revalidate: 86400,
  });
});

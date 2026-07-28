import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { heroImageUrl, urlFor } from "@/sanity/lib/image";
import NestedCatalogPageShell from "@/components/layout/NestedCatalogPageShell";
import ServiceHeroSection from "@/components/content/ServiceHeroSection";
import WhyUsImageSection from "@/components/content/WhyUsImageSection";
import CommitmentSection from "@/components/content/CommitmentSection";
import HowItWorksSection from "@/components/content/HowItWorksSection";
import CtaBandSection from "@/components/content/CtaBandSection";
import FaqAccordionSection from "@/components/content/FaqAccordionSection";
import PortableTextPageSection from "@/components/content/PortableTextPageSection";
import SiteContactFooter from "@/components/content/SiteContactFooter";
import {
  buildNestedCatalogPageContext,
  ensureCanonicalNestedPath,
  nestedStaticParamsFromEntries,
} from "@/lib/catalog/nested-page";
import type { ServiceChild } from "@/types/service";
import { buildNestedSlugMetadata } from "@/lib/cms/page";
import { getServiceBySlug, getSiteSettings, getSitemapSlugs } from "@/lib/cms/queries";
import { mapServiceChildForGrid } from "@/lib/catalog/nested-children";
import { resolveSiteName } from "@/lib/constants";
import {
  absoluteUrl,
  FaqPageJsonLd,
  faqItemsToSchema,
  ServiceJsonLd,
  resolveDocOgImage,
} from "@/lib/seo";

const SERVICE_BASE = {
  segment: "services" as const,
  label: "Services",
  eyebrow: "Services",
};

const SERVICE_CHILD_LABELS = { parent: "View Services", leaf: "Learn More" } as const;

export async function generateStaticParams() {
  const { services } = await getSitemapSlugs();
  return nestedStaticParamsFromEntries(SERVICE_BASE.segment, services);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug[slug.length - 1]);
  return buildNestedSlugMetadata(service, "/services", slug, "Service");
}

export default async function ServiceCatchAllPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  const [service, site] = await Promise.all([
    getServiceBySlug(slug[slug.length - 1]),
    getSiteSettings(),
  ]);
  if (!service) notFound();

  const context = buildNestedCatalogPageContext(
    SERVICE_BASE,
    slug,
    service,
    site,
  );
  ensureCanonicalNestedPath(SERVICE_BASE, service, context.currentPath);

  const servicePageUrl = absoluteUrl(context.currentPath);
  const serviceImageUrl = resolveDocOgImage(service);
  const serviceFaqSchema = faqItemsToSchema(service.faqItems);

  return (
    <NestedCatalogPageShell
      base={SERVICE_BASE}
      title={service.title}
      excerpt={service.excerpt}
      context={context}
      childCards={(context.childItems as ServiceChild[]).map((child) =>
        mapServiceChildForGrid(child, SERVICE_CHILD_LABELS),
      )}
      jsonLd={
        <>
          <ServiceJsonLd
            title={service.title}
            description={service.excerpt || service.heroBody}
            imageUrl={serviceImageUrl}
            siteName={resolveSiteName(site)}
            siteUrl={context.siteUrl}
            url={servicePageUrl}
            price={service.price}
          />
          <FaqPageJsonLd faqItems={serviceFaqSchema} />
        </>
      }
    >
      <ServiceHeroSection
        title={service.title}
        price={service.price}
        heroSubtitle={service.heroSubtitle}
        heroBody={service.heroBody}
        excerpt={service.excerpt}
        imageUrl={
          service.heroImage ? heroImageUrl(service.heroImage) : null
        }
      />

      <WhyUsImageSection
        heading={service.whyUsHeading}
        items={service.whyUs}
        imageUrl={
          service.whyUsImage
            ? urlFor(service.whyUsImage).width(700).height(700).url()
            : null
        }
        imageAlt={service.whyUsHeading || service.title}
      />

      <CommitmentSection
        heading={service.commitmentHeading}
        items={service.commitment}
      />

      <HowItWorksSection
        heading={service.howItWorksHeading}
        steps={service.howItWorks}
      />

      <CtaBandSection
        heading={service.ctaHeading}
        subtitle={service.ctaSubtitle}
        primaryLabel={service.ctaPrimaryLabel || "Get Started"}
        primaryHref="/contact"
        secondaryLabel={service.ctaSecondaryLabel || "WhatsApp Us"}
        secondaryHref={context.whatsappHref}
        footer={<SiteContactFooter site={site} />}
      />

      <PortableTextPageSection body={service.body} />

      <FaqAccordionSection
        heading={service.faqHeading}
        items={service.faqItems}
        icon="plus"
      />
    </NestedCatalogPageShell>
  );
}

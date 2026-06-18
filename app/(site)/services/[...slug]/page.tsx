import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { heroImageUrl, urlFor } from "@/sanity/lib/image";
import NestedBreadcrumbs from "@/components/content/NestedBreadcrumbs";
import NestedChildrenGrid from "@/components/content/NestedChildrenGrid";
import ServiceHeroSection from "@/components/content/ServiceHeroSection";
import WhyUsImageSection from "@/components/content/WhyUsImageSection";
import CommitmentSection from "@/components/content/CommitmentSection";
import HowItWorksSection from "@/components/content/HowItWorksSection";
import CtaBandSection from "@/components/content/CtaBandSection";
import FaqAccordionSection from "@/components/content/FaqAccordionSection";
import PortableTextPageSection from "@/components/content/PortableTextPageSection";
import { buildNestedSlugMetadata } from "@/lib/cms/page";
import { getServiceBySlug, getSiteSettings } from "@/lib/cms/queries";
import { mapServiceChildForGrid } from "@/lib/catalog/nested-children";
import { buildNestedBreadcrumbItems, getContentAncestry } from "@/lib/paths";
import { getSiteUrl } from "@/lib/seo";
import { whatsappUrl } from "@/lib/urls";

const SERVICE_CHILD_LABELS = { parent: "View Services", leaf: "Learn More" } as const;

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
  const currentSlug = slug[slug.length - 1];

  const [service, site] = await Promise.all([
    getServiceBySlug(currentSlug),
    getSiteSettings(),
  ]);
  if (!service) notFound();

  const childItems = Array.isArray(service.children) ? service.children : [];
  const hasChildren = childItems.length > 0;
  const ancestry = getContentAncestry(service);
  const currentPath = `/services/${slug.join("/")}`;
  const siteUrl = getSiteUrl();
  const whatsappHref = site?.whatsapp
    ? whatsappUrl(site.whatsapp)
    : "/contact";

  return (
    <div>
      <NestedBreadcrumbs
        base="services"
        baseLabel="Services"
        ancestry={ancestry}
        currentTitle={service.title}
        currentPath={currentPath}
        breadcrumbItems={buildNestedBreadcrumbItems(
          "services",
          "Services",
          ancestry,
          service.title,
          currentPath,
          siteUrl,
        )}
      />

      {hasChildren ? (
        <NestedChildrenGrid
          eyebrow="Services"
          title={service.title}
          excerpt={service.excerpt}
          currentPath={currentPath}
          items={childItems.map((child) =>
            mapServiceChildForGrid(child, SERVICE_CHILD_LABELS),
          )}
        />
      ) : (
        <div>
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
            secondaryHref={whatsappHref}
          />

          <PortableTextPageSection body={service.body} />

          <FaqAccordionSection
            heading={service.faqHeading}
            items={service.faqItems}
            icon="plus"
          />
        </div>
      )}
    </div>
  );
}

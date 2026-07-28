import { Mail, Phone, MessageCircle, MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import PageHeader from "@/components/layout/PageHeader";
import ProseSection from "@/components/portable-text/ProseSection";
import { FacebookIcon, YoutubeIcon } from "@/components/icons/SocialIcons";
import { defineCmsPageMetadata } from "@/lib/cms/page";
import {
  getCmsPage,
  getContactFormOptions,
  getSiteSettings,
} from "@/lib/cms/queries";
import { whatsappUrl, mapsUrl, EXTERNAL_LINK_PROPS } from "@/lib/urls";
import OpensInNewTab from "@/components/ui/OpensInNewTab";
import { sanitizePublicCopy } from "@/lib/fallbacks/cms-copy";
import { buildFooterSocialLinks } from "@/lib/fallbacks/footer-nav";

const ContactForm = dynamic(() => import("./_components/ContactForm"), {
  ssr: true,
});

export const generateMetadata = defineCmsPageMetadata("contact", {
  path: "/contact",
  fallbackTitle: "Contact Us",
  fallbackDescription:
    "Contact Aabtaab for courses, religious services, and general inquiries.",
});

export default async function ContactPage() {
  const [settings, page, formOptions] = await Promise.all([
    getSiteSettings(),
    getCmsPage("contact"),
    getContactFormOptions(),
  ]);

  const { courses, services } = formOptions;
  const socialLinks = buildFooterSocialLinks(settings).filter(
    (link) => link.variant === "icon",
  );

  const contactItems = [
    settings?.email && {
      Icon: Mail,
      label: "Email",
      value: settings.email,
      href: `mailto:${settings.email}`,
    },
    settings?.phone && {
      Icon: Phone,
      label: "Phone",
      value: settings.phone,
      href: `tel:${settings.phone}`,
    },
    settings?.whatsapp && {
      Icon: MessageCircle,
      label: "WhatsApp",
      value: settings.whatsapp,
      href: whatsappUrl(settings.whatsapp),
    },
    settings?.address && {
      Icon: MapPin,
      label: "Address",
      value: settings.address,
      href: mapsUrl(settings.address, settings.addressLink),
    },
  ].filter(Boolean) as {
    Icon: React.ElementType;
    label: string;
    value: string;
    href: string | null;
  }[];

  const submitLabel: string =
    settings?.contactFormSubmitLabel || "Send Message";

  return (
    <div>
      <PageHeader
        maxWidth="lg"
        eyebrow={page?.eyebrow || "Reach Out"}
        title={page?.title || "Contact Us"}
        subtitle={
          sanitizePublicCopy(page?.subtitle)
            ?.replace(/\bavailable\s*24\/7\b/gi, "happy to help")
            ?.replace(/\b24\/7\b/g, "")
            ?.replace(/\s{2,}/g, " ")
            ?.trim() ||
          "Get in touch for services, courses, or general inquiries"
        }
      />

      <div className="section-muted">
        <div className="container-wide">
          {page?.body && (
            <div className="prose prose-sm mb-8 max-w-copy text-gray-700">
              <ProseSection value={page.body} variant="article" />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-start">
            <div className="lg:col-span-2 space-y-3">
              {contactItems.map(({ Icon, label, value, href }) => (
                <div
                  key={label}
                  className="card-contact"
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0">
                    <Icon
                      size={14}
                      className="text-brand-700"
                      strokeWidth={1.75}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="heading-col mb-0.5">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        {...(href.startsWith("http") ? EXTERNAL_LINK_PROPS : {})}
                        className="text-sm-plus text-slate-700 transition-colors break-all hover:text-brand-700"
                      >
                        {value}
                        {href.startsWith("http") ? <OpensInNewTab /> : null}
                      </a>
                    ) : (
                      <p className="text-sm-plus text-slate-700 whitespace-pre-line">
                        {value}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {socialLinks.length > 0 && (
                <div className="flex gap-2 pt-1">
                  {socialLinks.map((link) => (
                    <a
                      key={link.key}
                      href={link.href}
                      {...EXTERNAL_LINK_PROPS}
                      className="chip-outline"
                    >
                      {link.key === "facebook" ? (
                        <FacebookIcon size={13} />
                      ) : (
                        <YoutubeIcon size={13} />
                      )}{" "}
                      {link.label}
                      <OpensInNewTab />
                    </a>
                  ))}
                </div>
              )}

              {contactItems.length === 0 && (
                <p className="text-body-muted">
                  Use the form to reach us — we typically reply soon.
                </p>
              )}
            </div>

            <ContactForm
              submitLabel={submitLabel}
              courses={courses}
              services={services}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

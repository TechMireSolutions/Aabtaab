import { Mail, Phone, MessageCircle, MapPin } from "lucide-react";
import ContactForm from "./_components/ContactForm";
import PageHeader from "@/components/layout/PageHeader";
import ProseSection from "@/components/portable-text/ProseSection";
import { FacebookIcon, YoutubeIcon } from "@/components/icons/SocialIcons";
import { defineCmsPageMetadata } from "@/lib/cms/page";
import {
  getCmsPage,
  getContactFormOptions,
  getSiteSettings,
} from "@/lib/cms/queries";
import { whatsappUrl } from "@/lib/urls";

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
      href: null,
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
          page?.subtitle ||
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
                      className="text-brand-600"
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
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="text-sm-plus text-slate-700 hover:text-brand-600 transition-colors break-all"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm-plus text-slate-700 whitespace-pre-line">
                        {value}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {(settings?.facebook || settings?.youtube) && (
                <div className="flex gap-2 pt-1">
                  {settings?.facebook && (
                    <a
                      href={settings.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="chip-outline"
                    >
                      <FacebookIcon size={13} /> Facebook
                    </a>
                  )}
                  {settings?.youtube && (
                    <a
                      href={settings.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="chip-outline"
                    >
                      <YoutubeIcon size={13} /> YouTube
                    </a>
                  )}
                </div>
              )}

              {contactItems.length === 0 && (
                <p className="text-body-muted italic">
                  Add contact details in Sanity Studio → Site Settings.
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

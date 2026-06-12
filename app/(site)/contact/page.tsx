import type { Metadata } from "next";
import { sanityFetch, CACHE_TAGS } from "@/sanity/lib/sanityFetch";
import {
  siteSettingsQuery,
  pageBySlugQuery,
  allCoursesForFormQuery,
  allServicesForFormQuery,
} from "@/sanity/lib/queries";
import { PortableText } from "@portabletext/react";
import { Mail, Phone, MessageCircle, MapPin } from "lucide-react";
import ContactForm from "./ContactForm";

interface ContactSettings {
  email?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  facebook?: string;
  youtube?: string;
  contactFormSubjects?: string[];
  contactFormSubmitLabel?: string;
}

interface ContactPage {
  seo?: { metaTitle?: string; metaDescription?: string };
  seoTitle?: string;
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  body?: unknown[];
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await sanityFetch<ContactPage>({
    query: pageBySlugQuery,
    params: { slug: "contact" },
    tags: [CACHE_TAGS.siteSettings],
    revalidate: 86400,
  });
  return {
    title:
      page?.seo?.metaTitle || page?.seoTitle || page?.title || "Contact Us",
    description: page?.seo?.metaDescription || page?.subtitle,
  };
}

function FacebookIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function YoutubeIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export default async function ContactPage() {
  const [settings, page, courses, services] = await Promise.all([
    sanityFetch<ContactSettings>({
      query: siteSettingsQuery,
      tags: [CACHE_TAGS.siteSettings],
      revalidate: 86400,
    }),
    sanityFetch<ContactPage>({
      query: pageBySlugQuery,
      params: { slug: "contact" },
      tags: [CACHE_TAGS.siteSettings],
      revalidate: 86400,
    }),
    sanityFetch<{ _id: string; title: string }[]>({
      query: allCoursesForFormQuery,
      tags: [CACHE_TAGS.courses],
      revalidate: 3600,
    }),
    sanityFetch<{ _id: string; title: string }[]>({
      query: allServicesForFormQuery,
      tags: [CACHE_TAGS.services],
      revalidate: 3600,
    }),
  ]);

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
      href: `https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`,
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

  const subjects: string[] = settings?.contactFormSubjects?.length
    ? settings.contactFormSubjects
    : ["General Inquiry", "Course Enrollment", "Service Request", "Donation"];

  const submitLabel: string =
    settings?.contactFormSubmitLabel || "Send Message";

  return (
    <div>
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <p className="flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.18em] text-cyan-600 mb-3">
            <span className="w-5 h-px bg-cyan-400 inline-block" />
            {page?.eyebrow || "Reach Out"}
          </p>
          <h1 className="font-bold text-[26px] sm:text-[30px] text-slate-900 tracking-[-0.02em] mb-2">
            {page?.title || "Contact Us"}
          </h1>
          <p className="text-[13.5px] text-gray-500">
            {page?.subtitle ||
              "Get in touch for services, courses, or general inquiries"}
          </p>
        </div>
      </div>

      <div className="py-8 sm:py-12 bg-slate-50/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {page?.body && (
            <div className="prose prose-sm max-w-2xl mb-8 text-gray-700">
              <PortableText
                value={page.body as Parameters<typeof PortableText>[0]["value"]}
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-start">
            {/* Contact info */}
            <div className="lg:col-span-2 space-y-3">
              {contactItems.map(({ Icon, label, value, href }) => (
                <div
                  key={label}
                  className="flex items-start gap-3 sm:gap-3.5 bg-white border border-gray-100 rounded-xl px-4 py-3.5 shadow-sm"
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center shrink-0">
                    <Icon
                      size={14}
                      className="text-cyan-600"
                      strokeWidth={1.75}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400 mb-0.5">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="text-[13px] text-slate-700 hover:text-cyan-600 transition-colors break-all"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-[13px] text-slate-700 whitespace-pre-line">
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
                      className="flex items-center gap-1.5 text-[12px] font-medium text-gray-500 hover:text-cyan-600 bg-white border border-gray-200 rounded-lg px-3 py-2 transition-colors"
                    >
                      <FacebookIcon size={13} /> Facebook
                    </a>
                  )}
                  {settings?.youtube && (
                    <a
                      href={settings.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[12px] font-medium text-gray-500 hover:text-cyan-600 bg-white border border-gray-200 rounded-lg px-3 py-2 transition-colors"
                    >
                      <YoutubeIcon size={13} /> YouTube
                    </a>
                  )}
                </div>
              )}

              {contactItems.length === 0 && (
                <p className="text-[13px] text-gray-400 italic">
                  Add contact details in Sanity Studio → Site Settings.
                </p>
              )}
            </div>

            {/* Form */}
            <ContactForm
              subjects={subjects}
              submitLabel={submitLabel}
              courses={courses ?? []}
              services={services ?? []}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { siteSettingsQuery, pageBySlugQuery, allCoursesForFormQuery, allServicesForFormQuery } from '@/sanity/lib/queries'
import { PortableText } from '@portabletext/react'
import { Mail, Phone, MessageCircle, MapPin, Facebook, Youtube } from 'lucide-react'
import ContactForm from './ContactForm'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const page = await client.fetch(pageBySlugQuery, { slug: 'contact' })
  return {
    title: page?.seoTitle || page?.title || 'Contact Us',
    description: page?.seoDescription || page?.subtitle,
  }
}

export default async function ContactPage() {
  const [settings, page, courses, services] = await Promise.all([
    client.fetch(siteSettingsQuery),
    client.fetch(pageBySlugQuery, { slug: 'contact' }),
    client.fetch(allCoursesForFormQuery),
    client.fetch(allServicesForFormQuery),
  ])

  const contactItems = [
    settings?.email    && { Icon: Mail,          label: 'Email',    value: settings.email,    href: `mailto:${settings.email}` },
    settings?.phone    && { Icon: Phone,         label: 'Phone',    value: settings.phone,    href: `tel:${settings.phone}` },
    settings?.whatsapp && { Icon: MessageCircle, label: 'WhatsApp', value: settings.whatsapp, href: `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}` },
    settings?.address  && { Icon: MapPin,        label: 'Address',  value: settings.address,  href: null },
  ].filter(Boolean) as { Icon: any; label: string; value: string; href: string | null }[]

  const subjects: string[] = settings?.contactFormSubjects?.length
    ? settings.contactFormSubjects
    : ['General Inquiry', 'Course Enrollment', 'Service Request', 'Donation']

  const submitLabel: string = settings?.contactFormSubmitLabel || 'Send Message'

  return (
    <div>
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <p className="flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.18em] text-cyan-600 mb-3">
            <span className="w-5 h-px bg-cyan-400 inline-block" />
            {page?.eyebrow || 'Reach Out'}
          </p>
          <h1 className="font-bold text-[26px] sm:text-[30px] text-slate-900 tracking-[-0.02em] mb-2">
            {page?.title || 'Contact Us'}
          </h1>
          <p className="text-[13.5px] text-gray-500">
            {page?.subtitle || 'Get in touch for services, courses, or general inquiries'}
          </p>
        </div>
      </div>

      <div className="py-8 sm:py-12 bg-slate-50/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {page?.body && (
            <div className="prose prose-sm max-w-2xl mb-8 text-gray-700">
              <PortableText value={page.body} />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-start">

            {/* Contact info */}
            <div className="lg:col-span-2 space-y-3">
              {contactItems.map(({ Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-3 sm:gap-3.5 bg-white border border-gray-100 rounded-xl px-4 py-3.5 shadow-sm">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center flex-shrink-0">
                    <Icon size={14} className="text-cyan-600" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400 mb-0.5">{label}</p>
                    {href ? (
                      <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                        className="text-[13px] text-slate-700 hover:text-cyan-600 transition-colors break-all">
                        {value}
                      </a>
                    ) : (
                      <p className="text-[13px] text-slate-700 whitespace-pre-line">{value}</p>
                    )}
                  </div>
                </div>
              ))}

              {(settings?.facebook || settings?.youtube) && (
                <div className="flex gap-2 pt-1">
                  {settings?.facebook && (
                    <a href={settings.facebook} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[12px] font-medium text-gray-500 hover:text-cyan-600 bg-white border border-gray-200 rounded-lg px-3 py-2 transition-colors">
                      <Facebook size={13} /> Facebook
                    </a>
                  )}
                  {settings?.youtube && (
                    <a href={settings.youtube} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[12px] font-medium text-gray-500 hover:text-cyan-600 bg-white border border-gray-200 rounded-lg px-3 py-2 transition-colors">
                      <Youtube size={13} /> YouTube
                    </a>
                  )}
                </div>
              )}

              {contactItems.length === 0 && (
                <p className="text-[13px] text-gray-400 italic">Add contact details in Sanity Studio → Site Settings.</p>
              )}
            </div>

            {/* Form */}
            <ContactForm
              subjects={subjects}
              submitLabel={submitLabel}
              courses={courses  ?? []}
              services={services ?? []}
            />

          </div>
        </div>
      </div>
    </div>
  )
}

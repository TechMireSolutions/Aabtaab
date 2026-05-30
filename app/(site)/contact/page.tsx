import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { siteSettingsQuery, pageBySlugQuery } from '@/sanity/lib/queries'
import { PortableText } from '@portabletext/react'

export const revalidate = 60
export const metadata: Metadata = { title: 'Contact' }

export default async function ContactPage() {
  const [settings, page] = await Promise.all([
    client.fetch(siteSettingsQuery),
    client.fetch(pageBySlugQuery, { slug: 'contact' }),
  ])

  return (
    <div className="py-14">
      <div className="container-main max-w-3xl">
        <h1 className="section-title text-4xl mb-2">{page?.title || 'Contact Us'}</h1>
        <p className="text-gray-500 mb-10">Get in touch for services, courses, or general inquiries</p>

        {page?.body && (
          <div className="prose prose-sm max-w-none text-gray-700 mb-10">
            <PortableText value={page.body} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact info from Sanity siteSettings */}
          <div className="space-y-6">
            {settings?.email && (
              <div>
                <h3 className="font-semibold text-primary-700 mb-1">Email</h3>
                <a href={`mailto:${settings.email}`} className="text-gray-600 hover:text-primary-500">{settings.email}</a>
              </div>
            )}
            {settings?.phone && (
              <div>
                <h3 className="font-semibold text-primary-700 mb-1">Phone</h3>
                <a href={`tel:${settings.phone}`} className="text-gray-600 hover:text-primary-500">{settings.phone}</a>
              </div>
            )}
            {settings?.whatsapp && (
              <div>
                <h3 className="font-semibold text-primary-700 mb-1">WhatsApp</h3>
                <a href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary-500">{settings.whatsapp}</a>
              </div>
            )}
            {settings?.address && (
              <div>
                <h3 className="font-semibold text-primary-700 mb-1">Address</h3>
                <p className="text-gray-600 whitespace-pre-line">{settings.address}</p>
              </div>
            )}
            <div className="flex gap-4 pt-2">
              {settings?.facebook && (
                <a href={settings.facebook} target="_blank" rel="noopener noreferrer"
                  className="text-sm text-primary-500 hover:underline">Facebook</a>
              )}
              {settings?.youtube && (
                <a href={settings.youtube} target="_blank" rel="noopener noreferrer"
                  className="text-sm text-primary-500 hover:underline">YouTube</a>
              )}
            </div>

            {/* Fallback if no settings yet */}
            {!settings?.email && !settings?.phone && (
              <p className="text-sm text-gray-400 italic">
                Add your contact details in Sanity Studio → Site Settings.
              </p>
            )}
          </div>

          {/* Contact Form */}
          <form className="space-y-4" action="#" method="POST">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" name="name" required
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" name="email" required
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <select name="subject"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option>General Inquiry</option>
                <option>Course Enrollment</option>
                <option>Service Request</option>
                <option>Donation</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea name="message" rows={4} required
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <button type="submit" className="btn-primary w-full justify-center">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  )
}

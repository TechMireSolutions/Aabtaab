import { createClient } from '@sanity/client'
import { NextResponse }  from 'next/server'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token:     process.env.SANITY_API_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
})

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, phone, country, city, purpose, appliedFor, message } = await req.json()

    if (!firstName || !email || !phone || !country || !city || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await client.create({
      _type: 'contactSubmission',
      firstName,
      lastName:   lastName   || undefined,
      email,
      phone,
      country,
      city,
      purpose:    purpose    || 'general',
      appliedFor: appliedFor || undefined,
      message,
      submittedAt: new Date().toISOString(),
      status: 'new',
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact form error:', err)
    return NextResponse.json({ error: 'Failed to save submission' }, { status: 500 })
  }
}

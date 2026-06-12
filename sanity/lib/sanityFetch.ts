import { createClient, type QueryParams } from 'next-sanity'
import { unstable_cache } from 'next/cache'

// ── Sanity client (same config as client.ts, exported for direct use too) ────
export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  // CDN in production for read speed; bypass in dev for latest drafts
  useCdn: process.env.NODE_ENV === 'production',
})

// ── Cache tag helpers ─────────────────────────────────────────────────────────
// Tags are used by the /api/revalidate webhook to surgically invalidate cache
// when an editor publishes a change in Sanity Studio.
export const CACHE_TAGS = {
  all:          'sanity-all',
  posts:        'sanity-posts',
  post:         (slug: string) => `sanity-post-${slug}`,
  events:       'sanity-events',
  event:        (slug: string) => `sanity-event-${slug}`,
  courses:      'sanity-courses',
  course:       (slug: string) => `sanity-course-${slug}`,
  services:     'sanity-services',
  service:      (slug: string) => `sanity-service-${slug}`,
  siteSettings: 'sanity-site-settings',
  homepage:     'sanity-homepage',
} as const

// ── Core typed fetch utility ──────────────────────────────────────────────────
// Usage:
//   const post = await sanityFetch<Post>({ query: postBySlugQuery, params: { slug }, tags: [CACHE_TAGS.post(slug)] })
//
// Why unstable_cache?
//   Next.js 15 App Router caches per route segment. unstable_cache lets us
//   share a single in-memory + filesystem cache keyed by GROQ query + params,
//   so two RSCs on the same page requesting the same data only hit Sanity once.
//   The cache is invalidated via revalidateTag() in the webhook handler.

interface SanityFetchOptions<T> {
  query:      string
  params?:    QueryParams
  tags?:      string[]
  revalidate?: number | false
}

export async function sanityFetch<T>({
  query,
  params     = {},
  tags       = [],
  revalidate = 3600, // default: revalidate every hour as a fallback
}: SanityFetchOptions<T>): Promise<T> {
  // In development: always fetch live (no caching) so edits appear instantly
  if (process.env.NODE_ENV !== 'production') {
    return sanityClient.fetch<T>(query, params)
  }

  const cachedFetch = unstable_cache(
    async () => sanityClient.fetch<T>(query, params),
    // Cache key = stringified query + params
    [query, JSON.stringify(params)],
    {
      tags:      [CACHE_TAGS.all, ...tags],
      revalidate: revalidate === false ? undefined : revalidate,
    }
  )

  return cachedFetch()
}

// ── Convenience wrappers for common content types ─────────────────────────────

export async function fetchSiteSettings() {
  const { siteSettingsQuery } = await import('./queries')
  return sanityFetch<SiteSettings>({
    query:      siteSettingsQuery,
    tags:       [CACHE_TAGS.siteSettings],
    revalidate: 86400, // site settings change rarely — 24h
  })
}

// ── Shared TypeScript interfaces (minimal — extend in your feature types) ─────

export interface SeoData {
  metaTitle?:      string
  metaDescription?: string
  ogImage?:        { asset: { _ref: string }; alt?: string }
  canonicalUrl?:   string
  noIndex?:        boolean
  keywords?:       string[]
}

export interface SiteSettings {
  siteName?:    string
  description?: string
  favicon?:     { asset: { _ref: string } }
  siteUrl?:     string
  logo?:        { asset: { _ref: string }; alt?: string }
  // Social
  twitterHandle?: string
  facebookUrl?:   string
  instagramUrl?:  string
  youtubeUrl?:    string
  // Contact
  email?:         string
  phone?:         string
  address?:       string
  city?:          string
  state?:         string
  country?:       string
}

export interface FaqItem {
  question: string
  answer:   string
}

export interface Post {
  _id:          string
  title:        string
  slug:         { current: string }
  excerpt?:     string
  mainImage?:   { asset: { _ref: string }; alt?: string }
  publishedAt?: string
  categories?:  Array<{ _id: string; title: string; slug: { current: string } }>
  author?:      { name: string; image?: { asset: { _ref: string } }; bio?: unknown[] }
  body?:        unknown[]
  faqItems?:    FaqItem[]
  seo?:         SeoData
}

export interface Event {
  _id:               string
  title:             string
  slug:              { current: string }
  description?:      string
  body?:             unknown[]
  eventType?:        string
  status?:           string
  startDate:         string
  endDate?:          string
  image?:            { asset: { _ref: string }; alt?: string }
  venueName?:        string
  streetAddress?:    string
  city?:             string
  state?:            string
  postalCode?:       string
  country?:          string
  onlineUrl?:        string
  organizerName?:    string
  organizerUrl?:     string
  registrationUrl?:  string
  isFree?:           boolean
  price?:            string
  seo?:              SeoData
}

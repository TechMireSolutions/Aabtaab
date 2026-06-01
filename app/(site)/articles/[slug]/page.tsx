import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { postBySlugQuery, postSlugsQuery } from '@/sanity/lib/queries'
import { PortableText } from '@portabletext/react'

export const revalidate = 60

export async function generateStaticParams() {
  const slugs = await client.fetch(postSlugsQuery)
  return slugs.map(({ slug }: { slug: string }) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await client.fetch(postBySlugQuery, { slug })
  return {
    title: post?.seoTitle ?? post?.title ?? 'Article',
    description: post?.seoDescription ?? post?.excerpt,
    openGraph: post?.mainImage ? { images: [urlFor(post.mainImage).width(1200).height(630).url()] } : undefined,
  }
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await client.fetch(postBySlugQuery, { slug })
  if (!post) notFound()

  return (
    <div className="py-14">
      <div className="container-main max-w-3xl">
        <Link href="/articles" className="text-primary-500 text-sm hover:underline mb-8 inline-block">← Back to Articles</Link>

        <article>
          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories?.map((cat: any) => (
              <span key={cat._id} className="text-xs bg-primary-50 text-primary-600 px-3 py-1 rounded-full">{cat.title}</span>
            ))}
          </div>

          <h1 className="text-4xl font-bold text-primary-800 leading-tight mb-4">{post.title}</h1>

          <div className="flex items-center gap-3 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100">
            {post.author?.name && <span className="font-medium text-gray-700">{post.author.name}</span>}
            {post.publishedAt && <span>{new Date(post.publishedAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}</span>}
          </div>

          {post.mainImage && (
            <div className="relative h-72 w-full rounded-xl overflow-hidden mb-8">
              <Image src={urlFor(post.mainImage).width(900).height(500).url()} alt={post.mainImage.alt ?? post.title} fill className="object-cover" />
            </div>
          )}

          {post.body && (
            <div className="prose prose-lg prose-primary max-w-none text-gray-800">
              <PortableText value={post.body} />
            </div>
          )}
        </article>
      </div>
    </div>
  )
}

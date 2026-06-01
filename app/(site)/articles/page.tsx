import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { postsQuery } from '@/sanity/lib/queries'
import ContentCard from '@/components/ui/ContentCard'

export const revalidate = 60
export const metadata: Metadata = { title: 'Articles' }

export default async function ArticlesPage() {
  const posts = await client.fetch(postsQuery)

  return (
    <div className="py-14">
      <div className="max-w-7xl mx-auto px-8">

        <p className="text-[11px] font-semibold text-cyan-500 uppercase tracking-widest mb-1">Knowledge</p>
        <h1 className="text-[32px] font-bold text-gray-900 mb-1">Articles</h1>
        <p className="text-[14px] text-gray-500 mb-12">Islamic knowledge, news &amp; reflections</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: any, i: number) => (
            <ContentCard
              key={post._id}
              href={`/articles/${post.slug.current}`}
              image={post.mainImage ? urlFor(post.mainImage).width(600).height(450).url() : null}
              title={post.title}
              description={post.excerpt || null}
              badge={post.categories?.[0]?.title || null}
              ctaLabel="Read More"
              active={i % 3 === 1}
            />
          ))}
        </div>

        {posts.length === 0 && (
          <p className="text-gray-400 text-center py-24">No articles published yet.</p>
        )}
      </div>
    </div>
  )
}

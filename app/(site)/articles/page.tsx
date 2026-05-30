import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { postsQuery } from '@/sanity/lib/queries'

export const revalidate = 60
export const metadata: Metadata = { title: 'Articles' }

export default async function ArticlesPage() {
  const posts = await client.fetch(postsQuery)

  return (
    <div className="py-14">
      <div className="container-main">
        <h1 className="section-title text-4xl mb-2">Articles</h1>
        <p className="text-gray-500 mb-10">Islamic knowledge, news, and reflections</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post: any) => (
            <Link key={post._id} href={`/articles/${post.slug.current}`}
              className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              {post.mainImage ? (
                <div className="relative h-48 w-full">
                  <Image src={urlFor(post.mainImage).width(600).height(350).url()} alt={post.mainImage.alt ?? post.title} fill className="object-cover" />
                </div>
              ) : (
                <div className="h-48 bg-primary-50 flex items-center justify-center">
                  <span className="text-4xl">📖</span>
                </div>
              )}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex flex-wrap gap-1 mb-3">
                  {post.categories?.map((cat: any) => (
                    <span key={cat._id} className="text-xs bg-primary-50 text-primary-600 px-2 py-0.5 rounded-full">{cat.title}</span>
                  ))}
                </div>
                <h2 className="font-bold text-primary-800 group-hover:text-primary-500 transition-colors leading-snug mb-2">{post.title}</h2>
                {post.excerpt && <p className="text-sm text-gray-500 line-clamp-2 flex-1">{post.excerpt}</p>}
                <p className="text-xs text-gray-400 mt-3">
                  {post.author?.name && <span className="mr-2">{post.author.name}</span>}
                  {post.publishedAt && new Date(post.publishedAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <p className="text-gray-400 text-center py-20">No articles published yet.</p>
        )}
      </div>
    </div>
  )
}

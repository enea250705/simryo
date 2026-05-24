import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/db"
import type { Metadata } from "next"

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug, published: true } })
  if (!post) return { title: "Post not found | SIMRYO" }
  return {
    title: `${post.title} | SIMRYO`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.image ? [{ url: post.image, width: 1200, height: 630 }] : [],
      type: "article",
    },
    alternates: { canonical: `https://simryo.com/blog/${post.slug}` },
  }
}

export default async function DynamicBlogPost({ params }: Props) {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug, published: true } })
  if (!post) notFound()

  const publishedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric"
  })

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">

        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-8">
          ← All articles
        </Link>

        <header className="mb-10">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">{post.category}</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight">{post.title}</h1>
          {post.excerpt && (
            <p className="text-gray-500 mb-5 leading-relaxed">{post.excerpt}</p>
          )}
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-8">
            <span className="font-medium text-gray-600">{post.author}</span>
            <span>·</span>
            <span>{publishedDate}</span>
            <span>·</span>
            <span>{post.readTime} min read</span>
          </div>
          {post.image && (
            <div className="relative h-56 sm:h-64 rounded-2xl overflow-hidden bg-gray-100">
              <Image src={post.image} alt={post.title} fill className="object-cover" priority />
            </div>
          )}
        </header>

        <article
          className="prose prose-gray max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-12 pt-8 border-t border-gray-100">
          <Link href="/blog" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
            ← Back to all articles
          </Link>
        </div>
      </div>
    </div>
  )
}

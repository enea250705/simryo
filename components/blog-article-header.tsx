import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, ArrowLeft } from "lucide-react"

interface BlogArticleHeaderProps {
  title: string
  excerpt?: string
  category: string
  author: string
  publishedAt: string
  readTime: number
  image: string
  imageAlt: string
}

export function BlogArticleHeader({
  title, excerpt, category, author, publishedAt, readTime, image, imageAlt
}: BlogArticleHeaderProps) {
  const fmt = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <header className="border-b border-gray-100 pb-8 mb-10">
      <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-8">
        <ArrowLeft className="h-4 w-4" />
        All articles
      </Link>

      <div className="mb-4">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{category}</span>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight">{title}</h1>

      {excerpt && <p className="text-base text-gray-500 mb-6 leading-relaxed">{excerpt}</p>}

      <div className="flex items-center gap-4 text-xs text-gray-400 mb-8">
        <span className="font-medium text-gray-600">{author}</span>
        <span>·</span>
        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{fmt(publishedAt)}</span>
        <span>·</span>
        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{readTime} min read</span>
      </div>

      <div className="relative h-56 sm:h-72 rounded-2xl overflow-hidden bg-gray-100">
        <Image src={image} alt={imageAlt} fill className="object-cover" priority />
      </div>
    </header>
  )
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyAdminToken } from '@/lib/admin-auth'
import { STATIC_BLOG_POSTS } from '@/lib/static-blog-posts'

export async function GET(request: NextRequest) {
  if (!verifyAdminToken(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const dbPosts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } })

  // Merge DB posts with static hardcoded posts (static shown as read-only)
  const dbSlugs = new Set(dbPosts.map(p => p.slug))
  const staticPosts = STATIC_BLOG_POSTS
    .filter(p => !dbSlugs.has(p.slug)) // skip if already in DB
    .map(p => ({
      id: `static:${p.slug}`,
      slug: p.slug,
      title: p.title,
      category: p.category,
      author: p.author,
      published: true,
      publishedAt: p.publishedAt,
      readTime: p.readTime,
      source: 'static' as const,
    }))

  const posts = [
    ...dbPosts.map(p => ({ ...p, source: 'db' as const })),
    ...staticPosts,
  ].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

  return NextResponse.json({ success: true, posts })
}

export async function POST(request: NextRequest) {
  if (!verifyAdminToken(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await request.json()
    const { title, slug, excerpt, content, image, category, author, readTime, published } = body

    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'title, slug, content required' }, { status: 400 })
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt: excerpt || '',
        content,
        image: image || '',
        category: category || 'General',
        author: author || 'SIMRYO Team',
        readTime: readTime || 5,
        published: published ?? false,
        publishedAt: published ? new Date() : new Date(),
      }
    })
    return NextResponse.json({ success: true, post }, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}

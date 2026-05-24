import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
    select: { id: true, slug: true, title: true, excerpt: true, image: true, category: true, author: true, readTime: true, publishedAt: true }
  })
  return NextResponse.json({ success: true, posts })
}

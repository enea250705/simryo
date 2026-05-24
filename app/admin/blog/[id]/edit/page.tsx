"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { BlogForm } from "../../_components/blog-form"

export default function EditBlogPost() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    fetch(`/api/admin/blog/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async r => {
        if (r.status === 401) {
          router.push('/admin/login')
          return
        }
        const d = await r.json()
        if (d.success) setPost(d.post)
      })
      .finally(() => setLoading(false))
  }, [id, router])

  if (loading) return <div className="p-8 text-sm text-gray-400">Loading...</div>
  if (!post) return <div className="p-8 text-sm text-red-500">Post not found</div>

  return <BlogForm mode="edit" initialData={post} />
}

"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { BlogForm } from "../../_components/blog-form"

export default function EditBlogPost() {
  const { id } = useParams<{ id: string }>()
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    fetch(`/api/admin/blog/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => { if (d.success) setPost(d.post) })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="p-8 text-sm text-gray-400">Loading...</div>
  if (!post) return <div className="p-8 text-sm text-red-500">Post not found</div>

  return <BlogForm mode="edit" initialData={post} />
}

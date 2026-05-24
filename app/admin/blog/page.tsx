"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, Edit, Trash2, Eye, EyeOff, RefreshCw } from "lucide-react"
import { toast } from "sonner"

interface BlogPost {
  id: string
  slug: string
  title: string
  category: string
  author: string
  published: boolean
  publishedAt: string
  readTime: number
}

function authHeaders() {
  const token = localStorage.getItem("admin_token")
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/blog", { headers: authHeaders() })
      if (res.status === 401) {
        router.push('/admin/login')
        return
      }
      const data = await res.json()
      if (data.success) setPosts(data.posts)
      else toast.error("Failed to load posts")
    } catch {
      toast.error("Failed to load posts")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const togglePublish = async (post: BlogPost) => {
    try {
      const res = await fetch(`/api/admin/blog/${post.id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ published: !post.published }),
      })
      const data = await res.json()
      if (data.success) {
        setPosts(prev => prev.map(p => p.id === post.id ? { ...p, published: !p.published } : p))
        toast.success(post.published ? "Post unpublished" : "Post published")
      }
    } catch {
      toast.error("Failed to update post")
    }
  }

  const deletePost = async (post: BlogPost) => {
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return
    try {
      await fetch(`/api/admin/blog/${post.id}`, { method: "DELETE", headers: authHeaders() })
      setPosts(prev => prev.filter(p => p.id !== post.id))
      toast.success("Post deleted")
    } catch {
      toast.error("Failed to delete post")
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-sm text-gray-500 mt-1">{posts.length} posts total</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Link href="/admin/blog/new">
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Plus className="h-4 w-4 mr-1.5" />
              New Post
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-gray-400 text-sm">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">No posts yet.</p>
            <Link href="/admin/blog/new">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Plus className="h-4 w-4 mr-1.5" />
                Write your first post
              </Button>
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                <th className="px-5 py-3 font-medium text-gray-500">Title</th>
                <th className="px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Category</th>
                <th className="px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">Author</th>
                <th className="px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 font-medium text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.map(post => (
                <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-gray-900 truncate max-w-xs">{post.title}</div>
                    <div className="text-xs text-gray-400 mt-0.5">/blog/{post.slug}</div>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{post.category}</span>
                  </td>
                  <td className="px-4 py-3.5 text-gray-600 hidden lg:table-cell">{post.author}</td>
                  <td className="px-4 py-3.5">
                    <Badge className={post.published ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-100 text-gray-500 border-gray-200"}>
                      {post.published ? "Published" : "Draft"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1 justify-end">
                      {post.published && (
                        <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-gray-700">
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        </a>
                      )}
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600" onClick={() => togglePublish(post)}>
                        {post.published ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </Button>
                      <Link href={`/admin/blog/${post.id}/edit`}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600">
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-red-600" onClick={() => deletePost(post)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

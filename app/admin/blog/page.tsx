"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, Edit, Trash2, Eye, EyeOff, LogOut, RefreshCw } from "lucide-react"
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
  source: 'db' | 'static'
}

function token() {
  return typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : ""
}

function authHeaders() {
  return { "Content-Type": "application/json", Authorization: `Bearer ${token()}` }
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/blog", { headers: authHeaders() })
      if (res.status === 401) { router.push("/admin/login"); return }
      const data = await res.json()
      if (data.success) setPosts(data.posts)
    } catch {
      toast.error("Failed to load posts")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const togglePublish = async (post: BlogPost) => {
    if (post.source === 'static') return
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
      toast.error("Failed to update")
    }
  }

  const deletePost = async (post: BlogPost) => {
    if (post.source === 'static') return
    if (!confirm(`Delete "${post.title}"?`)) return
    try {
      await fetch(`/api/admin/blog/${post.id}`, { method: "DELETE", headers: authHeaders() })
      setPosts(prev => prev.filter(p => p.id !== post.id))
      toast.success("Post deleted")
    } catch {
      toast.error("Failed to delete")
    }
  }

  const logout = () => {
    localStorage.removeItem("admin_token")
    document.cookie = "admin_token=; Max-Age=0; path=/"
    router.push("/admin/login")
  }

  const fmt = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-base font-bold text-gray-900">SIMRYO</span>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-medium text-gray-600">Blog</span>
        </div>
        <div className="flex items-center gap-2">
          <a href="/" target="_blank" className="text-xs text-gray-400 hover:text-gray-700 transition-colors mr-2">
            View site ↗
          </a>
          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Blog Posts</h1>
            <p className="text-sm text-gray-500 mt-0.5">{posts.length} post{posts.length !== 1 ? "s" : ""}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={load}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:border-gray-300 text-gray-600 transition-colors disabled:opacity-40"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <Link
              href="/admin/blog/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              New Post
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="text-center py-16 text-gray-400 text-sm">Loading...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-sm mb-4">No posts yet.</p>
              <Link
                href="/admin/blog/new"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                Write your first post
              </Link>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <th className="px-5 py-3">Title</th>
                  <th className="px-4 py-3 hidden sm:table-cell">Category</th>
                  <th className="px-4 py-3 hidden md:table-cell">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {posts.map(post => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-gray-900 truncate max-w-xs">{post.title}</div>
                      <div className="text-xs text-gray-400 mt-0.5">/blog/{post.slug}</div>
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{post.category}</span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-500 hidden md:table-cell">{fmt(post.publishedAt)}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
                          post.published
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-gray-100 text-gray-500 border-gray-200"
                        }`}>
                          {post.published ? "Live" : "Draft"}
                        </span>
                        {post.source === 'static' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200">
                            Static
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1 justify-end">
                        <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                          <button title="View live" className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                        </a>
                        {post.source === 'db' && (
                          <>
                            <button
                              onClick={() => togglePublish(post)}
                              title={post.published ? "Unpublish" : "Publish"}
                              className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            >
                              {post.published ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                            </button>
                            <Link href={`/admin/blog/${post.id}/edit`}>
                              <button title="Edit" className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                                <Edit className="h-3.5 w-3.5" />
                              </button>
                            </Link>
                            <button
                              onClick={() => deletePost(post)}
                              title="Delete"
                              className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

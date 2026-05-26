"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface BlogFormData {
  title: string
  slug: string
  excerpt: string
  content: string
  image: string
  category: string
  author: string
  readTime: number
  published: boolean
}

interface BlogFormProps {
  initialData?: Partial<BlogFormData> & { id?: string }
  mode: "new" | "edit"
}

const CATEGORIES = ["Travel Guides", "eSIM Technology", "Digital Nomad", "Setup Guides", "Comparisons", "General"]

function slugify(str: string) {
  return str.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-")
}

function authHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : ""
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
}

export function BlogForm({ initialData, mode }: BlogFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [preview, setPreview] = useState(false)
  const [form, setForm] = useState<BlogFormData>({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    image: initialData?.image || "",
    category: initialData?.category || "Travel Guides",
    author: initialData?.author || "SIMRYO Team",
    readTime: initialData?.readTime || 5,
    published: initialData?.published ?? false,
  })

  const set = (key: keyof BlogFormData, value: any) => {
    setForm(prev => {
      const next = { ...prev, [key]: value }
      if (key === "title" && mode === "new") next.slug = slugify(value)
      return next
    })
  }

  const save = async () => {
    if (!form.title || !form.slug || !form.content) {
      toast.error("Title, slug, and content are required")
      return
    }
    setSaving(true)
    try {
      const url = mode === "new" ? "/api/admin/blog" : `/api/admin/blog/${initialData?.id}`
      const method = mode === "new" ? "POST" : "PUT"
      const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(form) })
      if (res.status === 401) {
        toast.error("Session expired. Please sign in again.")
        router.push("/admin/login")
        return
      }
      const data = await res.json()
      if (data.success) {
        toast.success(mode === "new" ? "Post created!" : "Post updated!")
        router.push("/admin/blog")
      } else {
        toast.error(data.error || "Failed to save post")
      }
    } catch {
      toast.error("Failed to save post")
    } finally {
      setSaving(false)
    }
  }

  const publishedDate = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/blog" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <span className="text-gray-300">/</span>
          <h1 className="text-lg font-bold text-gray-900">{mode === "new" ? "New Post" : "Edit Post"}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreview(!preview)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:border-gray-300 text-gray-600 transition-colors"
          >
            {preview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {preview ? "Edit" : "Preview"}
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg transition-colors"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Post"}
          </button>
        </div>
      </div>

      {preview ? (
        /* ── Preview: matches exactly /blog/[slug] layout ── */
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="mx-auto max-w-3xl px-6 py-10">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">{form.category}</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight">{form.title || "Your title here"}</h1>
            {form.excerpt && <p className="text-gray-500 mb-5 leading-relaxed">{form.excerpt}</p>}
            <div className="flex items-center gap-3 text-xs text-gray-400 mb-8">
              <span className="font-medium text-gray-600">{form.author}</span>
              <span>·</span>
              <span>{publishedDate}</span>
              <span>·</span>
              <span>{form.readTime} min read</span>
            </div>
            {form.image && (
              <div className="relative h-56 sm:h-64 rounded-2xl overflow-hidden bg-gray-100 mb-8">
                <img src={form.image} alt={form.title} className="w-full h-full object-cover" />
              </div>
            )}
            {form.content ? (
              <article className="prose prose-gray max-w-none" dangerouslySetInnerHTML={{ __html: form.content }} />
            ) : (
              <p className="text-gray-400 italic">Your content will appear here...</p>
            )}
          </div>
        </div>
      ) : (
        /* ── Edit form ── */
        <div className="space-y-5">
          {/* Core fields */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-1">Post Details</h2>

            {/* Title */}
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Title *</label>
              <input
                value={form.title}
                onChange={e => set("title", e.target.value)}
                placeholder="Your blog post title"
                className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Slug *</label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400 shrink-0">/blog/</span>
                <input
                  value={form.slug}
                  onChange={e => set("slug", slugify(e.target.value))}
                  placeholder="auto-generated-from-title"
                  className="flex-1 h-10 px-3 border border-gray-200 rounded-lg text-sm font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Category</label>
                <select
                  value={form.category}
                  onChange={e => set("category", e.target.value)}
                  className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Author */}
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Author</label>
                <input
                  value={form.author}
                  onChange={e => set("author", e.target.value)}
                  placeholder="Author name"
                  className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              {/* Read time */}
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Read Time (minutes)</label>
                <input
                  type="number"
                  min={1}
                  value={form.readTime}
                  onChange={e => set("readTime", parseInt(e.target.value) || 5)}
                  className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              {/* Cover image */}
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Cover Image URL</label>
                <input
                  value={form.image}
                  onChange={e => set("image", e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Excerpt</label>
              <textarea
                value={form.excerpt}
                onChange={e => set("excerpt", e.target.value)}
                placeholder="Short description shown on the blog listing page..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-700">Content *</h2>
              <span className="text-xs text-gray-400">HTML — use &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;strong&gt; etc. Click Preview to see result.</span>
            </div>
            <textarea
              value={form.content}
              onChange={e => set("content", e.target.value)}
              placeholder={"<p>Start writing your post here...</p>\n\n<h2>Section Title</h2>\n<p>More content...</p>\n\n<ul>\n  <li>Item one</li>\n  <li>Item two</li>\n</ul>"}
              rows={24}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-mono text-gray-900 resize-y focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Publish toggle */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-gray-700">Publish</div>
              <div className="text-xs text-gray-500 mt-0.5">Published posts appear on the public blog page</div>
            </div>
            <button
              type="button"
              onClick={() => set("published", !form.published)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${form.published ? "bg-emerald-500" : "bg-gray-200"}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.published ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

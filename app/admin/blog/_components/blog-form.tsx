"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Eye, EyeOff, LogOut, Code, AlignLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { marked } from "marked"

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
  const t = typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : ""
  return { "Content-Type": "application/json", Authorization: `Bearer ${t}` }
}

export function BlogForm({ initialData, mode }: BlogFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [preview, setPreview] = useState(false)
  const [contentMode, setContentMode] = useState<'markdown' | 'html'>('markdown')
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

  const getHtmlContent = () => {
    if (contentMode === 'markdown') {
      return marked(form.content) as string
    }
    return form.content
  }

  const save = async () => {
    if (!form.title.trim() || !form.slug.trim() || !form.content.trim()) {
      toast.error("Title, slug, and content are required")
      return
    }
    setSaving(true)
    try {
      const url = mode === "new" ? "/api/admin/blog" : `/api/admin/blog/${initialData?.id}`
      const method = mode === "new" ? "POST" : "PUT"
      const payload = { ...form, content: getHtmlContent() }
      const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(payload) })
      if (res.status === 401) { toast.error("Session expired"); router.push("/admin/login"); return }
      const data = await res.json()
      if (data.success) {
        toast.success(mode === "new" ? "Post created!" : "Post saved!")
        router.push("/admin/blog")
      } else {
        toast.error(data.error || "Failed to save")
      }
    } catch {
      toast.error("Failed to save")
    } finally {
      setSaving(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("admin_token")
    document.cookie = "admin_token=; Max-Age=0; path=/"
    router.push("/admin/login")
  }

  const publishedDate = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

  const inputClass = "w-full h-10 px-3 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder:text-gray-400"
  const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5"

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link href="/admin/blog" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Blog
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-medium text-gray-700">{mode === "new" ? "New Post" : "Edit Post"}</span>
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
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white rounded-lg transition-colors"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-400 hover:text-gray-700 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {preview ? (
          /* ── Preview: exact replica of /blog/[slug] layout ── */
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="max-w-3xl mx-auto px-6 py-10">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">{form.category}</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                {form.title || <span className="text-gray-300">Your title here</span>}
              </h1>
              {form.excerpt && <p className="text-gray-500 mb-5 leading-relaxed">{form.excerpt}</p>}
              <div className="flex items-center gap-3 text-xs text-gray-400 mb-8">
                <span className="font-medium text-gray-600">{form.author || "Author"}</span>
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
                <article className="prose prose-gray max-w-none" dangerouslySetInnerHTML={{ __html: getHtmlContent() }} />
              ) : (
                <p className="text-gray-400 italic">Content will appear here...</p>
              )}
            </div>
          </div>
        ) : (
          /* ── Edit form ── */
          <div className="space-y-5">

            {/* Details card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <h2 className="text-sm font-bold text-gray-900">Post Details</h2>

              <div>
                <label className={labelClass}>Title *</label>
                <input
                  value={form.title}
                  onChange={e => set("title", e.target.value)}
                  placeholder="Your blog post title"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Slug *</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400 shrink-0">/blog/</span>
                  <input
                    value={form.slug}
                    onChange={e => set("slug", slugify(e.target.value))}
                    placeholder="auto-generated-from-title"
                    className="flex-1 h-10 px-3 border border-gray-200 rounded-lg text-sm font-mono text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Category</label>
                  <select
                    value={form.category}
                    onChange={e => set("category", e.target.value)}
                    className={inputClass}
                  >
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Author</label>
                  <input
                    value={form.author}
                    onChange={e => set("author", e.target.value)}
                    placeholder="Author name"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Read Time (minutes)</label>
                  <input
                    type="number"
                    min={1}
                    value={form.readTime}
                    onChange={e => set("readTime", parseInt(e.target.value) || 5)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Cover Image URL</label>
                  <input
                    value={form.image}
                    onChange={e => set("image", e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Excerpt</label>
                <textarea
                  value={form.excerpt}
                  onChange={e => set("excerpt", e.target.value)}
                  placeholder="Short description shown on the blog listing page..."
                  rows={2}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder:text-gray-400"
                />
              </div>

              {form.image && (
                <div>
                  <label className={labelClass}>Cover Preview</label>
                  <img src={form.image} alt="cover preview" className="h-32 w-full object-cover rounded-xl border border-gray-200" />
                </div>
              )}
            </div>

            {/* Content card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-gray-900">Content *</h2>
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => setContentMode('markdown')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                      contentMode === 'markdown'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <AlignLeft className="h-3.5 w-3.5" />
                    Markdown
                  </button>
                  <button
                    type="button"
                    onClick={() => setContentMode('html')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                      contentMode === 'html'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Code className="h-3.5 w-3.5" />
                    HTML
                  </button>
                </div>
              </div>
              <textarea
                value={form.content}
                onChange={e => set("content", e.target.value)}
                placeholder={contentMode === 'markdown'
                  ? "## Introduction\n\nStart writing here...\n\n## Section Title\n\nMore content with **bold**, *italic*, and [links](https://example.com).\n\n- Bullet point one\n- Bullet point two"
                  : "<h2>Introduction</h2>\n<p>Start writing here...</p>\n\n<h2>Section Title</h2>\n<p>More content...</p>"
                }
                rows={28}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-mono text-gray-900 bg-white resize-y focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder:text-gray-400"
              />
              <p className="text-xs text-gray-400 mt-2">
                {contentMode === 'markdown'
                  ? "Write in Markdown — # headings, **bold**, *italic*, - lists, [links](url). Converts to HTML on save."
                  : "Write raw HTML — <h2>, <p>, <ul>, <strong>, <a> etc."
                }
              </p>
            </div>

            {/* Publish card */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-gray-900">Publish</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {form.published ? "Post is live on the blog" : "Post is saved as draft"}
                </div>
              </div>
              <button
                type="button"
                onClick={() => set("published", !form.published)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 ${
                  form.published ? "bg-gray-900" : "bg-gray-200"
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  form.published ? "translate-x-6" : "translate-x-1"
                }`} />
              </button>
            </div>

            {/* Save button at bottom too */}
            <div className="flex justify-end gap-2 pt-2">
              <Link
                href="/admin/blog"
                className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                Cancel
              </Link>
              <button
                onClick={save}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-6 py-2 text-sm font-semibold bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save Post"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

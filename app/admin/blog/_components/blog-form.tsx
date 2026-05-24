"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, Eye } from "lucide-react"
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

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
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
    category: initialData?.category || "",
    author: initialData?.author || "SIMRYO Team",
    readTime: initialData?.readTime || 5,
    published: initialData?.published || false,
  })

  const set = (key: keyof BlogFormData, value: any) => {
    setForm(prev => {
      const next = { ...prev, [key]: value }
      if (key === "title" && mode === "new") {
        next.slug = slugify(value)
      }
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
        toast.error('Session expired. Please sign in again.')
        router.push('/admin/login')
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

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/blog">
            <Button variant="ghost" size="sm" className="text-gray-500">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">{mode === "new" ? "New Post" : "Edit Post"}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setPreview(!preview)}>
            <Eye className="h-4 w-4 mr-1.5" />
            {preview ? "Edit" : "Preview"}
          </Button>
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={save} disabled={saving}>
            <Save className="h-4 w-4 mr-1.5" />
            {saving ? "Saving..." : "Save Post"}
          </Button>
        </div>
      </div>

      {preview ? (
        // ── Preview ──
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">{form.category}</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight">{form.title}</h1>
          <p className="text-gray-500 mb-5 leading-relaxed">{form.excerpt}</p>
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-8">
            <span className="font-medium text-gray-600">{form.author}</span>
            <span>·</span>
            <span>{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
            <span>·</span>
            <span>{form.readTime} min read</span>
          </div>
          {form.image && (
            <div className="relative h-56 sm:h-64 rounded-2xl overflow-hidden bg-gray-100 mb-8">
              <img src={form.image} alt={form.title} className="w-full h-full object-cover" />
            </div>
          )}
          <article
            className="prose prose-gray max-w-none"
            dangerouslySetInnerHTML={{ __html: form.content }}
          />
        </div>
      ) : (
        // ── Edit form ──
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-sm font-semibold text-gray-700">Post Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">Title *</Label>
                <Input value={form.title} onChange={e => set("title", e.target.value)} placeholder="Your blog post title" className="text-base" />
              </div>

              <div className="md:col-span-2">
                <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">Slug *</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400 shrink-0">/blog/</span>
                  <Input value={form.slug} onChange={e => set("slug", slugify(e.target.value))} placeholder="auto-generated-from-title" className="font-mono text-sm" />
                </div>
              </div>

              <div>
                <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">Category</Label>
                <Input value={form.category} onChange={e => set("category", e.target.value)} placeholder="e.g. Travel Guides" />
              </div>

              <div>
                <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">Author</Label>
                <Input value={form.author} onChange={e => set("author", e.target.value)} placeholder="Author name" />
              </div>

              <div>
                <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">Read Time (minutes)</Label>
                <Input type="number" min={1} value={form.readTime} onChange={e => set("readTime", parseInt(e.target.value) || 5)} />
              </div>

              <div>
                <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">Cover Image URL</Label>
                <Input value={form.image} onChange={e => set("image", e.target.value)} placeholder="https://..." />
              </div>

              <div className="md:col-span-2">
                <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">Excerpt</Label>
                <textarea
                  value={form.excerpt}
                  onChange={e => set("excerpt", e.target.value)}
                  placeholder="Short description shown on the blog listing page..."
                  rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-700">Content *</h2>
              <span className="text-xs text-gray-400">HTML supported</span>
            </div>
            <textarea
              value={form.content}
              onChange={e => set("content", e.target.value)}
              placeholder={`<p>Start writing your post here...</p>\n\n<h2>Section Title</h2>\n<p>More content...</p>`}
              rows={20}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-mono text-gray-900 resize-y focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-400 mt-2">Write HTML content. Use &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;strong&gt; etc. Click Preview to see how it looks.</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-gray-700">Publish</div>
                <div className="text-xs text-gray-500 mt-0.5">Published posts are visible on the public blog page</div>
              </div>
              <Switch
                checked={form.published}
                onCheckedChange={v => set("published", v)}
                className="data-[state=checked]:bg-emerald-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

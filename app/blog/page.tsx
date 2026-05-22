"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Clock, Calendar, ArrowRight } from "lucide-react"

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  image: string
  category: string
  author: string
  publishedAt: string
  readTime: number
}

const posts: BlogPost[] = [
  {
    slug: "ultimate-guide-best-esim-international-travel-2025",
    title: "The Ultimate Guide to the Best eSIM for International Travel in 2025",
    excerpt: "Compare top eSIM providers, learn setup tips, and find the perfect plan for your next trip abroad.",
    image: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=80",
    category: "Travel Guides",
    author: "Sarah Chen",
    publishedAt: "2024-12-15",
    readTime: 12
  },
  {
    slug: "esim-technology-explained-complete-guide-2025",
    title: "eSIM Technology Explained: Everything You Need to Know in 2025",
    excerpt: "A deep dive into how eSIM works, its benefits over physical SIM cards, and what's next for mobile connectivity.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
    category: "eSIM Technology",
    author: "Dr. Michael Rodriguez",
    publishedAt: "2024-12-10",
    readTime: 15
  },
  {
    slug: "digital-nomad-global-connectivity-esim-guide",
    title: "Digital Nomad's Complete Guide to Global Connectivity with eSIMs",
    excerpt: "Reliable, cost-effective connectivity for location-independent professionals across multiple countries.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
    category: "Digital Nomad",
    author: "Alex Thompson",
    publishedAt: "2024-12-08",
    readTime: 18
  },
  {
    slug: "best-esim-europe-travel-2025",
    title: "Best eSIM Plans for Europe Travel in 2025",
    excerpt: "Top eSIM options for exploring Europe — coverage, pricing, and which plan suits your trip.",
    image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80",
    category: "Travel Guides",
    author: "Emma Wilson",
    publishedAt: "2024-12-06",
    readTime: 10
  },
  {
    slug: "esim-vs-physical-sim-comprehensive-comparison",
    title: "eSIM vs Physical SIM: A Comprehensive Comparison",
    excerpt: "Which is right for you? A detailed breakdown of the differences, pros, and cons of each.",
    image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&q=80",
    category: "Comparisons",
    author: "James Park",
    publishedAt: "2024-12-04",
    readTime: 9
  },
  {
    slug: "cheapest-esim-plans-budget-travel-guide",
    title: "Cheapest eSIM Plans: A Budget Traveler's Guide",
    excerpt: "How to find the most affordable eSIM plans without sacrificing coverage or reliability.",
    image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=800&q=80",
    category: "Travel Guides",
    author: "Maria Santos",
    publishedAt: "2024-12-02",
    readTime: 8
  },
  {
    slug: "5g-esim-coverage-speed-guide",
    title: "5G eSIM Coverage & Speed: What Travelers Need to Know",
    excerpt: "Where 5G eSIM is actually available, what speeds to expect, and how it compares to 4G LTE.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    category: "eSIM Technology",
    author: "Dr. Michael Rodriguez",
    publishedAt: "2024-11-30",
    readTime: 11
  },
  {
    slug: "esim-business-travel-guide-enterprise-solutions",
    title: "eSIM for Business Travel: Enterprise Solutions Guide",
    excerpt: "How companies are using eSIM technology to simplify employee travel connectivity and reduce costs.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    category: "Travel Guides",
    author: "David Chen",
    publishedAt: "2024-11-28",
    readTime: 13
  },
  {
    slug: "best-unlimited-data-esim-plans-worldwide",
    title: "Best Unlimited Data eSIM Plans Worldwide",
    excerpt: "The top unlimited and high-data eSIM plans for heavy users and long-term travelers.",
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80",
    category: "Travel Guides",
    author: "Sarah Chen",
    publishedAt: "2024-11-25",
    readTime: 10
  },
  {
    slug: "esim-security-privacy-guide-2025",
    title: "eSIM Security & Privacy: What You Need to Know in 2025",
    excerpt: "How eSIM technology handles your data, what risks exist, and how to stay secure while traveling.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80",
    category: "eSIM Technology",
    author: "James Park",
    publishedAt: "2024-11-22",
    readTime: 9
  },
  {
    slug: "family-travel-esim-group-plans",
    title: "Family Travel with eSIM: Group Plans and Tips",
    excerpt: "The best eSIM strategies for families traveling together — shared plans, multi-device setups, and savings.",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80",
    category: "Travel Guides",
    author: "Emma Wilson",
    publishedAt: "2024-11-20",
    readTime: 8
  },
  {
    slug: "esim-troubleshooting-common-issues-solutions",
    title: "eSIM Troubleshooting: Common Issues & Solutions",
    excerpt: "Fix the most common eSIM problems — activation failures, no signal, slow speeds — step by step.",
    image: "https://images.unsplash.com/photo-1495592822108-9e6261896da8?w=800&q=80",
    category: "Setup Guides",
    author: "Tech Support Team",
    publishedAt: "2024-11-18",
    readTime: 7
  },
  {
    slug: "cruise-ship-connectivity-esim-guide",
    title: "eSIM on Cruise Ships: Connectivity Guide",
    excerpt: "How to stay connected on a cruise — which eSIMs work at sea and in ports, and what to expect.",
    image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800&q=80",
    category: "Travel Guides",
    author: "Maria Santos",
    publishedAt: "2024-11-15",
    readTime: 9
  },
  {
    slug: "student-study-abroad-esim-guide",
    title: "eSIM for Students Studying Abroad: Complete Guide",
    excerpt: "Affordable connectivity options for students studying internationally — the best plans by region.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80",
    category: "Travel Guides",
    author: "Alex Thompson",
    publishedAt: "2024-11-12",
    readTime: 8
  },
  {
    slug: "best-esim-apps-management-guide",
    title: "Best Apps for Managing Your eSIM While Traveling",
    excerpt: "The top apps for monitoring data usage, switching plans, and managing multiple eSIM profiles.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
    category: "Setup Guides",
    author: "Jennifer Kim",
    publishedAt: "2024-11-10",
    readTime: 7
  },
  {
    slug: "country-specific-esim-guides-usa-canada-mexico",
    title: "eSIM Guides: USA, Canada & Mexico Coverage",
    excerpt: "Detailed breakdown of eSIM coverage, carriers, and plans for North America.",
    image: "https://images.unsplash.com/photo-1501466044931-62695aada8e9?w=800&q=80",
    category: "Travel Guides",
    author: "Carlos Mendez",
    publishedAt: "2024-11-08",
    readTime: 11
  },
  {
    slug: "emergency-communication-esim-guide",
    title: "Emergency Communication While Traveling: Why eSIM Matters",
    excerpt: "How eSIM can be a lifeline in emergencies abroad — instant switching, backup connectivity, and more.",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80",
    category: "Travel Guides",
    author: "David Chen",
    publishedAt: "2024-11-05",
    readTime: 8
  },
  {
    slug: "esim-vs-pocket-wifi-comparison-guide",
    title: "eSIM vs Pocket WiFi: Which is Better for Travelers?",
    excerpt: "A practical comparison of eSIM and pocket WiFi — cost, convenience, battery, and coverage.",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80",
    category: "Comparisons",
    author: "Jennifer Kim",
    publishedAt: "2024-11-02",
    readTime: 9
  }
]

const categories = ["All", "Travel Guides", "eSIM Technology", "Digital Nomad", "Setup Guides", "Comparisons"]

export default function BlogPage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")

  const filtered = posts.filter(p => {
    const matchCat = category === "All" || p.category === category
    const matchSearch = !search.trim() ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const fmt = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">Blog</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Travel connectivity guides</h1>
          <p className="text-gray-500">eSIM tips, travel guides, and connectivity advice for modern travelers.</p>
        </div>

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 focus:border-gray-400 focus:outline-none text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  category === c
                    ? 'bg-gray-900 text-white'
                    : 'border border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                <div className="border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-md transition-all duration-200 h-full flex flex-col">
                  <div className="relative h-44 overflow-hidden bg-gray-100">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-semibold text-gray-500 bg-gray-100 rounded-full px-2.5 py-1">
                        {post.category}
                      </span>
                    </div>
                    <h2 className="text-sm font-semibold text-gray-900 mb-2 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-4 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {fmt(post.publishedAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readTime} min
                        </span>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-blue-500 transition-colors" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="font-semibold text-gray-900 mb-2">No articles found</p>
            <p className="text-sm text-gray-500 mb-4">Try a different search or category.</p>
            <button
              onClick={() => { setSearch(""); setCategory("All") }}
              className="text-sm text-blue-600 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

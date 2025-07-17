"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Search, 
  Calendar, 
  Clock, 
  User, 
  ArrowRight, 
  TrendingUp, 
  Globe, 
  Smartphone, 
  Zap,
  Star,
  BookOpen,
  Filter,
  ChevronRight,
  Eye,
  MessageCircle,
  Share2
} from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content?: string
  featuredImage: string
  category: string
  tags: string[]
  author: {
    name: string
    avatar: string
    bio: string
  }
  publishedAt: string
  readTime: number
  views: number
  comments: number
  featured: boolean
  seoKeywords: string[]
}

const categories = [
  { name: "All Posts", slug: "all", icon: BookOpen, count: 25 },
  { name: "Travel Guides", slug: "travel-guides", icon: Globe, count: 8 },
  { name: "eSIM Technology", slug: "esim-technology", icon: Smartphone, count: 6 },
  { name: "Digital Nomad", slug: "digital-nomad", icon: TrendingUp, count: 5 },
  { name: "Setup Guides", slug: "setup-guides", icon: Zap, count: 4 },
  { name: "Comparisons", slug: "comparisons", icon: Star, count: 2 }
]

const featuredPosts: BlogPost[] = [
  {
    id: "1",
    slug: "ultimate-guide-best-esim-international-travel-2025",
    title: "The Ultimate Guide to the Best eSIM for International Travel in 2025",
    excerpt: "Discover the best eSIM for international travel in 2025. Compare top providers, learn setup tips, and find the perfect SIMRYO eSIM plan for your next adventure abroad.",
    featuredImage: "/blog/featured-esim-guide.jpg",
    category: "Travel Guides",
    tags: ["best esim", "international travel", "travel connectivity", "esim guide"],
    author: {
      name: "Sarah Chen",
      avatar: "/authors/sarah-chen.jpg",
      bio: "Travel Technology Expert & Digital Nomad"
    },
    publishedAt: "2024-12-15",
    readTime: 12,
    views: 15420,
    comments: 89,
    featured: true,
    seoKeywords: ["best esim for international travel", "international esim plans", "travel connectivity"]
  },
  {
    id: "2", 
    slug: "esim-technology-explained-complete-guide-2025",
    title: "eSIM Technology Explained: Everything You Need to Know in 2025",
    excerpt: "A comprehensive deep dive into eSIM technology, how it works, benefits over physical SIM cards, and what the future holds for mobile connectivity.",
    featuredImage: "/blog/esim-technology-explained.jpg",
    category: "eSIM Technology",
    tags: ["esim technology", "how esim works", "esim vs physical sim"],
    author: {
      name: "Dr. Michael Rodriguez",
      avatar: "/authors/michael-rodriguez.jpg",
      bio: "Telecommunications Engineer & Tech Writer"
    },
    publishedAt: "2024-12-10",
    readTime: 15,
    views: 12350,
    comments: 67,
    featured: true,
    seoKeywords: ["how esim works", "esim technology", "esim vs physical sim"]
  },
  {
    id: "3",
    slug: "digital-nomad-global-connectivity-esim-guide",
    title: "Digital Nomad's Complete Guide to Global Connectivity with eSIMs",
    excerpt: "The ultimate resource for location-independent professionals seeking reliable, cost-effective connectivity across multiple countries and time zones.",
    featuredImage: "/blog/digital-nomad-connectivity.jpg",
    category: "Digital Nomad",
    tags: ["digital nomad", "remote work", "global connectivity", "esim for nomads"],
    author: {
      name: "Alex Thompson",
      avatar: "/authors/alex-thompson.jpg",
      bio: "Digital Nomad & Remote Work Consultant"
    },
    publishedAt: "2024-12-08",
    readTime: 18,
    views: 9876,
    comments: 124,
    featured: true,
    seoKeywords: ["esim for digital nomads", "remote work connectivity", "nomad internet"]
  }
]

const recentPosts: BlogPost[] = [
  {
    id: "4",
    slug: "esim-compatibility-guide-devices-countries-providers",
    title: "The Complete eSIM Compatibility Guide: Devices, Countries & Providers",
    excerpt: "Exhaustive guide to eSIM compatibility across devices, countries, and providers with interactive compatibility checker.",
    featuredImage: "/blog/esim-compatibility.jpg",
    category: "Setup Guides",
    tags: ["esim compatible phones", "device compatibility", "esim support"],
    author: {
      name: "Jennifer Kim",
      avatar: "/authors/jennifer-kim.jpg",
      bio: "Mobile Technology Specialist"
    },
    publishedAt: "2024-12-05",
    readTime: 10,
    views: 8234,
    comments: 45,
    featured: false,
    seoKeywords: ["esim compatible phones", "esim supported devices"]
  },
  {
    id: "5",
    slug: "top-10-benefits-esim-international-trip",
    title: "Top 10 Benefits of Using eSIM for Your Next International Trip",
    excerpt: "Discover the key advantages of eSIM technology for international travelers with real-world examples and traveler testimonials.",
    featuredImage: "/blog/esim-benefits.jpg",
    category: "Travel Guides",
    tags: ["esim benefits", "travel advantages", "international travel"],
    author: {
      name: "Carlos Mendez",
      avatar: "/authors/carlos-mendez.jpg",
      bio: "Travel Writer & Connectivity Expert"
    },
    publishedAt: "2024-12-03",
    readTime: 8,
    views: 6789,
    comments: 32,
    featured: false,
    seoKeywords: ["benefits of esim for travel", "advantages of esim"]
  },
  {
    id: "6",
    slug: "setup-activate-esim-5-minutes-guide",
    title: "How to Set Up and Activate Your eSIM in 5 Minutes or Less",
    excerpt: "Step-by-step tutorial for quickly setting up your eSIM with troubleshooting tips for common activation issues.",
    featuredImage: "/blog/esim-setup-guide.jpg",
    category: "Setup Guides",
    tags: ["esim setup", "esim activation", "how to install esim"],
    author: {
      name: "Tech Support Team",
      avatar: "/authors/tech-team.jpg",
      bio: "SIMRYO Technical Support Experts"
    },
    publishedAt: "2024-12-01",
    readTime: 6,
    views: 11234,
    comments: 78,
    featured: false,
    seoKeywords: ["how to set up esim", "esim activation guide"]
  }
]

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [filteredPosts, setFilteredPosts] = useState([...featuredPosts, ...recentPosts])

  useEffect(() => {
    let filtered = [...featuredPosts, ...recentPosts]
    
    if (selectedCategory !== "all") {
      filtered = filtered.filter(post => 
        post.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory
      )
    }
    
    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }
    
    setFilteredPosts(filtered)
  }, [searchQuery, selectedCategory])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-white/20 text-white hover:bg-white/30 border-white/30">
              <BookOpen className="h-3 w-3 mr-1" />
              Expert Travel Connectivity Insights
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              SIMRYO Travel Blog
            </h1>
            
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Expert guides, tips, and insights for staying connected worldwide. 
              From eSIM technology to travel hacks, we've got you covered.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
                <Input
                  placeholder="Search articles, guides, and tips..."
                  className="w-full pl-12 pr-4 py-4 text-lg rounded-2xl border-2 border-white/20 focus:border-white focus:ring-white bg-white/10 backdrop-blur-sm text-white placeholder-white/70"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Button
                key={category.slug}
                variant={selectedCategory === category.slug ? "default" : "outline"}
                className={`flex items-center space-x-2 ${
                  selectedCategory === category.slug 
                    ? "bg-blue-600 text-white" 
                    : "text-gray-700 hover:text-blue-600 hover:border-blue-600"
                }`}
                onClick={() => setSelectedCategory(category.slug)}
              >
                <category.icon className="h-4 w-4" />
                <span>{category.name}</span>
                <Badge variant="secondary" className="ml-1 text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {selectedCategory === "all" && (
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200">
                <Star className="h-3 w-3 mr-1" />
                Featured Articles
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Must-Read Travel Connectivity Guides
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our most comprehensive and popular articles to help you stay connected anywhere in the world
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post, index) => (
                <Card key={post.id} className={`professional-card group hover:shadow-2xl transition-all duration-300 border-0 ${index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}`}>
                  <div className="relative">
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      width={index === 0 ? 800 : 400}
                      height={index === 0 ? 400 : 200}
                      className="w-full h-48 lg:h-64 object-cover rounded-t-2xl"
                    />
                    <Badge className="absolute top-4 left-4 bg-blue-600 text-white">
                      {post.category}
                    </Badge>
                    <Badge className="absolute top-4 right-4 bg-orange-500 text-white">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(post.publishedAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{post.readTime} min read</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{post.views.toLocaleString()}</span>
                      </div>
                    </div>

                    <h3 className={`font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors ${index === 0 ? 'text-2xl' : 'text-xl'}`}>
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>
                    
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={post.author.avatar} alt={post.author.name} />
                          <AvatarFallback>{post.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{post.author.name}</p>
                          <p className="text-xs text-gray-500">{post.author.bio}</p>
                        </div>
                      </div>
                      
                      <Link href={`/blog/${post.slug}`}>
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                          Read More
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Posts */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {selectedCategory === "all" ? "Latest Articles" : `${categories.find(c => c.slug === selectedCategory)?.name} Articles`}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay up to date with the latest travel connectivity tips, eSIM guides, and industry insights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.filter(post => !post.featured || selectedCategory !== "all").map((post) => (
              <Card key={post.id} className="professional-card group hover:shadow-2xl transition-all duration-300 border-0">
                <div className="relative">
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover rounded-t-2xl"
                  />
                  <Badge className="absolute top-4 left-4 bg-blue-600 text-white">
                    {post.category}
                  </Badge>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{post.readTime} min read</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={post.author.avatar} alt={post.author.name} />
                        <AvatarFallback>{post.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{post.author.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{post.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.comments}</span>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <Link href={`/blog/${post.slug}`}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Read Full Article
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No articles found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search terms or browse different categories.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("all")
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Stay Connected with SIMRYO
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Get the latest travel connectivity tips, eSIM guides, and exclusive offers delivered to your inbox
            </p>
            
            <div className="max-w-md mx-auto">
              <div className="flex space-x-4">
                <Input 
                  placeholder="Enter your email" 
                  className="bg-white/10 border-white/20 text-white placeholder-white/70"
                />
                <Button className="bg-white text-blue-600 hover:bg-gray-100">
                  Subscribe
                </Button>
              </div>
              <p className="text-sm text-blue-100 mt-2">
                No spam, unsubscribe at any time
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

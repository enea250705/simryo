"use client"

import { useEffect, useState, lazy, Suspense, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Globe, 
  Zap, 
  Shield, 
  DollarSign, 
  Star, 
  ArrowRight, 
  Wifi, 
  Clock, 
  Search, 
  MapPin,
  CheckCircle,
  Loader2,
  Smartphone,
  Users,
  TrendingUp,
  Award,
  Quote,
  ChevronRight,
  PhoneCall,
  MessageCircle,
  Sparkles,
  Target,
  Plane,
  Luggage,
  Camera,
  Heart,
  ThumbsUp
} from "lucide-react"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"

import { TravelTips } from "@/components/travel-tips"
import { CurrencySelector } from "@/components/currency-selector"
import { useCurrency } from "@/lib/contexts/currency-context"

// Lazy load heavy components
const Testimonials = lazy(() => import("@/components/testimonials"))
const FAQSection = lazy(() => import("@/components/faq-section"))


interface Plan {
  id: string;
  country: string;
  countryCode: string;
  data: string;
  dataInMB: number;
  days: number;
  price: number;
  currency: string;
  network: {
    type: string;
    carriers: string[];
    coverage: string;
  };
  features: string[];
  inStock: boolean;
  providerId: string;
  providerDisplayName: string;
  popularity: number;
  lastUpdated: Date;
  promoApplied?: {
    id: string;
    originalPrice: number;
    savings: number;
  };
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  content: string;
  country: string;
  verified: boolean;
}


const features = [
  {
    icon: Globe,
    title: "190+ Countries",
    description: "Global coverage with premium networks worldwide",
    color: "from-blue-500 to-blue-600",
    stats: "190+ destinations"
  },
  {
    icon: Zap,
    title: "Instant Activation",
    description: "Get connected in seconds with QR code setup",
    color: "from-orange-500 to-orange-600",
    stats: "< 60 seconds"
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Enterprise-grade security with 99.9% uptime",
    color: "from-green-500 to-green-600",
    stats: "99.9% uptime"
  },
  {
    icon: DollarSign,
    title: "No Hidden Fees",
    description: "Transparent pricing with no contracts or surprises",
    color: "from-purple-500 to-purple-600",
    stats: "0 hidden fees"
  }
]

const stats = [
  {
    icon: Users,
    value: "2M+",
    label: "Happy Customers",
    description: "Travelers worldwide trust SIMRYO"
  },
  {
    icon: Globe,
    value: "190+",
    label: "Countries",
    description: "Global coverage everywhere you go"
  },
  {
    icon: TrendingUp,
    value: "99.9%",
    label: "Uptime",
    description: "Reliable connection you can count on"
  },
  {
    icon: Award,
    value: "4.8★",
    label: "Customer Rating",
    description: "Rated excellent by our users"
  }
]

const howItWorks = [
  {
    step: "1",
    title: "Choose Your Plan",
    description: "Select the perfect data plan for your destination and travel duration",
    icon: Target
  },
  {
    step: "2", 
    title: "Instant Purchase",
    description: "Complete your secure purchase in just a few clicks",
    icon: Smartphone
  },
  {
    step: "3",
    title: "Scan & Connect",
    description: "Scan the QR code and get connected instantly",
    icon: Zap
  }
]

// Review Schema for testimonials
const reviewSchema = {
  "@context": "https://schema.org",
  "@type": "Review",
  "itemReviewed": {
    "@type": "Service",
    "name": "SIMRYO eSIM Plans",
    "description": "Global eSIM data plans for international travel"
  },
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": "5",
    "bestRating": "5"
  },
  "author": {
    "@type": "Person",
    "name": "Sarah Chen"
  },
  "reviewBody": "SIMRYO saved my European trip! Instant activation, great speeds, and transparent pricing. No more expensive roaming charges!",
  "datePublished": "2024-12-15"
}

// Component for testimonials section

export default function HomePage() {
  const { formatPrice, convertPrice, currency } = useCurrency()
  const [searchQuery, setSearchQuery] = useState("")
  const [popularPlans, setPopularPlans] = useState<Plan[]>([])
  const [loadingPlans, setLoadingPlans] = useState(true)
  const [errorPlans, setErrorPlans] = useState<string | null>(null)
  const [countries, setCountries] = useState<{ name: string; countryCode: string }[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchPopularPlans = async () => {
      try {
        const response = await fetch('/api/plans/popular')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        if (data.success) {
          setPopularPlans((data.plans || data.data || []).slice(0, 6)) // Show only 6 plans
        } else {
          setErrorPlans(data.error || 'Failed to fetch popular plans')
        }
      } catch (error) {
        console.error("Error fetching popular plans:", error)
        setErrorPlans('Failed to load popular plans. Please try again later.')
      } finally {
        setLoadingPlans(false)
      }
    }

    fetchPopularPlans()
  }, [])

  useEffect(() => {
    fetch('/api/plans?sortBy=popularity&sortOrder=desc')
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          const seen = new Set<string>()
          const unique: { name: string; countryCode: string }[] = []
          ;(data.plans || []).forEach((p: Plan) => {
            if (!seen.has(p.country)) {
              seen.add(p.country)
              unique.push({ name: p.country, countryCode: p.countryCode })
            }
          })
          setCountries(unique.sort((a, b) => a.name.localeCompare(b.name)))
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filteredCountries = searchQuery.trim().length > 0
    ? countries.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 8)
    : []

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/plans?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const countryNameToCode: Record<string, string> = {
    'ireland': 'ie', 'united states': 'us', 'united kingdom': 'gb',
    'china mainland': 'cn', 'south korea': 'kr', 'new zealand': 'nz',
    'saudi arabia': 'sa', 'south africa': 'za', 'uae': 'ae',
    'united arab emirates': 'ae',
  }

  const getFlagUrl = (countryCode: string, countryName?: string) => {
    if (countryName) {
      const mapped = countryNameToCode[countryName.toLowerCase()]
      if (mapped) return `https://flagcdn.com/w40/${mapped}.png`
    }
    const code = countryCode.split(',')[0].trim().toLowerCase()
    return `https://flagcdn.com/w40/${code}.png`
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
        <section className="relative overflow-hidden pt-32 sm:pt-48 pb-20 sm:pb-24" aria-labelledby="hero-heading">
        <div className="absolute inset-0 bg-gray-50" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 mb-8 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className="text-sm font-medium text-gray-600">190+ countries covered</span>
            </div>

            <h1 id="hero-heading" className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-6">
              Travel Data Made
              <span className="block text-blue-600">Simple</span>
            </h1>

            <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto leading-relaxed">
              eSIM plans for 190+ countries. Instant activation, no contracts, no roaming fees.
            </p>

            {/* Quick Country Search */}
            <div className="mb-8 max-w-2xl mx-auto">
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {[
                  { name: 'USA', code: 'us' },
                  { name: 'Spain', code: 'es' },
                  { name: 'Italy', code: 'it' },
                  { name: 'France', code: 'fr' },
                  { name: 'Japan', code: 'jp' },
                  { name: 'Thailand', code: 'th' },
                ].map((dest) => (
                  <button
                    key={dest.name}
                    onClick={() => router.push(`/plans?q=${encodeURIComponent(dest.name)}`)}
                    className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors"
                  >
                    <img src={`https://flagcdn.com/w40/${dest.code}.png`} alt={dest.name} className="w-5 h-[14px] rounded-sm object-cover" />
                    {dest.name}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSearch}>
                <div className="relative" ref={searchRef}>
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                  <Input
                    placeholder="Search any country..."
                    className="w-full h-11 pl-11 pr-24 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-0 bg-white text-sm"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setShowDropdown(true) }}
                    onFocus={() => setShowDropdown(true)}
                    aria-label="Search destination"
                    autoComplete="off"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 bg-gray-900 hover:bg-gray-800 text-white px-4 rounded-lg text-sm font-medium transition-colors"
                  >
                    Search
                  </button>

                  {showDropdown && filteredCountries.length > 0 && (
                    <div className="absolute z-50 top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                      {filteredCountries.map((c) => {
                        const slug = c.name.toLowerCase().replace(/\s+/g, '-')
                        return (
                          <button
                            key={c.name}
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault()
                              setSearchQuery(c.name)
                              setShowDropdown(false)
                              router.push(`/plans/${slug}`)
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                          >
                            <img
                              src={getFlagUrl(c.countryCode, c.name)}
                              alt={c.name}
                              className="w-5 h-[14px] rounded-sm object-cover border border-gray-100 shrink-0"
                            />
                            {c.name}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* CTA */}
            <div className="mb-12">
              <Link href="/plans">
                <button className="inline-flex items-center gap-3 bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 text-base font-semibold rounded-xl transition-colors duration-150">
                  Browse Plans
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
              <div className="mt-4 flex items-center justify-center gap-1 text-sm text-gray-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                ))}
                <span className="ml-2">4.8 · 100,000+ travelers</span>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { icon: Zap, label: "Instant Setup", color: "text-yellow-500" },
                { icon: Shield, label: "No Contracts", color: "text-green-500" },
                { icon: DollarSign, label: "Fair Pricing", color: "text-blue-500" },
                { icon: Users, label: "24/7 Support", color: "text-purple-500" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200/80 rounded-full px-4 py-2 text-sm font-medium text-gray-700 shadow-sm">
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-20 bg-white" aria-labelledby="stats-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center" role="img" aria-label={`${stat.value} ${stat.label}: ${stat.description}`}>
                <div className="text-4xl sm:text-5xl font-black text-gray-900 mb-2 tracking-tight">{stat.value}</div>
                <div className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">{stat.label}</div>
                <div className="text-sm text-gray-400">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 bg-gray-50" aria-labelledby="features-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">Why SIMRYO</p>
            <h2 id="features-heading" className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Built for travelers
            </h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Instant eSIM activation with no contracts, no roaming surprises, and real support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-2xl p-6">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 mb-5">
                  <feature.icon className="h-5 w-5 text-gray-600" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{feature.description}</p>
                <span className="text-xs font-semibold text-gray-400">{feature.stats}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-20 bg-white" aria-labelledby="how-it-works-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">How it works</p>
            <h2 id="how-it-works-heading" className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Up and running in minutes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-16 relative">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center relative">
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-5 left-[calc(50%+2.5rem)] w-[calc(100%-5rem)] h-px bg-gray-200" />
                )}
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-900 text-white text-sm font-bold mb-5">
                  {step.step}
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Plans Section */}
      <section className="py-16 sm:py-20 bg-gray-50" aria-labelledby="popular-plans-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">Popular plans</p>
            <h2 id="popular-plans-heading" className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Top destinations
            </h2>
            
            {/* Currency Selector */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">View prices in:</span>
                <CurrencySelector variant="compact" />
              </div>
            </div>
          </div>

          {loadingPlans ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <Card key={index} className="professional-card">
                  <CardContent className="p-6">
                    <div className="loading-skeleton h-6 w-24 mb-4" />
                    <div className="loading-skeleton h-4 w-full mb-2" />
                    <div className="loading-skeleton h-4 w-3/4 mb-4" />
                    <div className="loading-skeleton h-8 w-20" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : errorPlans ? (
            <div className="text-center py-12">
              <div className="error-state max-w-md mx-auto">
                <h3 className="text-lg font-semibold mb-2">Unable to load plans</h3>
                <p className="text-sm">{errorPlans}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {popularPlans.map((plan) => (
                <Link key={plan.id} href={`/plans/${plan.country.toLowerCase()}`} className="block">
                  <div className="bg-white rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">

                    {/* Header */}
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={getFlagUrl(plan.countryCode, plan.country)}
                          alt={plan.country}
                          className="w-9 h-[26px] rounded-sm object-cover border border-gray-100"
                        />
                        <div>
                          <div className="text-sm font-semibold text-gray-900 leading-tight">{plan.country}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{plan.network.type} · {plan.network.coverage}</div>
                        </div>
                      </div>
                      {plan.promoApplied && (
                        <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-2 py-0.5">
                          Sale
                        </span>
                      )}
                    </div>

                    {/* Body */}
                    <div className="px-5 py-5 flex flex-col flex-1">

                      {/* Price */}
                      <div className="mb-4">
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-gray-900 tracking-tight">
                            {formatPrice(convertPrice(plan.price, 'EUR', currency))}
                          </span>
                          {plan.promoApplied && (
                            <span className="text-sm text-gray-400 line-through">
                              {formatPrice(convertPrice(plan.promoApplied.originalPrice, 'EUR', currency))}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {formatPrice(convertPrice(plan.price / (plan.dataInMB / 1024), 'EUR', currency))} per GB
                        </div>
                      </div>

                      {/* Data + Duration pills */}
                      <div className="flex items-center gap-2 mb-5">
                        <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
                          <Wifi className="h-3.5 w-3.5 text-gray-400" />
                          <span className="text-sm font-semibold text-gray-700">{plan.data}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
                          <Clock className="h-3.5 w-3.5 text-gray-400" />
                          <span className="text-sm font-semibold text-gray-700">{plan.days} days</span>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="mt-auto">
                        <div className="w-full flex items-center justify-between bg-gray-900 hover:bg-gray-800 text-white rounded-xl px-4 py-3 text-sm font-semibold transition-colors duration-150">
                          <span>Get Plan</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>

                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link href="/plans">
              <button className="inline-flex items-center gap-2 border border-gray-300 hover:border-gray-400 bg-white text-gray-700 hover:text-gray-900 px-6 py-3 rounded-xl text-sm font-semibold transition-colors">
                View all plans
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Suspense fallback={<div className="py-16 sm:py-20 bg-white flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
        <Testimonials />
      </Suspense>

      {/* Travel Tips Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <TravelTips />
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<div className="py-16 sm:py-20 bg-white flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
        <FAQSection />
      </Suspense>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to get connected?
            </h2>
            <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto">
              Pick a plan, scan a QR code, and you're online. No physical SIM needed.
            </p>
            <Link href="/plans">
              <button className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-900 px-6 py-3 rounded-xl text-sm font-semibold transition-colors">
                Browse Plans
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-gray-500">
              <span>Free setup</span>
              <span>·</span>
              <span>24/7 support</span>
              <span>·</span>
              <span>Money-back guarantee</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

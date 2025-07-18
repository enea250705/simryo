"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Travel Blogger",
    company: "Wanderlust Weekly",
    avatar: "/testimonials/sarah.jpg",
    rating: 5,
    content: "SIMRYO saved my European trip! Instant activation, great speeds, and transparent pricing. No more expensive roaming charges!",
    country: "🇺🇸 United States",
    verified: true
  },
  {
    id: "2", 
    name: "Marcus Rodriguez",
    role: "Business Consultant",
    company: "Global Solutions Inc",
    avatar: "/testimonials/marcus.jpg",
    rating: 5,
    content: "Perfect for business travel. Reliable connection across 12 countries in one trip. Customer support was exceptional.",
    country: "🇪🇸 Spain",
    verified: true
  },
  {
    id: "3",
    name: "Emily Johnson",
    role: "Digital Nomad",
    company: "Remote Designer",
    avatar: "/testimonials/emily.jpg",
    rating: 5,
    content: "As a digital nomad, reliable internet is crucial. SIMRYO delivers consistently high speeds worldwide. Highly recommended!",
    country: "🇨🇦 Canada",
    verified: true
  }
]

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
function TestimonialsComponent() {
  return (
    <section className="py-16 sm:py-20 bg-white" aria-labelledby="testimonials-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-200">
            Customer Stories
          </Badge>
          <h2 id="testimonials-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Loved by Travelers Worldwide
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See what our customers say about their SIMRYO experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="professional-card group hover:shadow-2xl transition-all duration-300 border-0">
              <CardContent className="p-8">
                <div className="flex items-center gap-1 mb-4" role="img" aria-label={`${testimonial.rating} out of 5 stars`}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                  ))}
                </div>
                
                <Quote className="h-8 w-8 text-gray-300 mb-4" aria-hidden="true" />
                
                <blockquote className="text-gray-700 mb-6 leading-relaxed">
                  {testimonial.content}
                </blockquote>
                
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={testimonial.avatar} alt={`${testimonial.name} profile photo`} />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      {testimonial.verified && (
                        <CheckCircle className="h-4 w-4 text-green-500" aria-label="Verified customer" />
                      )}
                    </div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                    <div className="text-sm text-gray-500">{testimonial.country}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [popularPlans, setPopularPlans] = useState<Plan[]>([])
  const [loadingPlans, setLoadingPlans] = useState(true)
  const [errorPlans, setErrorPlans] = useState<string | null>(null)
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

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/plans?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const getFlagEmoji = (countryCode: string) => {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map((char) => 0x1f1e6 + char.charCodeAt(0) - 'A'.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-40 sm:pt-44 pb-20 sm:pb-24 hero-section" aria-labelledby="hero-heading">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200">
              <Sparkles className="h-3 w-3 mr-1" />
              Trusted by 2M+ travelers worldwide
            </Badge>
            
            <div className="mb-4 flex justify-center">
              <div className="flex items-center gap-2 text-2xl">
                <Plane className="h-8 w-8 text-blue-600" />
                <Luggage className="h-8 w-8 text-purple-600" />
                <Camera className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h1 id="hero-heading" className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-6">
              Travel Data Made
              <span className="block gradient-hero-text">
                Simple
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Get connected in 190+ countries instantly. No roaming fees, no contracts, no hassle.
              <br />
              <span className="font-semibold text-blue-600">Just tap, download, and go!</span>
            </p>

            {/* Quick Country Search */}
            <div className="mb-8 max-w-4xl mx-auto">
              <div className="text-center mb-6">
                <p className="text-lg text-gray-600 mb-4">🌍 Popular destinations:</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {['🇺🇸 USA', '🇪🇸 Spain', '🇮🇹 Italy', '🇫🇷 France', '🇯🇵 Japan', '🇹🇭 Thailand'].map((country) => (
                    <Button
                      key={country}
                      variant="outline"
                      className="text-sm px-4 py-2 rounded-full border-2 hover:bg-blue-50 hover:border-blue-300"
                      onClick={() => {
                        const countryName = country.split(' ')[1]
                        setSearchQuery(countryName)
                        router.push(`/plans?q=${encodeURIComponent(countryName)}`)
                      }}
                    >
                      {country}
                    </Button>
                  ))}
                </div>
              </div>
              
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
                  <Input
                    placeholder="Where are you traveling to?"
                    className="w-full pl-12 pr-32 py-6 text-lg rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white/80 backdrop-blur-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search destination"
                    role="searchbox"
                  />
                  <Button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
                    aria-label="Search for travel plans"
                  >
                    <Search className="h-5 w-5 mr-2" aria-hidden="true" />
                    Search
                  </Button>
                </div>
              </form>
            </div>

            {/* Simple CTA */}
            <div className="mb-12">
              <Link href="/plans">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-6 text-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 font-semibold"
                >
                  <Plane className="mr-3 h-6 w-6" />
                  Find My Travel Data
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </Link>
              <div className="mt-4 text-sm text-gray-500">
                <Heart className="inline h-4 w-4 mr-1 text-red-500" />
                Join 100,000+ happy travelers
              </div>
            </div>

            {/* Simple Trust Indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="text-center p-4 bg-white/70 rounded-xl backdrop-blur-sm">
                <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-700">Instant Setup</div>
              </div>
              <div className="text-center p-4 bg-white/70 rounded-xl backdrop-blur-sm">
                <Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-700">No Contracts</div>
              </div>
              <div className="text-center p-4 bg-white/70 rounded-xl backdrop-blur-sm">
                <DollarSign className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-700">Fair Pricing</div>
              </div>
              <div className="text-center p-4 bg-white/70 rounded-xl backdrop-blur-sm">
                <Users className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-700">24/7 Help</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-20 bg-white" aria-labelledby="stats-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group" role="img" aria-label={`${stat.value} ${stat.label}: ${stat.description}`}>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4 group-hover:bg-blue-200 transition-colors">
                  <stat.icon className="h-8 w-8 text-blue-600" aria-hidden="true" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-lg font-semibold text-gray-700 mb-1">{stat.label}</div>
                <div className="text-sm text-gray-500">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 bg-gray-50" aria-labelledby="features-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200">
              Why Choose SIMRYO
            </Badge>
            <h2 id="features-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Travel Smart, Stay Connected
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of international connectivity with our premium eSIM technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="professional-card group hover:shadow-2xl transition-all duration-300 border-0">
                <CardContent className="p-8 text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                    {feature.stats}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-20 bg-white" aria-labelledby="how-it-works-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-200 border-green-200">
              Simple Process
            </Badge>
            <h2 id="how-it-works-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Get Connected in 3 Steps
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our streamlined process gets you connected faster than traditional SIM cards
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full text-white text-2xl font-bold mb-4 group-hover:scale-110 transition-transform duration-300">
                    {step.step}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center group-hover:animate-pulse">
                    <step.icon className="h-4 w-4 text-white" />
                  </div>
                  {index < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-purple-200 -translate-x-1/2" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Plans Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-blue-50 to-purple-50" aria-labelledby="popular-plans-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200">
              Popular Destinations
            </Badge>
            <h2 id="popular-plans-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Top Travel Destinations
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our most popular eSIM plans for top travel destinations worldwide
            </p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {popularPlans.map((plan) => (
                <Card key={plan.id} className="professional-card group hover:shadow-2xl transition-all duration-300 border-0">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getFlagEmoji(plan.countryCode)}</span>
                        <div>
                          <CardTitle className="text-lg font-bold text-gray-900">{plan.country}</CardTitle>
                          <div className="text-sm text-gray-500">{plan.network.coverage}</div>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        Popular
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          ${plan.price}
                          {plan.promoApplied && (
                            <span className="text-sm text-gray-500 line-through ml-2">
                              ${plan.promoApplied.originalPrice}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {plan.data} • {plan.days} days
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Per GB</div>
                        <div className="text-lg font-semibold text-gray-900">
                          ${(plan.price / (plan.dataInMB / 1024)).toFixed(2)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Wifi className="h-4 w-4 text-green-500" />
                        <span>{plan.network.type} Network</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span>Instant activation</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Shield className="h-4 w-4 text-purple-500" />
                        <span>No contracts</span>
                      </div>
                    </div>

                    <Link href={`/plans/${plan.country.toLowerCase()}`}>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white group-hover:shadow-lg transition-all duration-200">
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/plans">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 text-lg rounded-xl"
              >
                View All Plans
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsComponent />

      {/* Travel Tips Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <TravelTips />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Ready to Stay Connected?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join millions of travelers who trust SIMRYO for their international connectivity needs
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link href="/plans">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
                >
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-blue-100">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Free setup</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>24/7 support</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Money-back guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

"use client"

import { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Wifi, Clock, Shield, ArrowLeft, Star, MapPin, Globe, Zap, Users, Award, ShoppingCart, CreditCard, Loader2, Filter, SlidersHorizontal, TrendingUp, Calendar, Database } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { toast } from 'sonner'
import type { EnhancedPlan } from "../page" // Simplified import
import { CurrencySelector } from "@/components/currency-selector"
import { useCurrency } from "@/lib/contexts/currency-context"

// Define Country type locally as it's specific to this page's structure now
interface Country {
  country: string
  flag: string
  region: string
  plans: EnhancedPlan[]
}

interface CartItem {
  countryId: number
  countryName: string
  planIndex: number
  quantity: number
  planData: {
    data: string
    days: number
    price: number
    provider: {
      name: string
      apiKey: string
    }
  }
}

export default function CountryPage() {
  const { formatPrice, convertPrice, currency } = useCurrency()
  const params = useParams()
  const countrySlug = params.country as string
  const router = useRouter()
  
  const countryName = countrySlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
  
  const [country, setCountry] = useState<Country | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartInitialized, setIsCartInitialized] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState<'best-value' | 'price-low' | 'price-high' | 'data-high' | 'data-low' | 'duration-short' | 'duration-long'>('best-value')
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200])
  const [durationFilter, setDurationFilter] = useState<'all' | 'short' | 'medium' | 'long'>('all')

  // Load country data from API
  useEffect(() => {
    loadCountryData()
  }, [countrySlug])

  // Load cart from localStorage on component mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cart')
    if (storedCart) {
      setCart(JSON.parse(storedCart))
    }
    setIsCartInitialized(true)
  }, [])

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    if (isCartInitialized) {
      localStorage.setItem('cart', JSON.stringify(cart))
      window.dispatchEvent(new CustomEvent('cart-updated'))
    }
  }, [cart, isCartInitialized])

  const loadCountryData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/plans/${countrySlug}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch country plans')
      }
      
      const result = await response.json()
      
      if (result.success && result.data && result.data.length > 0) {
        const plans = result.data

        // Filter out unreasonable plans
        const reasonablePlans = plans.filter((plan: EnhancedPlan) => {
          const gbAmount = plan.dataInMB / 1024
          const pricePerGB = plan.price / gbAmount
          const pricePerDay = plan.price / plan.days

          // Sanity checks for reasonable plans
          const isReasonable = (
            // Price per GB shouldn't be more than $15
            pricePerGB <= 15 &&
            // Price per day shouldn't be more than $5
            pricePerDay <= 5 &&
            // Minimum data amount should be at least 500MB
            plan.dataInMB >= 500 &&
            // Maximum price cap at $200
            plan.price <= 200 &&
            // Minimum price should be at least $3
            plan.price >= 3 &&
            // Days should be between 1 and 365
            plan.days >= 1 && plan.days <= 365 &&
            // Data amount shouldn't be ridiculously high (max 100GB)
            plan.dataInMB <= 102400
          )

          if (!isReasonable) {
            console.log(`Filtered out unreasonable plan:`, {
              data: `${gbAmount.toFixed(1)}GB`,
              price: plan.price,
              days: plan.days,
              pricePerGB: pricePerGB.toFixed(2),
              pricePerDay: pricePerDay.toFixed(2)
            })
          }

          return isReasonable
        })

        // Deduplicate plans with similar data amounts and prices
        const uniquePlans = reasonablePlans.reduce((acc: EnhancedPlan[], plan: EnhancedPlan) => {
          // Find similar plans (within 10% data and price difference)
          const similarPlan = acc.find(p => {
            const dataDiff = Math.abs(p.dataInMB - plan.dataInMB) / p.dataInMB
            const priceDiff = Math.abs(p.price - plan.price) / p.price
            return dataDiff < 0.1 && priceDiff < 0.1 && p.days === plan.days
          })

          // If no similar plan exists or this plan is better value, add it
          if (!similarPlan || (plan.price / plan.dataInMB < similarPlan.price / similarPlan.dataInMB)) {
            if (similarPlan) {
              // Remove the similar plan if this one is better value
              const index = acc.indexOf(similarPlan)
              acc.splice(index, 1)
            }
            acc.push(plan)
          }
          return acc
        }, [])

        // Group plans by duration for better comparison
        const durationGroups = {
          short: uniquePlans.filter((p: EnhancedPlan) => p.days <= 7),
          medium: uniquePlans.filter((p: EnhancedPlan) => p.days > 7 && p.days <= 30),
          long: uniquePlans.filter((p: EnhancedPlan) => p.days > 30)
        }

        // Sort each group by value (price per GB per day)
        const sortByValue = (plans: EnhancedPlan[]) => {
          return plans.sort((a, b) => {
            const aValue = (a.price / (a.dataInMB / 1024)) / a.days
            const bValue = (b.price / (b.dataInMB / 1024)) / b.days
            return aValue - bValue
          })
        }

        const sortedPlans = [
          ...sortByValue(durationGroups.short),
          ...sortByValue(durationGroups.medium),
          ...sortByValue(durationGroups.long)
        ]

        // Mark the best value plan in each duration group
        if (durationGroups.short.length > 0) durationGroups.short[0].popular = true
        if (durationGroups.medium.length > 0) durationGroups.medium[0].popular = true
        if (durationGroups.long.length > 0) durationGroups.long[0].popular = true
        
        // Mark the overall best value plan
        if (sortedPlans.length > 0) {
          const bestOverallPlan = sortedPlans.reduce((best, current) => {
            const bestValue = (best.price / (best.dataInMB / 1024)) / best.days
            const currentValue = (current.price / (current.dataInMB / 1024)) / current.days
            return currentValue < bestValue ? current : best
          }, sortedPlans[0])
          ;(bestOverallPlan as any).bestValue = true
        }
        
        const countryData: Country = {
          country: plans[0].country,
          flag: plans[0].flag || '🌍',
          region: plans[0].region || 'Unknown',
          plans: sortedPlans
        }
        
        setCountry(countryData)
      } else {
        setCountry(null)
      }
    } catch (error) {
      console.error('Error loading country data:', error)
      setError(error instanceof Error ? error.message : 'Failed to load country data')
      setCountry(null)
    } finally {
      setLoading(false)
    }
  }

  // Format price with proper decimals and currency using currency context
  const formatLocalPrice = (price: number) => {
    return formatPrice(convertPrice(price, 'EUR', currency))
  }

  // Calculate price per GB
  const getPricePerGB = (plan: EnhancedPlan) => {
    const gbAmount = plan.dataInMB / 1024
    const pricePerGB = plan.price / gbAmount
    return formatLocalPrice(pricePerGB)
  }

  // Calculate price per day
  const getPricePerDay = (plan: EnhancedPlan) => {
    return formatLocalPrice(plan.price / plan.days)
  }

  // Get value score for sorting
  const getValueScore = (plan: EnhancedPlan) => {
    const gbAmount = plan.dataInMB / 1024
    return (plan.price / gbAmount) / plan.days // Lower is better
  }

  // Sort plans based on selected criteria
  const sortPlans = (plans: EnhancedPlan[]) => {
    return [...plans].sort((a, b) => {
      switch (sortBy) {
        case 'best-value':
          return getValueScore(a) - getValueScore(b)
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'data-high':
          return b.dataInMB - a.dataInMB
        case 'data-low':
          return a.dataInMB - b.dataInMB
        case 'duration-short':
          return a.days - b.days
        case 'duration-long':
          return b.days - a.days
        default:
          return getValueScore(a) - getValueScore(b)
      }
    })
  }

  // Filter plans based on criteria
  const filterPlans = (plans: EnhancedPlan[]) => {
    return plans.filter(plan => {
      // Price range filter
      if (plan.price < priceRange[0] || plan.price > priceRange[1]) {
        return false
      }
      
      // Duration filter
      if (durationFilter !== 'all') {
        if (durationFilter === 'short' && plan.days > 7) return false
        if (durationFilter === 'medium' && (plan.days <= 7 || plan.days > 30)) return false
        if (durationFilter === 'long' && plan.days <= 30) return false
      }
      
      return true
    })
  }

  // Get the best plan for a specific data amount
  const getBestPlanForData = (dataAmount: number, plans: EnhancedPlan[]) => {
    const similarPlans = plans.filter(p => {
      const diff = Math.abs(p.dataInMB - dataAmount) / dataAmount
      return diff < 0.2 // Within 20% of the data amount
    })
    
    if (similarPlans.length === 0) return null
    
    return similarPlans.reduce((best, current) => {
      return getValueScore(current) < getValueScore(best) ? current : best
    })
  }

  // Format data amount
  const formatData = (dataInMB: number) => {
    if (dataInMB >= 1024) {
      return `${(dataInMB / 1024).toFixed(1)}GB`
    }
    return `${dataInMB}MB`
  }

  const addToCart = (plan: EnhancedPlan, planIndex: number) => {
    if (!country) return

    setCart(prev => {
      const existingItemIndex = prev.findIndex(
        item => item.countryName === country.country && item.planIndex === planIndex
      )

      if (existingItemIndex > -1) {
        const newCart = [...prev]
        newCart[existingItemIndex].quantity += 1
        return newCart
      } else {
        return [...prev, { 
          countryId: Number(plan.id), // Convert plan.id to number
          countryName: country.country,
          planIndex,
          quantity: 1,
          planData: {
            data: plan.data,
            days: plan.days,
            price: plan.price,
            provider: {
              name: plan.providerDisplayName,
              apiKey: plan.providerId
            }
          }
        }]
      }
    })

    toast.success(`${plan.data} plan for ${country.country} added to cart!`, {
      action: {
        label: "View Cart",
        onClick: () => router.push('/cart'),
      },
    })
  }

  const getCartItemCount = (planIndex: number) => {
    if (!country) return 0
    const item = cart.find(item => item.countryName === country.country && item.planIndex === planIndex)
    return item?.quantity || 0
  }

  const getTotalCartItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalCartValue = () => {
    return cart.reduce((total, item) => total + (item.planData.price * item.quantity), 0)
  }

  // Get display plans (filtered and sorted)
  const getDisplayPlans = () => {
    if (!country?.plans) return []
    const filtered = filterPlans(country.plans)
    return sortPlans(filtered)
  }

  // Get savings amount compared to worst plan
  const getSavings = (plan: EnhancedPlan) => {
    if (!country?.plans) return 0
    const worstPlan = country.plans.reduce((worst, current) => {
      return getValueScore(current) > getValueScore(worst) ? current : worst
    })
    const savings = worstPlan.price - plan.price
    return Math.max(0, savings)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 pt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-emerald-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Plans</h2>
            <p className="text-gray-600">Finding all eSIM plans for {countryName}...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !country) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 pt-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/plans" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to All Countries
          </Link>
          <div className="text-center bg-white rounded-2xl shadow-lg p-12">
            <div className="text-6xl mb-6">🌍</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">No Plans Found</h1>
            <p className="text-gray-600 text-lg">We couldn't find any plans for "{countryName}" at the moment.</p>
            <Link href="/plans">
              <Button className="mt-6 bg-emerald-600 hover:bg-emerald-700">
                Browse Other Countries
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white pt-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex items-center justify-between mb-8">
            <Link href="/plans" className="inline-flex items-center text-white/90 hover:text-white transition-colors group">
              <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Plans
            </Link>
            
            {/* Cart Icon */}
            {getTotalCartItems() > 0 && (
              <div className="relative">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-2 shadow-lg border border-white/30">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="text-sm font-medium">{getTotalCartItems()} items</span>
                  <span className="text-sm font-bold">${getTotalCartValue().toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 mb-8">
              <div className="relative">
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-2xl border border-white/30">
                  <span className="text-6xl sm:text-7xl drop-shadow-2xl">{country.flag}</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm font-bold">{country.plans.length}</span>
                </div>
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-4xl sm:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  {country.country}
                </h1>
                <div className="flex items-center justify-center sm:justify-start text-lg sm:text-xl text-blue-100 mb-2">
                  <MapPin className="h-5 w-5 mr-2" />
                  {country.region}
                </div>
                <div className="flex items-center justify-center sm:justify-start text-sm text-blue-200">
                  <Globe className="h-4 w-4 mr-2" />
                  {country.plans.length} premium plans available
                </div>
              </div>
            </div>
            <p className="text-lg sm:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Premium eSIM plans for {country.country}. Instant activation, blazing-fast speeds, and reliable coverage nationwide.
              <br />
              <span className="text-white font-semibold">✨ Best prices guaranteed with 24/7 customer support</span>
            </p>
          </div>
        </div>
      </div>

      {/* Plans Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Choose Your Perfect Plan</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">Select from our premium eSIM data plans for {country.country}. All plans include instant activation and 24/7 support.</p>
          
          {/* Currency Selector */}
          <div className="flex justify-center">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">View prices in:</span>
              <CurrencySelector variant="compact" />
            </div>
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-12">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-semibold text-gray-700">Sort by:</span>
              </div>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-sm border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm font-medium min-w-[180px]"
              >
                <option value="best-value">🏆 Best Value</option>
                <option value="price-low">💰 Price: Low to High</option>
                <option value="price-high">💎 Price: High to Low</option>
                <option value="data-high">📊 Data: High to Low</option>
                <option value="data-low">📊 Data: Low to High</option>
                <option value="duration-short">⏱️ Duration: Short to Long</option>
                <option value="duration-long">⏳ Duration: Long to Short</option>
              </select>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-semibold text-gray-700">Duration:</span>
              </div>
              <select 
                value={durationFilter} 
                onChange={(e) => setDurationFilter(e.target.value as any)}
                className="text-sm border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm font-medium min-w-[160px]"
              >
                <option value="all">All Durations</option>
                <option value="short">Short (1-7 days)</option>
                <option value="medium">Medium (8-30 days)</option>
                <option value="long">Long (30+ days)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {getDisplayPlans().map((plan: EnhancedPlan, index: number) => {
            const savings = getSavings(plan)
            const isRecommended = (plan as any).bestValue || plan.popular
            
            return (
              <Card key={index} className={`relative transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-2 ${
                isRecommended 
                  ? 'border-blue-400 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 shadow-xl' 
                  : 'border-gray-200 hover:border-blue-300 bg-white'
              } ${selectedPlan === index ? 'ring-2 ring-blue-500 shadow-2xl' : ''} rounded-2xl overflow-hidden`}>
                
                {/* Top badges */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                  {(plan as any).bestValue && (
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 shadow-lg text-sm font-semibold">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      Best Value
                    </Badge>
                  )}
                  {plan.popular && !(plan as any).bestValue && (
                    <Badge className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 shadow-lg text-sm font-semibold">
                      <Star className="h-4 w-4 mr-1" />
                      Popular
                    </Badge>
                  )}
                </div>
                
                {/* Savings indicator */}
                {savings > 0 && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                      Save ${savings.toFixed(0)}
                    </div>
                  </div>
                )}

                <CardHeader className="text-center pb-4 pt-8">
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-gray-900 mb-1">{formatData(plan.dataInMB)}</div>
                    <div className="text-sm text-gray-500 flex items-center justify-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {plan.days} days validity
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-4xl font-bold text-emerald-600 mb-2">
                      {formatLocalPrice(plan.price)}
                    </div>
                    <div className="text-sm text-gray-500 space-y-1">
                      <div className="flex items-center justify-center gap-3">
                        <span className="inline-flex items-center">
                          <Database className="h-3 w-3 mr-1" />
                          {getPricePerGB(plan)}/GB
                        </span>
                        <span className="inline-flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {getPricePerDay(plan)}/day
                        </span>
                      </div>
                      <div className="text-xs text-emerald-600 font-medium">
                        Value Score: {(1 / getValueScore(plan)).toFixed(1)}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Key Features */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center">
                      <Wifi className="h-4 w-4 text-emerald-600 mr-2" />
                      <span>{plan.network?.type || 'LTE/5G'}</span>
                    </div>
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 text-emerald-600 mr-2" />
                      <span>Secure</span>
                    </div>
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 text-emerald-600 mr-2" />
                      <span>Instant Setup</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-emerald-600 mr-2" />
                      <span>24/7 Support</span>
                    </div>
                  </div>

                <Separator />

                  <div className="space-y-2">
                    <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">Provider</div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{plan.providerDisplayName}</span>
                      <Badge variant="outline" className="text-xs">
                        {plan.inStock ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </div>
                  </div>

                  {plan.features && plan.features.length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">Features</div>
                        <div className="space-y-1">
                          {plan.features.slice(0, 3).map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center text-sm">
                              <CheckCircle className="h-3 w-3 text-emerald-600 mr-2 flex-shrink-0" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  <div className="pt-4 space-y-3">
                    <Button 
                      onClick={() => addToCart(plan, index)}
                      className={`w-full text-white transition-all duration-200 ${
                        isRecommended 
                          ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-lg' 
                          : 'bg-emerald-600 hover:bg-emerald-700'
                      }`}
                      disabled={!plan.inStock}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {plan.inStock ? 'Add to Cart' : 'Out of Stock'}
                      {getCartItemCount(index) > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {getCartItemCount(index)}
                        </Badge>
                      )}
                    </Button>
                    
                    {plan.inStock && (
                      <Button 
                        variant="outline" 
                        className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                        onClick={() => {
                          addToCart(plan, index)
                          router.push('/cart')
                        }}
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Buy Now
                      </Button>
                    )}
                  </div>
              </CardContent>
            </Card>
            )
          })}
        </div>
        
        {/* No plans message */}
        {getDisplayPlans().length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No plans match your filters</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria</p>
            <Button 
              onClick={() => {
                setSortBy('best-value')
                setDurationFilter('all')
                setPriceRange([0, 200])
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Plan Summary */}
        {country.plans.length > 0 && (
          <div className="mt-16 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-8 shadow-xl border border-blue-200">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Plan Summary</h3>
              <p className="text-lg text-gray-600">Quick overview of your options in {country.country}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <div className="text-4xl font-bold text-blue-600 mb-3">
                  {country.plans.length}
                </div>
                <div className="text-sm font-semibold text-gray-700">Total Plans Available</div>
                <div className="text-xs text-gray-500 mt-1">Choose from multiple providers</div>
              </div>
              
              <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <div className="text-4xl font-bold text-emerald-600 mb-3">
                  {formatLocalPrice(Math.min(...country.plans.map(p => p.price)))}
                </div>
                <div className="text-sm font-semibold text-gray-700">Starting Price</div>
                <div className="text-xs text-gray-500 mt-1">Best value guaranteed</div>
              </div>
              
              <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <div className="text-4xl font-bold text-purple-600 mb-3">
                  {formatData(Math.max(...country.plans.map(p => p.dataInMB)))}
                </div>
                <div className="text-sm font-semibold text-gray-700">Max Data Available</div>
                <div className="text-xs text-gray-500 mt-1">High-speed connectivity</div>
              </div>
            </div>
          </div>
        )}

        {/* Additional Information */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center p-8 bg-gradient-to-br from-blue-50 to-white shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-blue-100">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Instant Activation</h3>
            <p className="text-gray-600">Your eSIM activates immediately after purchase. No waiting time, no hassle.</p>
          </Card>
          
          <Card className="text-center p-8 bg-gradient-to-br from-emerald-50 to-white shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-emerald-100">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Secure & Reliable</h3>
            <p className="text-gray-600">Enterprise-grade security with 99.9% network uptime guarantee.</p>
          </Card>
          
          <Card className="text-center p-8 bg-gradient-to-br from-purple-50 to-white shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-purple-100">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">24/7 Support</h3>
            <p className="text-gray-600">Round-the-clock customer support for all your connectivity needs.</p>
          </Card>
        </div>
      </div>
    </div>
  )
} 

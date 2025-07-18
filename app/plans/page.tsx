"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Clock, Globe, ArrowRight, Loader2, Wifi, Shield, Zap, RefreshCw } from "lucide-react"
import Link from "next/link"
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Enhanced Plan interface matching the API response
export interface EnhancedPlan {
  id: string
  country: string
  countryCode: string
  flag?: string
  region?: string
  data: string
  dataInMB: number
  days: number
  price: number
  currency: string
  popular?: boolean
  featured?: boolean
  providerId: string
  providerDisplayName: string
  popularity: number
  network: {
    type: string
    carriers: string[]
    coverage: string
  }
  features: string[]
  inStock: boolean
  lastUpdated: Date
  promoApplied?: {
    savings: number
    originalPrice: number
  }
}

export interface Country {
  id: number
  country: string
  flag: string
  region: string
  plans: EnhancedPlan[]
  allPlans: EnhancedPlan[]
}

// Helper function to group plans by country and select top 3
function groupPlansByCountry(plans: EnhancedPlan[]): Country[] {
  const countryMap: Record<string, { country: string, flag: string, region: string, plans: EnhancedPlan[] }> = {}

  plans.forEach(plan => {
    const countryKey = plan.country
    if (!countryMap[countryKey]) {
      countryMap[countryKey] = {
        country: plan.country,
        flag: plan.flag || '🌍',
        region: plan.region || 'Unknown',
        plans: []
      }
    }
    countryMap[countryKey].plans.push(plan)
  })

  return Object.values(countryMap).map((country, index) => {
    const sortedPlans = country.plans.sort((a, b) => b.popularity - a.popularity)
    return {
      id: index + 1,
      country: country.country,
      flag: country.flag,
      region: country.region,
      plans: sortedPlans.slice(0, 3), // Get top 3 plans
      allPlans: sortedPlans // Keep all plans for counts/etc.
    }
  })
}

// API service functions
const apiService = {
  async fetchPlans(params: {
    country?: string
    sortBy?: string
    sortOrder?: string
    limit?: number
  } = {}) {
    const searchParams = new URLSearchParams()
    if (params.country) searchParams.set('countryCode', params.country) // Fix: use countryCode
    if (params.sortBy) searchParams.set('sortBy', params.sortBy)
    if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder)
    if (params.limit) searchParams.set('limit', params.limit.toString())

    const response = await fetch(`/api/plans?${searchParams}`)
    if (!response.ok) throw new Error('Failed to fetch plans')
    return response.json()
  },

  async fetchPopularPlans(limit: number = 10) {
    const response = await fetch(`/api/plans/popular?limit=${limit}`)
    if (!response.ok) throw new Error('Failed to fetch popular plans')
    return response.json()
  },

  async fetchProviderHealth() {
    const response = await fetch('/api/providers')
    if (!response.ok) throw new Error('Failed to fetch provider status')
    return response.json()
  }
}

export default function PlansPage() {
  const searchParams = useSearchParams()
  const [plans, setPlans] = useState<EnhancedPlan[]>([])
  const [countries, setCountries] = useState<Country[]>([])
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [providerHealth, setProviderHealth] = useState<any>(null)

  // Load plans from API
  useEffect(() => {
    loadPlans()
  }, [])

  // Load provider health status
  useEffect(() => {
    loadProviderHealth()
  }, [])

  const loadPlans = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await apiService.fetchPlans({
        sortBy: 'popularity',
        sortOrder: 'desc'
      })

      if (response.success) {
        const plans = response.plans || response.data || []
        setPlans(plans)
        const groupedCountries = groupPlansByCountry(plans)
        setCountries(groupedCountries)
        setFilteredCountries(groupedCountries)
        
        toast.success(`Loaded ${plans.length} plans from ${response.meta?.providers?.length || 0} providers`)
      } else {
        throw new Error(response.error || 'Failed to load plans')
      }
    } catch (error) {
      console.error('Error loading plans:', error)
      setError(error instanceof Error ? error.message : 'Failed to load plans')
      toast.error('Failed to load plans. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const loadProviderHealth = async () => {
    try {
      const response = await apiService.fetchProviderHealth()
      if (response.success) {
        setProviderHealth(response.data)
      }
    } catch (error) {
      console.error('Error loading provider health:', error)
    }
  }

  const refreshPlans = async () => {
    await loadPlans()
  }

  // Filter countries based on search and region
  useEffect(() => {
    let filtered = countries

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(country =>
        country.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.region.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by region
    if (selectedRegion !== "all") {
      filtered = filtered.filter(country => country.region === selectedRegion)
    }

    setFilteredCountries(filtered)
  }, [searchTerm, selectedRegion, countries])

  // Get unique regions from countries
  const regions = ['all', ...Array.from(new Set(countries.map(country => country.region))).sort()]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 pt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-emerald-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Plans</h2>
            <p className="text-gray-600">Fetching the latest eSIM plans from all providers...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 pt-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center bg-white rounded-2xl shadow-lg p-12">
            <div className="text-red-500 mb-6">
              <Globe className="h-16 w-16 mx-auto mb-4" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Error Loading Plans</h1>
            <p className="text-gray-600 text-lg mb-6">{error}</p>
            <Button onClick={refreshPlans} className="bg-emerald-600 hover:bg-emerald-700">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 px-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-6">
            <Globe className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl mb-4">
            Choose Your Perfect eSIM Plan
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Compare plans from top providers and find the best data packages for your destination. 
            <span className="text-emerald-600 font-medium"> Featured plans available for instant purchase!</span>
          </p>
        </div>

        {/* First Time User Promo Alert */}
        <div className="mb-8 max-w-4xl mx-auto">
          <Alert className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 shadow-lg">
            <AlertTitle className="text-emerald-800 flex items-center gap-2 text-lg">
              🎉 Special Launch Offer! 
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 animate-pulse">
                WELCOME15
              </Badge>
            </AlertTitle>
            <AlertDescription className="text-emerald-700 mt-2">
              Get <strong>15% off</strong> on your first eSIM purchase! Discount will be automatically applied at checkout. 
              Perfect for testing our featured plans with instant checkout.
            </AlertDescription>
          </Alert>
        </div>

        {/* Filters */}
        <div className="mb-8 sm:mb-10">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Find Your Perfect Plan</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="relative lg:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search by country or region..."
                  className="w-full pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="w-full h-12 border-gray-200">
                  <SelectValue placeholder="Filter by region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map(region => (
                    <SelectItem key={region} value={region}>
                      {region === 'all' ? 'All Regions' : region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {filteredCountries.length > 0 ? (
            filteredCountries.map(country => {
              const countrySlug = country.country.toLowerCase().replace(/\s+/g, '-')
              return (
                <div key={country.id} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-4 mb-4 sm:mb-0">
                        <div className="relative">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-2xl">{country.flag}</span>
                          </div>
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{country.plans.length}</span>
                          </div>
                        </div>
                        <div>
                          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{country.country}</h2>
                          <div className="flex items-center gap-3 text-gray-600">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span className="text-sm">{country.region}</span>
                            </div>
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                              {country.allPlans.length} plans available
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Link href={`/plans/${countrySlug}`}>
                        <Button variant="outline" className="w-full sm:w-auto border-gray-300 hover:border-gray-400 hover:bg-gray-50">
                          View All Plans <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="p-6 sm:p-8">

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {country.plans.map((plan, index) => (
                      <Card key={plan.id} className={`group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                        plan.featured ? 'ring-2 ring-emerald-500 shadow-lg' : ''
                      } ${index === 0 ? 'border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50' : ''}`}>
                        {/* Featured Badge */}
                        {plan.featured && (
                          <div className="absolute top-0 right-0 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1 rounded-bl-lg text-sm font-medium">
                            ⭐ Featured
                          </div>
                        )}
                        
                        {/* Best Value Badge */}
                        {index === 0 && (
                          <div className="absolute top-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-br-lg text-sm font-medium">
                            🏆 Best Value
                          </div>
                        )}

                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                                <Globe className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <CardTitle className="text-lg font-bold text-gray-900">{plan.data}</CardTitle>
                                <CardDescription className="text-sm text-gray-500">{plan.providerDisplayName}</CardDescription>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{plan.days} days</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Wifi className="h-4 w-4" />
                              <span>{plan.network.type}</span>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="flex-grow flex flex-col justify-between">
                          {/* Features */}
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                              <span>Instant Activation</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                              <span>No Contracts</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                              <span>24/7 Support</span>
                            </div>
                          </div>

                          {/* Pricing */}
                          <div className="mt-auto">
                            <div className="text-center mb-4">
                              <div className="flex items-baseline justify-center gap-1">
                                <span className="text-3xl font-bold text-gray-900">${plan.price.toFixed(2)}</span>
                                <span className="text-sm text-gray-500">{plan.currency}</span>
                              </div>
                              {plan.promoApplied && (
                                <div className="flex items-center justify-center gap-2 mt-1">
                                  <span className="text-sm text-red-500 line-through">
                                    ${plan.promoApplied.originalPrice.toFixed(2)}
                                  </span>
                                  <Badge variant="destructive" className="text-xs">
                                    Save ${(plan.promoApplied.originalPrice - plan.price).toFixed(2)}
                                  </Badge>
                                </div>
                              )}
                              <div className="text-xs text-gray-500 mt-1">
                                ~${(plan.price / plan.days).toFixed(2)} per day
                              </div>
                            </div>

                            <Link href={`/plans/${countrySlug}/${plan.id}`} className="w-full">
                              <Button className={`w-full transition-all duration-200 ${
                                plan.featured 
                                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg' 
                                  : index === 0 
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg'
                                    : 'bg-gray-900 hover:bg-gray-800'
                              }`}>
                                {plan.featured ? (
                                  <>
                                    <Zap className="h-4 w-4 mr-2" />
                                    Quick Buy
                                  </>
                                ) : (
                                  <>
                                    <ArrowRight className="h-4 w-4 mr-2" />
                                    View Details
                                  </>
                                )}
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="text-center bg-white rounded-3xl shadow-xl p-12 border border-gray-100">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="text-4xl">🔍</div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No matching plans found</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                We couldn't find any plans matching your search criteria. Try adjusting your filters or browse all available destinations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => { setSearchTerm(''); setSelectedRegion('all'); }} 
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
                <Button variant="outline" onClick={() => setSearchTerm('')}>
                  Browse All Countries
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

   
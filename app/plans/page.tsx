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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 sm:mb-12 px-4">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">Choose Your eSIM Plan</h1>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-600">Find the perfect data plan for your destination</p>
        </div>

        {/* First Time User Promo Alert */}
        <Alert className="mb-8 bg-green-50 border-green-200">
          <AlertTitle className="text-green-800 flex items-center gap-2">
            Special Offer! <Badge variant="secondary" className="bg-green-100 text-green-800">WELCOME15</Badge>
          </AlertTitle>
          <AlertDescription className="text-green-700">
            Get 15% off on your first eSIM purchase! Discount will be automatically applied at checkout.
          </AlertDescription>
        </Alert>

        {/* Filters */}
        <div className="mb-6 sm:mb-8 flex flex-col gap-3 sm:gap-4 px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Search by country or region..."
                className="w-full pl-10 h-11"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="w-full h-11">
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

        {/* Main Content */}
        <div className="space-y-12">
          {filteredCountries.length > 0 ? (
            filteredCountries.map(country => {
              const countrySlug = country.country.toLowerCase().replace(/\s+/g, '-')
              return (
                <div key={country.id} className="bg-white rounded-2xl shadow-lg overflow-hidden p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                    <div className="flex items-center gap-4 mb-4 sm:mb-0">
                      <span className="text-4xl sm:text-5xl">{country.flag}</span>
                      <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{country.country}</h2>
                        <div className="flex items-center gap-2 text-gray-600 mt-1">
                          <MapPin className="h-4 w-4" />
                          <span>{country.region}</span>
                          <span className="text-gray-300">|</span>
                          <Badge variant="outline">{country.allPlans.length} plans available</Badge>
                        </div>
                      </div>
                    </div>
                    <Link href={`/plans/${countrySlug}`}>
                      <Button variant="outline" className="w-full sm:w-auto">
                        View All Plans <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {country.plans.map((plan, index) => (
                      <Card key={plan.id} className="flex flex-col">
                        <CardHeader>
                          <CardTitle className="flex justify-between items-start">
                            <span className="text-xl font-bold">{plan.data}</span>
                            {index === 0 && <Badge>Best Value</Badge>}
                          </CardTitle>
                          <CardDescription>{plan.days} Days Validity</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col justify-between">
                          <ul className="space-y-2 text-sm text-gray-600 mb-4">
                            <li className="flex items-center gap-2">
                              <Wifi className="h-4 w-4 text-emerald-500" />
                              <span>{plan.network.type} Connection</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Shield className="h-4 w-4 text-emerald-500" />
                              <span>Secure Private Network</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Zap className="h-4 w-4 text-emerald-500" />
                              <span>Instant Activation</span>
                            </li>
                          </ul>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-gray-900 mb-2">
                              ${plan.price.toFixed(2)}
                              {plan.promoApplied && (
                                <span className="text-base font-normal text-red-500 line-through ml-2">
                                  ${plan.promoApplied.originalPrice.toFixed(2)}
                                </span>
                              )}
                            </div>
                            <Link href={`/plans/${countrySlug}/${plan.id}`} className="w-full">
                              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            })
          ) : (
            <div className="text-center bg-white rounded-2xl shadow-lg p-12">
              <div className="text-6xl mb-6">🙁</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">No matching plans found</h2>
              <p className="text-gray-600 mb-6">Try adjusting your search or region filter to find the best eSIM for your trip.</p>
              <Button onClick={() => { setSearchTerm(''); setSelectedRegion('all'); }} variant="outline">
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

   
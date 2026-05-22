"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ArrowRight, Loader2, Wifi, Clock, RefreshCw, MapPin } from "lucide-react"
import Link from "next/link"
import { toast } from 'sonner'
import { analytics } from "@/lib/analytics"
import { CurrencySelector } from "@/components/currency-selector"
import { useCurrency } from "@/lib/contexts/currency-context"

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
  countryCode: string
  region: string
  plans: EnhancedPlan[]
  allPlans: EnhancedPlan[]
}

const countryNameToCode: Record<string, string> = {
  'ireland': 'ie', 'united states': 'us', 'united kingdom': 'gb',
  'china mainland': 'cn', 'south korea': 'kr', 'new zealand': 'nz',
  'saudi arabia': 'sa', 'south africa': 'za', 'uae': 'ae',
  'united arab emirates': 'ae',
}

function getFlagUrl(countryCode: string, countryName?: string) {
  if (countryName) {
    const mapped = countryNameToCode[countryName.toLowerCase()]
    if (mapped) return `https://flagcdn.com/w40/${mapped}.png`
  }
  const code = countryCode.split(',')[0].trim().toLowerCase()
  return `https://flagcdn.com/w40/${code}.png`
}

function groupPlansByCountry(plans: EnhancedPlan[]): Country[] {
  const countryMap: Record<string, { country: string; countryCode: string; region: string; plans: EnhancedPlan[] }> = {}

  plans.forEach(plan => {
    if (!countryMap[plan.country]) {
      countryMap[plan.country] = {
        country: plan.country,
        countryCode: plan.countryCode,
        region: plan.region || 'Unknown',
        plans: []
      }
    }
    countryMap[plan.country].plans.push(plan)
  })

  return Object.values(countryMap).map((c, index) => {
    const sorted = c.plans.sort((a, b) => b.popularity - a.popularity)
    return {
      id: index + 1,
      country: c.country,
      countryCode: c.countryCode,
      region: c.region,
      plans: sorted.slice(0, 3),
      allPlans: sorted
    }
  })
}

const apiService = {
  async fetchPlans(params: { country?: string; sortBy?: string; sortOrder?: string; limit?: number } = {}) {
    const searchParams = new URLSearchParams()
    if (params.country) searchParams.set('countryCode', params.country)
    if (params.sortBy) searchParams.set('sortBy', params.sortBy)
    if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder)
    if (params.limit) searchParams.set('limit', params.limit.toString())
    const response = await fetch(`/api/plans?${searchParams}`)
    if (!response.ok) throw new Error('Failed to fetch plans')
    return response.json()
  },

  async fetchProviderHealth() {
    const response = await fetch('/api/providers')
    if (!response.ok) throw new Error('Failed to fetch provider status')
    return response.json()
  }
}

function PlansPageContent() {
  const { formatPrice, convertPrice, currency } = useCurrency()
  const [countries, setCountries] = useState<Country[]>([])
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { loadPlans() }, [])

  const loadPlans = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiService.fetchPlans({ sortBy: 'popularity', sortOrder: 'desc' })
      if (response.success) {
        const grouped = groupPlansByCountry(response.plans || response.data || [])
        setCountries(grouped)
        setFilteredCountries(grouped)
      } else {
        throw new Error(response.error || 'Failed to load plans')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load plans')
      toast.error('Failed to load plans. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let filtered = countries
    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.region.toLowerCase().includes(searchTerm.toLowerCase())
      )
      analytics.searchPlans(searchTerm)
    }
    if (selectedRegion !== "all") {
      filtered = filtered.filter(c => c.region === selectedRegion)
      analytics.selectCountry(selectedRegion)
    }
    setFilteredCountries(filtered)
  }, [searchTerm, selectedRegion, countries])

  const regions = ['all', ...Array.from(new Set(countries.map(c => c.region))).sort()]

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400 mb-4" />
          <p className="text-sm text-gray-500">Loading plans...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-center max-w-sm">
          <p className="text-gray-900 font-semibold mb-2">Failed to load plans</p>
          <p className="text-sm text-gray-500 mb-6">{error}</p>
          <button onClick={loadPlans} className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">eSIM Plans</p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Browse destinations</h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Prices in:</span>
              <CurrencySelector variant="compact" />
            </div>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search country or region..."
              className="pl-10 h-11 border-gray-200 rounded-xl text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-full sm:w-52 h-11 border-gray-200 rounded-xl text-sm">
              <SelectValue placeholder="All regions" />
            </SelectTrigger>
            <SelectContent>
              {regions.map(region => (
                <SelectItem key={region} value={region}>
                  {region === 'all' ? 'All regions' : region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Country groups */}
        {filteredCountries.length > 0 ? (
          <div className="space-y-8">
            {filteredCountries.map(country => {
              const countrySlug = country.country.toLowerCase().replace(/\s+/g, '-')
              return (
                <div key={country.id} className="border border-gray-200 rounded-2xl overflow-hidden">

                  {/* Country header */}
                  <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-4">
                      <img
                        src={getFlagUrl(country.countryCode, country.country)}
                        alt={country.country}
                        className="w-10 h-7 rounded-sm object-cover border border-gray-200"
                      />
                      <div>
                        <h2 className="text-base font-bold text-gray-900">{country.country}</h2>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-400">{country.region}</span>
                          <span className="text-gray-300 mx-1">·</span>
                          <span className="text-xs text-gray-400">View plans</span>
                        </div>
                      </div>
                    </div>
                    <Link href={`/plans/${countrySlug}`}>
                      <button className="inline-flex items-center gap-2 border border-gray-200 hover:border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        All plans
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </Link>
                  </div>

                  {/* Plan cards */}
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {country.plans.map((plan) => (
                      <Link key={plan.id} href={`/plans/${countrySlug}`} className="block">
                        <div className="bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md rounded-xl overflow-hidden transition-all duration-200 flex flex-col">

                          {/* Card header */}
                          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                            <div className="text-sm font-medium text-gray-500">{plan.network.type} · {plan.network.coverage}</div>
                            {plan.promoApplied && (
                              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-2 py-0.5">Sale</span>
                            )}
                          </div>

                          {/* Card body */}
                          <div className="px-4 py-4 flex flex-col flex-1">
                            {/* Price */}
                            <div className="mb-3">
                              <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-gray-900 tracking-tight">
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

                            {/* Data + Days */}
                            <div className="flex items-center gap-2 mb-4">
                              <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1">
                                <Wifi className="h-3 w-3 text-gray-400" />
                                <span className="text-sm font-semibold text-gray-700">{plan.data}</span>
                              </div>
                              <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1">
                                <Clock className="h-3 w-3 text-gray-400" />
                                <span className="text-sm font-semibold text-gray-700">{plan.days} days</span>
                              </div>
                            </div>

                            {/* CTA */}
                            <div className="mt-auto">
                              <div className="w-full flex items-center justify-between bg-gray-900 text-white rounded-lg px-4 py-2.5 text-sm font-semibold">
                                <span>Get Plan</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-900 font-semibold mb-2">No destinations found</p>
            <p className="text-sm text-gray-500 mb-6">Try a different search or clear your filters.</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedRegion('all') }}
              className="inline-flex items-center gap-2 border border-gray-200 hover:border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function PlansPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    }>
      <PlansPageContent />
    </Suspense>
  )
}

"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Wifi, Clock, ShoppingCart, CreditCard, Loader2, SlidersHorizontal, Filter, CheckCircle, Shield, Zap, Users } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { toast } from 'sonner'
import type { EnhancedPlan } from "../page"
import { CurrencySelector } from "@/components/currency-selector"
import { useCurrency } from "@/lib/contexts/currency-context"
import { filterAllowedPlans } from "@/lib/utils/plan-filter"

interface Country {
  country: string
  countryCode: string
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
    provider: { name: string; apiKey: string }
  }
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

export default function CountryPage() {
  const { formatPrice, convertPrice, currency } = useCurrency()
  const params = useParams()
  const countrySlug = params.country as string
  const router = useRouter()

  const countryName = countrySlug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  const [country, setCountry] = useState<Country | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartInitialized, setIsCartInitialized] = useState(false)
  const [sortBy, setSortBy] = useState<'best-value' | 'price-low' | 'price-high' | 'data-high' | 'data-low' | 'duration-short' | 'duration-long'>('best-value')
  const [durationFilter, setDurationFilter] = useState<'all' | 'short' | 'medium' | 'long'>('all')

  useEffect(() => { loadCountryData() }, [countrySlug])

  useEffect(() => {
    const stored = localStorage.getItem('cart')
    if (stored) setCart(JSON.parse(stored))
    setIsCartInitialized(true)
  }, [])

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
      if (!response.ok) throw new Error('Failed to fetch country plans')
      const result = await response.json()

      if (result.success && result.data?.length > 0) {
        const plans = result.data
        const countryInfo = {
          country: plans[0].country,
          flag: plans[0].flag || '',
          region: plans[0].region || 'Unknown'
        }
        const filtered = filterAllowedPlans(plans.filter((p: EnhancedPlan) => p.inStock), countryInfo)

        const sorted = filtered.sort((a: EnhancedPlan, b: EnhancedPlan) => a.dataInMB - b.dataInMB)

        if (sorted.length > 0) {
          const best = sorted.reduce((b: EnhancedPlan, c: EnhancedPlan) =>
            getValueScore(c) < getValueScore(b) ? c : b, sorted[0])
          ;(best as any).bestValue = true
        }

        setCountry({
          country: plans[0].country,
          countryCode: plans[0].countryCode || '',
          region: plans[0].region || 'Unknown',
          plans: sorted
        })
      } else {
        setCountry(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load')
      setCountry(null)
    } finally {
      setLoading(false)
    }
  }

  const fmt = (price: number) => formatPrice(convertPrice(price, 'EUR', currency))
  const getValueScore = (p: EnhancedPlan) => (p.price / (p.dataInMB / 1024)) / p.days
  const getPricePerGB = (p: EnhancedPlan) => fmt(p.price / (p.dataInMB / 1024))
  const getPricePerDay = (p: EnhancedPlan) => fmt(p.price / p.days)
  const formatData = (mb: number) => mb >= 1024 ? `${(mb / 1024).toFixed(1)}GB` : `${mb}MB`

  const getDisplayPlans = () => {
    if (!country?.plans) return []
    let plans = [...country.plans]

    if (durationFilter !== 'all') {
      plans = plans.filter(p => {
        if (durationFilter === 'short') return p.days <= 7
        if (durationFilter === 'medium') return p.days > 7 && p.days <= 30
        if (durationFilter === 'long') return p.days > 30
        return true
      })
    }

    return plans.sort((a, b) => {
      switch (sortBy) {
        case 'best-value': return getValueScore(a) - getValueScore(b)
        case 'price-low': return a.price - b.price
        case 'price-high': return b.price - a.price
        case 'data-high': return b.dataInMB - a.dataInMB
        case 'data-low': return a.dataInMB - b.dataInMB
        case 'duration-short': return a.days - b.days
        case 'duration-long': return b.days - a.days
        default: return getValueScore(a) - getValueScore(b)
      }
    })
  }

  const addToCart = (plan: EnhancedPlan, planIndex: number) => {
    if (!country) return
    setCart(prev => {
      const existing = prev.findIndex(i => i.countryName === country.country && i.planIndex === planIndex)
      if (existing > -1) {
        const next = [...prev]
        next[existing].quantity += 1
        return next
      }
      return [...prev, {
        countryId: Number(plan.id),
        countryName: country.country,
        countryCode: country.countryCode,
        planIndex,
        quantity: 1,
        planData: {
          data: plan.data, days: plan.days, price: plan.price,
          provider: { name: plan.providerDisplayName, apiKey: plan.providerId }
        }
      }]
    })
    toast.success(`${plan.data} plan added to cart`, {
      action: { label: "View Cart", onClick: () => router.push('/cart') }
    })
  }

  const getCartCount = (planIndex: number) => {
    if (!country) return 0
    return cart.find(i => i.countryName === country.country && i.planIndex === planIndex)?.quantity || 0
  }

  const totalCartItems = cart.reduce((t, i) => t + i.quantity, 0)
  const totalCartValue = fmt(cart.reduce((t, i) => t + i.planData.price * i.quantity, 0))

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading plans for {countryName}...</p>
        </div>
      </div>
    )
  }

  if (error || !country) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-center max-w-sm">
          <p className="font-semibold text-gray-900 mb-2">No plans found for {countryName}</p>
          <p className="text-sm text-gray-500 mb-6">{error || "We don't have plans for this destination yet."}</p>
          <Link href="/plans">
            <button className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Browse all countries
            </button>
          </Link>
        </div>
      </div>
    )
  }

  const displayPlans = getDisplayPlans()

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">

        {/* Back + cart */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/plans" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            All countries
          </Link>
          {totalCartItems > 0 && (
            <Link href="/cart">
              <div className="inline-flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:border-gray-300 transition-colors">
                <ShoppingCart className="h-4 w-4" />
                {totalCartItems} item{totalCartItems > 1 ? 's' : ''} · {totalCartValue}
              </div>
            </Link>
          )}
        </div>

        {/* Country header */}
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
          <img
            src={getFlagUrl(country.countryCode, country.country)}
            alt={country.country}
            className="w-14 h-10 rounded object-cover border border-gray-200 shadow-sm"
          />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{country.country}</h1>
            <p className="text-sm text-gray-400 mt-0.5">{country.region} · {country.plans.length} plans available</p>
          </div>
          <div className="ml-auto flex items-center gap-2 text-sm text-gray-600">
            <span>Prices in:</span>
            <CurrencySelector variant="compact" />
          </div>
        </div>

        {/* Sort + filter */}
        <div className="flex flex-wrap gap-3 mb-8">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:border-gray-400"
            >
              <option value="best-value">Best value</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="data-high">Data: high to low</option>
              <option value="data-low">Data: low to high</option>
              <option value="duration-short">Duration: short first</option>
              <option value="duration-long">Duration: long first</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={durationFilter}
              onChange={(e) => setDurationFilter(e.target.value as any)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:border-gray-400"
            >
              <option value="all">All durations</option>
              <option value="short">Short (1–7 days)</option>
              <option value="medium">Medium (8–30 days)</option>
              <option value="long">Long (30+ days)</option>
            </select>
          </div>
        </div>

        {/* Plan cards */}
        {displayPlans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayPlans.map((plan, index) => {
              const isBest = (plan as any).bestValue
              const cartCount = getCartCount(index)

              return (
                <div key={plan.id} className={`bg-white border rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:shadow-md ${isBest ? 'border-blue-200 ring-1 ring-blue-100' : 'border-gray-200 hover:border-gray-300'}`}>

                  {/* Card header */}
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                    <div className="text-sm text-gray-500">{plan.network?.type || 'LTE'} · {plan.network?.coverage || 'Nationwide'}</div>
                    <div className="flex items-center gap-2">
                      {isBest && (
                        <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-2 py-0.5">Best value</span>
                      )}
                      {plan.promoApplied && (
                        <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-2 py-0.5">Sale</span>
                      )}
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="px-5 py-5 flex flex-col flex-1">

                    {/* Price */}
                    <div className="mb-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-gray-900 tracking-tight">{fmt(plan.price)}</span>
                        {plan.promoApplied && (
                          <span className="text-sm text-gray-400 line-through">{fmt(plan.promoApplied.originalPrice)}</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {getPricePerGB(plan)}/GB · {getPricePerDay(plan)}/day
                      </div>
                    </div>

                    {/* Data + Days */}
                    <div className="flex items-center gap-2 mb-5">
                      <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
                        <Wifi className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-sm font-semibold text-gray-700">{formatData(plan.dataInMB)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
                        <Clock className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-sm font-semibold text-gray-700">{plan.days} days</span>
                      </div>
                    </div>

                    {/* CTAs */}
                    <div className="mt-auto space-y-2">
                      <button
                        onClick={() => addToCart(plan, index)}
                        disabled={!plan.inStock}
                        className="w-full flex items-center justify-between bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white rounded-xl px-4 py-3 text-sm font-semibold transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <ShoppingCart className="h-4 w-4" />
                          {plan.inStock ? 'Add to cart' : 'Out of stock'}
                        </span>
                        {cartCount > 0 && (
                          <span className="bg-white/20 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                            {cartCount}
                          </span>
                        )}
                      </button>

                      {plan.inStock && (
                        <button
                          onClick={() => { addToCart(plan, index); router.push('/cart') }}
                          className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:border-gray-300 text-gray-700 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
                        >
                          <CreditCard className="h-4 w-4" />
                          Buy now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="font-semibold text-gray-900 mb-2">No plans match your filters</p>
            <p className="text-sm text-gray-500 mb-4">Try adjusting the sort or duration filter.</p>
            <button
              onClick={() => { setSortBy('best-value'); setDurationFilter('all') }}
              className="text-sm text-blue-600 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Summary stats */}
        {country.plans.length > 0 && (
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="border border-gray-200 rounded-2xl p-6 text-center">
              <div className="text-3xl font-black text-gray-900 mb-1">{country.plans.length}</div>
              <div className="text-sm font-medium text-gray-500">Plans available</div>
            </div>
            <div className="border border-gray-200 rounded-2xl p-6 text-center">
              <div className="text-3xl font-black text-gray-900 mb-1">
                {fmt(Math.min(...country.plans.map(p => p.price)))}
              </div>
              <div className="text-sm font-medium text-gray-500">Starting price</div>
            </div>
            <div className="border border-gray-200 rounded-2xl p-6 text-center">
              <div className="text-3xl font-black text-gray-900 mb-1">
                {formatData(Math.max(...country.plans.map(p => p.dataInMB)))}
              </div>
              <div className="text-sm font-medium text-gray-500">Max data available</div>
            </div>
          </div>
        )}

        {/* Info row */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon: Zap, title: "Instant activation", desc: "Your eSIM activates immediately after purchase." },
            { icon: Shield, title: "Secure & reliable", desc: "99.9% network uptime with enterprise-grade security." },
            { icon: Users, title: "24/7 support", desc: "Real support available around the clock." },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4 border border-gray-200 rounded-xl p-5">
              <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 shrink-0">
                <item.icon className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900 mb-1">{item.title}</div>
                <div className="text-sm text-gray-500">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

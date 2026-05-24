"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, ShoppingCart, Loader2, AlertTriangle, Shield, Zap, Globe } from "lucide-react"
import Link from "next/link"
import { toast } from 'sonner'
import { useCurrency } from "@/lib/contexts/currency-context"

import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { CheckoutForm } from '@/components/checkout-form'

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

let stripePromise: any
if (stripePublishableKey) {
  stripePromise = loadStripe(stripePublishableKey)
}

interface OrderItem {
  countryName: string
  countryCode?: string
  flag: string
  plan: any
  quantity: number
}

const countryNameToCode: Record<string, string> = {
  'ireland': 'ie', 'united states': 'us', 'united kingdom': 'gb',
  'china mainland': 'cn', 'south korea': 'kr', 'new zealand': 'nz',
  'saudi arabia': 'sa', 'south africa': 'za', 'uae': 'ae',
}

function getFlagUrl(countryCode?: string, countryName?: string): string | null {
  if (countryName) {
    const mapped = countryNameToCode[countryName.toLowerCase()]
    if (mapped) return `https://flagcdn.com/w40/${mapped}.png`
  }
  if (countryCode) {
    const code = countryCode.split(',')[0].trim().toLowerCase()
    return `https://flagcdn.com/w40/${code}.png`
  }
  return null
}

function CheckoutFlow() {
  const { formatPrice, convertPrice, currency } = useCurrency()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [clientSecret, setClientSecret] = useState('')

  useEffect(() => {
    const items: OrderItem[] = []
    const cartData = searchParams.get('cart') || searchParams.get('items')
    if (cartData) {
      try {
        const cartItems = JSON.parse(decodeURIComponent(cartData))
        items.push(...cartItems.map((item: any) => ({
          countryName: item.countryName,
          countryCode: item.countryCode || '',
          flag: item.flag || '',
          plan: item.planData,
          quantity: item.quantity,
        })))
      } catch { toast.error("Failed to load cart items. Please try again.") }
    } else {
      try {
        const localCart = localStorage.getItem('cart')
        if (localCart) {
          items.push(...JSON.parse(localCart).map((item: any) => ({
            countryName: item.countryName,
            countryCode: item.countryCode || '',
            flag: item.flag || '',
            plan: item.planData,
            quantity: item.quantity,
          })))
        }
      } catch { toast.error("Failed to load cart items. Please try again.") }
    }
    setOrderItems(items)
  }, [searchParams, router])

  useEffect(() => {
    if (orderItems.length > 0) {
      // Send items — server computes the amount, never trust client-supplied total
      fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: orderItems }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.clientSecret) setClientSecret(data.clientSecret)
          else toast.error("Failed to initialize payment. Please try again.")
          setIsLoading(false)
        })
        .catch(() => {
          toast.error("A server error occurred. Please refresh the page.")
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [orderItems, convertPrice])

  const handleSuccessfulPurchase = (completedOrder: any) => {
    localStorage.setItem('completedOrder', JSON.stringify(completedOrder))
    router.push('/checkout/confirmation')
  }

  const total = orderItems.reduce((acc, item) => acc + item.plan.price * item.quantity, 0)
  const formattedTotal = formatPrice(convertPrice(total, 'EUR', currency))
  const appearance: { theme: 'stripe' | 'night' | 'flat' } = { theme: 'stripe' }
  const options: StripeElementsOptions = { clientSecret, appearance }

  if (!stripePublishableKey) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center px-4">
        <div className="max-w-md w-full border border-red-200 rounded-xl p-6 bg-red-50">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span className="font-semibold text-red-700">Configuration error</span>
          </div>
          <p className="text-sm text-red-700 mb-3">Stripe publishable key is missing. Add it to <code>.env.local</code> and restart the server.</p>
          <pre className="text-xs bg-red-100 rounded p-3 overflow-x-auto">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."</pre>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Securing your payment...</p>
        </div>
      </div>
    )
  }

  if (orderItems.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <ShoppingCart className="h-10 w-10 text-gray-300 mx-auto mb-4" />
          <p className="font-semibold text-gray-900 mb-2">Your cart is empty</p>
          <p className="text-sm text-gray-500 mb-6">Add plans to your cart before checking out.</p>
          <Link href="/plans">
            <button className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
              Browse Plans
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/cart" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to cart
          </Link>
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Shield className="h-4 w-4" />
            Secure checkout
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Order Summary */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="lg:sticky lg:top-24 border border-gray-200 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
                <h2 className="text-sm font-semibold text-gray-900">Order summary</h2>
              </div>
              <div className="px-5 py-4 space-y-3">
                {orderItems.map((item, index) => {
                  const flagUrl = getFlagUrl(item.countryCode, item.countryName)
                  return (
                    <div key={index} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        {flagUrl && (
                          <img src={flagUrl} alt={item.countryName} className="w-7 h-5 rounded-sm object-cover border border-gray-100 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">{item.countryName}</div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-xs text-gray-400">{item.plan.data}</span>
                            <span className="text-gray-200">·</span>
                            <span className="text-xs text-gray-400">{item.plan.days} days</span>
                            {item.quantity > 1 && <span className="text-xs text-gray-400">× {item.quantity}</span>}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900 shrink-0">
                        {formatPrice(convertPrice(item.plan.price * item.quantity, 'EUR', currency))}
                      </span>
                    </div>
                  )
                })}
              </div>

              <Separator />

              <div className="px-5 py-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Processing fee</span><span>Free</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Delivery</span><span>Instant</span>
                </div>
                <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-100">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-gray-900">{formattedTotal}</span>
                </div>
              </div>

              <div className="px-5 pb-5 grid grid-cols-3 gap-2 border-t border-gray-100 pt-4">
                {[
                  { icon: Shield, label: "SSL secure" },
                  { icon: Zap, label: "Instant" },
                  { icon: Globe, label: "190+ countries" },
                ].map((t, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 text-center">
                    <t.icon className="h-3.5 w-3.5 text-gray-400" />
                    <span className="text-[11px] text-gray-400 leading-tight">{t.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="border border-gray-200 rounded-2xl overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900">Payment details</h2>
                <p className="text-sm text-gray-500 mt-0.5">Your payment is processed securely by Stripe.</p>
              </div>
              <div className="px-6 py-6">
                {clientSecret ? (
                  <Elements stripe={stripePromise} options={options}>
                    <CheckoutForm
                      orderItems={orderItems}
                      onSuccessfulPurchase={handleSuccessfulPurchase}
                    />
                  </Elements>
                ) : (
                  <div className="text-center py-12">
                    <Loader2 className="h-7 w-7 animate-spin text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">Connecting to payment gateway...</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    }>
      <CheckoutFlow />
    </Suspense>
  )
}

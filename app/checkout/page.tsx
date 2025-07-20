"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  flag: string
  plan: any
  quantity: number
}

function CheckoutFlow() {
  const { formatPrice, convertPrice, currency } = useCurrency()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [clientSecret, setClientSecret] = useState('')

  useEffect(() => {
    // No authentication required for guest checkout

    // Logic to parse order items from URL or cart
    const items: OrderItem[] = []
    const cartData = searchParams.get('cart') || searchParams.get('items');

    if (cartData) {
      try {
        const cartItems = JSON.parse(decodeURIComponent(cartData))
        const loadedOrderItems = cartItems.map((item: any) => {
          return {
            countryName: item.countryName,
            flag: item.flag || '🌍',
            plan: item.planData,
            quantity: item.quantity,
          }
        })
        items.push(...loadedOrderItems)
      } catch (error) { 
        console.error("Failed to parse cart items:", error)
        toast.error("Failed to load cart items. Please try again.")
      }
    } else {
      // Fallback: Try to load from localStorage if no URL params
      try {
        const localCart = localStorage.getItem('cart')
        if (localCart) {
          const cartItems = JSON.parse(localCart)
          const loadedOrderItems = cartItems.map((item: any) => {
            return {
              countryName: item.countryName,
              flag: item.flag || '🌍',
              plan: item.planData,
              quantity: item.quantity,
            }
          })
          items.push(...loadedOrderItems)
        }
      } catch (error) {
        console.error("Failed to load cart from localStorage:", error)
        toast.error("Failed to load cart items. Please try again.")
      }
    }
    setOrderItems(items)
  }, [searchParams, router])

  useEffect(() => {
    if (orderItems.length > 0) {
      const total = orderItems.reduce((acc, item) => acc + item.plan.price * item.quantity, 0)
      // Convert total to USD for Stripe payment (assuming prices are in EUR)
      const totalInUSD = convertPrice(total, 'EUR', 'USD')
      fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalInUSD }),
      })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret)
        } else {
          toast.error("Failed to initialize payment. Please try again.")
        }
        setIsLoading(false)
      })
      .catch(err => {
        console.error("Failed to create payment intent:", err);
        toast.error("A server error occurred. Please try refreshing the page.");
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
      <div className="flex justify-center items-center py-20">
        <Card className="w-full max-w-lg bg-red-50 border-red-200">
                <CardHeader>
            <CardTitle className="flex items-center text-red-700">
              <AlertTriangle className="h-6 w-6 mr-3" />
              Configuration Error
                  </CardTitle>
                </CardHeader>
          <CardContent className="text-red-900 space-y-4">
            <p className="font-semibold">Stripe is not configured correctly.</p>
            <p>The Stripe publishable key is missing. Please add it to your <code>.env.local</code> file and restart your server.</p>
            <pre className="mt-2 p-3 bg-red-100 rounded text-sm overflow-x-auto">
              NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_YOUR_KEY"
            </pre>
            <p className="text-sm">After adding the key, you must stop and restart the development server (e.g., `npm run dev`).</p>
                </CardContent>
              </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-20">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-xl">
              <Loader2 className="h-10 w-10 animate-spin text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full animate-pulse"></div>
          </div>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Securing Your Payment</h2>
          <p className="mt-2 text-lg text-gray-600">Setting up encrypted checkout...</p>
          <div className="flex items-center gap-6 mt-8">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Shield className="h-4 w-4 text-emerald-500" />
              <span>256-bit SSL Encryption</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Zap className="h-4 w-4 text-blue-500" />
              <span>Instant Activation</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (orderItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-20">
        <div className="container mx-auto max-w-4xl px-4 py-12">
          <div className="text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
              <div className="text-6xl">🛒</div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Nothing to Checkout</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">Your cart appears to be empty. Add some eSIM plans to get started with your international connectivity!</p>
            <Link href="/plans">
              <button className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
                <ShoppingCart className="h-5 w-5 mr-2 inline" />
                Browse Plans
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between mb-8">
            <Link href="/cart" className="flex items-center text-white/90 hover:text-white transition-colors group">
              <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Cart
            </Link>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
              <Shield className="h-5 w-5" />
              <span className="text-sm font-medium">Secure Checkout</span>
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Complete Your Purchase
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Secure payment powered by Stripe • Instant eSIM delivery • 24/7 support
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-2 border-white/50">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-lg">
                  <CardTitle className="flex items-center text-xl text-gray-900">
                    <ShoppingCart className="h-6 w-6 mr-3 text-emerald-600" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                    {orderItems.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                          <span className="text-2xl">{item.flag}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{item.countryName}</h3>
                          <p className="text-sm text-gray-600">{item.plan.data} • {item.plan.days} days</p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-emerald-600 font-medium">Quantity: {item.quantity}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-emerald-600">
                            {formatPrice(convertPrice(item.plan.price * item.quantity, 'EUR', currency))}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal</span>
                      <span>{formattedTotal}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Processing Fee</span>
                      <span className="text-emerald-600">Free</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-emerald-600">{formattedTotal}</span>
                    </div>
                  </div>
                  
                  {/* Security Badges */}
                  <div className="mt-6 grid grid-cols-3 gap-2 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <Shield className="h-5 w-5 text-emerald-600" />
                      <span className="text-xs text-gray-600">SSL Secure</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Zap className="h-5 w-5 text-blue-600" />
                      <span className="text-xs text-gray-600">Instant</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Globe className="h-5 w-5 text-purple-600" />
                      <span className="text-xs text-gray-600">Global</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-2 border-white/50">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                <CardTitle className="text-2xl text-gray-900">Payment Details</CardTitle>
                <p className="text-gray-600 mt-1">Complete your secure payment to get instant eSIM access</p>
              </CardHeader>
              <CardContent className="p-8">
                {clientSecret ? (
                  <Elements stripe={stripePromise} options={options}>
                    <CheckoutForm 
                      orderItems={orderItems}
                      onSuccessfulPurchase={handleSuccessfulPurchase}
                    />
                  </Elements>
                ) : (
                  <div className="text-center py-12">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Loader2 className="h-8 w-8 animate-spin text-white" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Preparing Payment</h3>
                    <p className="text-gray-600">Setting up secure payment gateway...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Trust Indicators */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-gray-900">Bank-Level Security</h3>
            <p className="text-gray-600 text-sm">Your payment is protected with 256-bit SSL encryption and fraud detection.</p>
          </div>
          
          <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-gray-900">Instant Delivery</h3>
            <p className="text-gray-600 text-sm">Receive your eSIM QR code immediately after payment completion.</p>
          </div>
          
          <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Globe className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-gray-900">Global Coverage</h3>
            <p className="text-gray-600 text-sm">Connect instantly in 190+ countries with premium network partners.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading checkout...</p>
      </div>
    }>
      <CheckoutFlow />
    </Suspense>
  )
}
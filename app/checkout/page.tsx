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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-16">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl">
                <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 animate-spin text-white" />
              </div>
              <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full animate-pulse flex items-center justify-center">
                <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              </div>
            </div>
            <h2 className="mt-6 sm:mt-8 text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent text-center px-4">Securing Your Payment</h2>
            <p className="mt-2 sm:mt-3 text-lg sm:text-xl text-gray-600 text-center px-4">Setting up bank-level encryption...</p>
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 mt-8 sm:mt-10 px-4">
              <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200 shadow-sm w-full sm:w-auto justify-center">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                <span className="text-sm font-medium text-gray-700">256-bit SSL Encryption</span>
              </div>
              <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200 shadow-sm w-full sm:w-auto justify-center">
                <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Instant Activation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (orderItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-16">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="relative inline-block mb-8 sm:mb-10">
              <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-gray-100 via-blue-50 to-purple-50 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                <div className="text-5xl sm:text-7xl">🛒</div>
              </div>
              <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl">
                <span className="text-2xl sm:text-3xl">✨</span>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4 sm:mb-6 px-4">
              Nothing to Checkout
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
              Your cart appears to be empty. Discover premium eSIM plans for seamless global connectivity!
            </p>
            <div className="flex justify-center px-4">
              <Link href="/plans" className="w-full sm:w-auto max-w-sm">
                <button className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white px-8 sm:px-12 py-4 sm:py-5 rounded-xl sm:rounded-2xl text-lg sm:text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2">
                  <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 inline" />
                  Explore eSIM Plans
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-12 sm:py-16 lg:py-20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-12 h-12 sm:w-20 sm:h-20 bg-white rounded-2xl sm:rounded-3xl transform rotate-12"></div>
          <div className="absolute top-20 right-20 w-10 h-10 sm:w-16 sm:h-16 bg-white rounded-xl sm:rounded-2xl transform -rotate-12"></div>
          <div className="absolute bottom-10 left-1/4 w-8 h-8 sm:w-12 sm:h-12 bg-white rounded-lg sm:rounded-xl transform rotate-45"></div>
          <div className="absolute bottom-20 right-1/3 w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-md sm:rounded-lg transform -rotate-45"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 max-w-7xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 sm:mb-12">
            <Link href="/cart" className="flex items-center text-white/90 hover:text-white transition-all duration-200 group bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20 w-full sm:w-auto justify-center sm:justify-start">
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Cart
            </Link>
            <div className="flex items-center gap-2 sm:gap-3 bg-white/20 backdrop-blur-sm rounded-xl px-4 sm:px-6 py-2 sm:py-3 border border-white/30 w-full sm:w-auto justify-center">
              <Shield className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="text-base sm:text-lg font-semibold">Secure Checkout</span>
            </div>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl mb-6 sm:mb-8 shadow-2xl">
              <ShoppingCart className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent px-4">
              Complete Your Purchase
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed px-4">
              Bank-level security powered by Stripe • Instant eSIM delivery • Premium global coverage
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="lg:sticky lg:top-24">
              <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-2 border-white/50 rounded-2xl sm:rounded-3xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 pb-4 sm:pb-6">
                  <CardTitle className="flex items-center text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-2 sm:mr-3 shadow-lg">
                      <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <div className="space-y-3 sm:space-y-5 max-h-60 sm:max-h-80 overflow-y-auto pr-2">
                    {orderItems.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl sm:rounded-2xl border border-white/50 shadow-sm">
                        <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md flex-shrink-0">
                          <span className="text-lg sm:text-2xl">{item.flag}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg truncate">{item.countryName}</h3>
                          <div className="flex flex-wrap gap-1 sm:gap-2 mt-1">
                            <span className="px-2 py-0.5 sm:px-2 sm:py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
                              {item.plan.data}
                            </span>
                            <span className="px-2 py-0.5 sm:px-2 sm:py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium">
                              {item.plan.days} days
                            </span>
                          </div>
                          {item.quantity > 1 && (
                            <p className="text-xs sm:text-sm text-emerald-600 font-bold mt-1">Qty: {item.quantity}</p>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-sm sm:text-lg lg:text-xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            {formatPrice(convertPrice(item.plan.price * item.quantity, 'EUR', currency))}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Separator className="my-6 sm:my-8" />
                  
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex justify-between text-sm sm:text-base lg:text-lg">
                      <span className="text-gray-600 font-medium">Subtotal</span>
                      <span className="font-bold">{formattedTotal}</span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base lg:text-lg">
                      <span className="text-gray-600 font-medium">Processing Fee</span>
                      <span className="text-emerald-600 font-bold">Free</span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base lg:text-lg">
                      <span className="text-gray-600 font-medium">Delivery</span>
                      <span className="text-emerald-600 font-bold">Instant</span>
                    </div>
                    <Separator />
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                      <div className="flex justify-between items-center">
                        <span className="text-lg sm:text-xl font-bold text-gray-900">Total</span>
                        <span className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{formattedTotal}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Security Badges */}
                  <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-2 sm:gap-4 text-center">
                    <div className="flex flex-col items-center gap-1 sm:gap-2 p-2 sm:p-3 bg-white rounded-lg sm:rounded-xl shadow-sm">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600" />
                      </div>
                      <span className="text-xs font-medium text-gray-700">Bank-Level Security</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 sm:gap-2 p-2 sm:p-3 bg-white rounded-lg sm:rounded-xl shadow-sm">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                      </div>
                      <span className="text-xs font-medium text-gray-700">Instant Delivery</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 sm:gap-2 p-2 sm:p-3 bg-white rounded-lg sm:rounded-xl shadow-sm">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Globe className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
                      </div>
                      <span className="text-xs font-medium text-gray-700">Global Coverage</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-2 border-white/50 rounded-2xl sm:rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 pb-6 sm:pb-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Payment Details</CardTitle>
                    <p className="text-sm sm:text-base lg:text-lg text-gray-600 mt-1">Complete your secure payment for instant eSIM access</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 lg:p-10">
                {clientSecret ? (
                  <Elements stripe={stripePromise} options={options}>
                    <CheckoutForm 
                      orderItems={orderItems}
                      onSuccessfulPurchase={handleSuccessfulPurchase}
                    />
                  </Elements>
                ) : (
                  <div className="text-center py-12 sm:py-16">
                    <div className="relative inline-block">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-2xl">
                        <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 animate-spin text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 bg-emerald-500 rounded-full animate-pulse"></div>
                    </div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Preparing Payment Gateway</h3>
                    <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">Establishing secure connection with Stripe...</p>
                    <div className="flex justify-center gap-2 mt-4 sm:mt-6">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Trust Indicators */}
        <div className="mt-12 sm:mt-16 lg:mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          <div className="text-center bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-300 group">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
              <Shield className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Bank-Level Security</h3>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed">Your payment is protected with 256-bit SSL encryption, fraud detection, and PCI compliance standards.</p>
          </div>
          
          <div className="text-center bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-300 group">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
              <Zap className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Instant Delivery</h3>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed">Receive your eSIM QR code and activation instructions immediately after successful payment completion.</p>
          </div>
          
          <div className="text-center bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-300 group">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
              <Globe className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Global Coverage</h3>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed">Connect instantly in 190+ countries with our premium network partners and reliable data coverage.</p>
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
"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, ShoppingCart, Loader2, AlertTriangle, Globe, User, UserPlus } from "lucide-react"
import Link from "next/link"
import { toast } from 'sonner'

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
  const searchParams = useSearchParams()
  const router = useRouter()
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [clientSecret, setClientSecret] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check authentication using JWT
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        const data = await response.json()
        
        if (!data.success) {
          // User not authenticated, show authentication options
          setIsAuthenticated(false)
          loadCheckoutData() // Load items anyway for preview
          setIsLoading(false)
          return
        }
        
        // User is authenticated, continue with checkout
        setIsAuthenticated(true)
        loadCheckoutData()
      } catch (error) {
        console.error('Auth check failed:', error)
        setIsLoading(false)
      }
    }
    
    checkAuth()
  }, [router, searchParams])

  const loadCheckoutData = () => {

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
  }

  useEffect(() => {
    if (orderItems.length > 0 && isAuthenticated) {
      const total = orderItems.reduce((acc, item) => acc + item.plan.price * item.quantity, 0)
      fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total }),
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
  }, [orderItems, isAuthenticated])

  const handleSuccessfulPurchase = (completedOrder: any) => {
    localStorage.setItem('completedOrder', JSON.stringify(completedOrder))
    router.push('/checkout/confirmation')
  }

  const total = orderItems.reduce((acc, item) => acc + item.plan.price * item.quantity, 0)
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
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Initializing secure payment...</p>
                    </div>
    )
  }

  if (orderItems.length === 0) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="text-center">
          <div className="text-6xl mb-6">🌍</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Ready to travel?</h1>
          <p className="text-gray-600 mb-6">Choose your destination and get connected instantly. No roaming fees, no hassle.</p>
          <Link href="/plans">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg">
              Find My Travel Data
            </button>
          </Link>
                    </div>
                  </div>
    )
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        {/* Order Summary - Now appears FIRST on mobile */}
        <div className="md:order-2">
           <div className="md:sticky md:top-24">
            <Card className="bg-slate-50/80 dark:bg-slate-900/50">
                <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Globe className="h-6 w-6 mr-3" />
                  Your Travel Data
                  </CardTitle>
                </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                  {orderItems.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <span className="text-3xl">{item.flag}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.countryName}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.plan.data}, {item.plan.days} days</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${(item.plan.price * item.quantity).toFixed(2)}</p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                        )}
                      </div>
                      </div>
                    ))}
                </div>
                <Separator className="my-6" />
                <div className="space-y-2">
                  <div className="flex justify-between font-semibold">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                   <div className="flex justify-between text-sm text-gray-500">
                    <span>Taxes & Fees</span>
                    <span>Calculated at payment</span>
                  </div>
                </div>
                 <Separator className="my-6" />
                 <div className="flex justify-between font-bold text-2xl">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
             <div className="text-center mt-4">
              <Link href="/cart" className="text-sm text-primary hover:underline flex items-center justify-center">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Cart
              </Link>
            </div>
          </div>
        </div>

        {/* Payment Details - Now appears SECOND on mobile */}
        <div className="md:order-1">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Complete Your Purchase</h1>
            <p className="text-gray-600">🎉 You're one step away from staying connected while traveling!</p>
          </div>
          
          {!isAuthenticated ? (
            <Card className="bg-blue-50/50 border-blue-200">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center text-blue-700">
                  <User className="h-6 w-6 mr-2" />
                  Sign In Required
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-gray-700">
                  Please sign in or create an account to complete your purchase.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild className="bg-blue-600 hover:bg-blue-700">
                    <Link href="/login">
                      <User className="h-4 w-4 mr-2" />
                      Sign In
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                    <Link href="/signup">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Create Account
                    </Link>
                  </Button>
                </div>
                <p className="text-sm text-gray-600">
                  Your cart will be saved and you'll be redirected back here after signing in.
                </p>
              </CardContent>
            </Card>
          ) : (
            clientSecret && (
              <Elements options={options} stripe={stripePromise}>
                <CheckoutForm orderItems={orderItems} onSuccessfulPurchase={handleSuccessfulPurchase} />
              </Elements>
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 pt-20">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      }>
        <CheckoutFlow />
      </Suspense>
    </div>
  )
}
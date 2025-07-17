"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, ShoppingCart, Loader2, AlertTriangle } from "lucide-react"
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
  }, [orderItems])

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
          <div className="text-6xl mb-6">🛒</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">No items to checkout</h1>
          <p className="text-gray-600 mb-6">Your cart appears to be empty. Please add some items before checking out.</p>
          <Link href="/plans">
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg">
              Browse Plans
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
                  <ShoppingCart className="h-6 w-6 mr-3" />
                  Order Summary
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
                <Separator className="my-4" />
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Checkout Form */}
        <div className="md:order-1">
          <div className="flex items-center mb-6">
            <Link href="/cart" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Link>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Checkout</CardTitle>
            </CardHeader>
            <CardContent>
              {clientSecret ? (
                <Elements stripe={stripePromise} options={options}>
                  <CheckoutForm 
                    orderItems={orderItems}
                    onSuccessfulPurchase={handleSuccessfulPurchase}
                  />
                </Elements>
              ) : (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p>Setting up payment...</p>
                </div>
              )}
            </CardContent>
          </Card>
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
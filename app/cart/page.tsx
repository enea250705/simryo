"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { CartErrorBoundary } from "@/components/cart-error-boundary"
import { useCurrency } from "@/lib/contexts/currency-context"

interface CartItem {
  countryId: number
  countryName: string
  flag: string
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

function CartContent() {
  const { formatPrice, convertPrice, currency } = useCurrency()
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)

  // Load cart data on mount
  useEffect(() => {
    const initializeCart = async () => {
      try {
        setIsClient(true)
        
        // Small delay to ensure DOM is ready
        await new Promise(resolve => setTimeout(resolve, 100))
        
        const savedCart = localStorage.getItem('cart')
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart)
          setCartItems(Array.isArray(parsedCart) ? parsedCart : [])
        }
      } catch (error) {
        console.error('Failed to load cart:', error)
        setCartItems([])
        try {
          localStorage.removeItem('cart')
        } catch (e) {
          console.error('Failed to clear cart:', e)
        }
      } finally {
        setIsLoading(false)
      }
    }
    
    initializeCart()
  }, [])

  // Save cart to localStorage when it changes
  useEffect(() => {
    if (isClient && !isLoading) {
      try {
        localStorage.setItem('cart', JSON.stringify(cartItems))
        window.dispatchEvent(new Event('cart-updated'))
      } catch (error) {
        console.error('Failed to save cart:', error)
        toast.error('Failed to save cart changes')
      }
    }
  }, [cartItems, isLoading, isClient])

  const updateQuantity = (planIndex: number, countryId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(planIndex, countryId)
      return
    }
    
    setCartItems(prev => prev.map(item => 
      item.planIndex === planIndex && item.countryId === countryId 
        ? { ...item, quantity: newQuantity }
        : item
    ))
  }

  const removeItem = (planIndex: number, countryId: number) => {
    setCartItems(prev => prev.filter(item => 
      !(item.planIndex === planIndex && item.countryId === countryId)
    ))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const getTotalValue = () => {
    return cartItems.reduce((total, item) => {
      if (!item.planData || typeof item.planData.price !== 'number') {
        return total
      }
      return total + (item.planData.price * item.quantity)
    }, 0)
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => {
      if (typeof item.quantity === 'number' && item.quantity > 0) {
        return total + item.quantity
      }
      return total
    }, 0)
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty')
      return
    }
    
    // Validate cart items before checkout
    const validItems = cartItems.filter(item => 
      item.planData && 
      typeof item.planData.price === 'number' && 
      item.quantity > 0
    )
    
    if (validItems.length === 0) {
      toast.error('No valid items in cart')
      return
    }
    
    // Guest checkout - proceed directly to checkout with cart data
    const cartDataParam = encodeURIComponent(JSON.stringify(validItems))
    router.push(`/checkout?cart=${cartDataParam}`)
  }

  // Show loading state - keep hooks order consistent
  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 pt-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-2xl font-semibold text-gray-600">Loading cart...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 pt-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/plans" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Continue Shopping
          </Link>
          
          {cartItems.length > 0 && (
            <Button 
              onClick={clearCart}
              variant="outline"
              className="text-red-600 hover:text-red-700 hover:border-red-300"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Cart
            </Button>
          )}
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Your Cart</h1>
          <p className="text-lg text-gray-600">
            {cartItems.length === 0 
              ? "Your cart is empty" 
              : `${getTotalItems()} item${getTotalItems() > 1 ? 's' : ''} in your cart`
            }
          </p>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart */
          <Card className="text-center p-12">
            <CardContent>
              <div className="text-6xl mb-6">🛒</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Add some eSIM plans to get started with your international connectivity!</p>
              <Link href="/plans">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Browse Plans
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          /* Cart Items */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="text-4xl">
                            {item.flag}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{item.countryName}</h3>
                            <p className="text-sm text-gray-600">{item.planData.data} • {item.planData.days} days</p>
                          </div>
                        </div>
                        <div className="text-lg font-bold text-emerald-600">
                          {formatPrice(convertPrice(item.planData.price, 'EUR', currency))} each
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.planIndex, item.countryId, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.planIndex, item.countryId, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeItem(item.planIndex, item.countryId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">{formatPrice(convertPrice(getTotalValue(), 'EUR', currency))}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-emerald-600">{formatPrice(convertPrice(getTotalValue(), 'EUR', currency))}</span>
                  </div>

                  <Button 
                    className="w-full bg-emerald-600 hover:bg-emerald-700 mt-4"
                    onClick={handleCheckout}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Proceed to Checkout
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CartPage() {
  return (
    <CartErrorBoundary>
      <CartContent />
    </CartErrorBoundary>
  )
}
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-xl animate-pulse">
                <ShoppingCart className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full animate-bounce"></div>
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-900">Loading your cart...</h2>
            <p className="mt-2 text-lg text-gray-600">Preparing your eSIM selection</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Header */}
        <div className="text-center mb-12">
          <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl shadow-xl mb-6">
            <ShoppingCart className="h-10 w-10 text-white" />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">{getTotalItems()}</span>
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4">
            Your Shopping Cart
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {cartItems.length === 0 
              ? "Ready to explore the world? Your eSIM journey starts here." 
              : `${getTotalItems()} premium eSIM plan${getTotalItems() > 1 ? 's' : ''} ready for checkout`
            }
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/plans" className="group inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 text-gray-700 hover:text-blue-600 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md">
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Continue Shopping
          </Link>
          
          {cartItems.length > 0 && (
            <Button 
              onClick={clearCart}
              variant="outline"
              className="bg-white/80 backdrop-blur-sm border-red-200 text-red-600 hover:text-red-700 hover:border-red-300 hover:bg-red-50 transition-all duration-200"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Cart
            </Button>
          )}
        </div>


        {cartItems.length === 0 ? (
          <div className="flex justify-center px-4">
            <div className="relative w-full max-w-2xl">
              <Card className="bg-white/90 backdrop-blur-sm border-2 border-white/50 shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden">
                <CardContent className="text-center p-8 sm:p-12 lg:p-16">
                  <div className="relative inline-block mb-6 sm:mb-8">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-inner">
                      <div className="text-4xl sm:text-6xl">🛒</div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-lg sm:text-2xl">✨</span>
                    </div>
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3 sm:mb-4">
                    Your cart is waiting for adventure
                  </h2>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto px-2">
                    Discover premium eSIM plans for seamless global connectivity. No more roaming fees, no more worries.
                  </p>
                  <div className="flex justify-center">
                    <Link href="/plans" className="w-full sm:w-auto">
                      <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-base sm:text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                        <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                        Explore eSIM Plans
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
              
              {/* Floating Elements */}
              <div className="absolute -top-6 -left-6 w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl opacity-20 transform rotate-12 hidden sm:block"></div>
              <div className="absolute -bottom-4 -right-4 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl opacity-20 transform -rotate-12 hidden sm:block"></div>
            </div>
          </div>
        ) : (
          <div className="px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {cartItems.map((item, index) => (
                <Card key={index} className="bg-white/90 backdrop-blur-sm border-2 border-white/50 shadow-xl rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                  <CardContent className="p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 w-full sm:w-auto">
                        <div className="relative flex-shrink-0">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-xl sm:text-3xl">{item.flag}</span>
                          </div>
                          <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-white">{item.quantity}</span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 truncate">{item.countryName}</h3>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="px-2 py-1 sm:px-3 sm:py-1 bg-blue-100 text-blue-700 rounded-lg text-xs sm:text-sm font-medium">
                              {item.planData.data}
                            </span>
                            <span className="px-2 py-1 sm:px-3 sm:py-1 bg-purple-100 text-purple-700 rounded-lg text-xs sm:text-sm font-medium">
                              {item.planData.days} days
                            </span>
                          </div>
                          <div className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            {formatPrice(convertPrice(item.planData.price, 'EUR', currency))} each
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between w-full sm:w-auto sm:flex-col gap-3 sm:gap-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 sm:gap-3 bg-gray-50 rounded-xl p-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl hover:bg-white transition-colors"
                            onClick={() => updateQuantity(item.planIndex, item.countryId, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <span className="w-6 sm:w-8 text-center font-bold text-sm sm:text-lg">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl hover:bg-white transition-colors"
                            onClick={() => updateQuantity(item.planIndex, item.countryId, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl h-8 w-8 sm:h-10 sm:w-10 transition-all duration-200"
                          onClick={() => removeItem(item.planIndex, item.countryId)}
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Item Total */}
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm sm:text-base text-gray-600">Item Total:</span>
                        <span className="text-lg sm:text-xl font-bold text-gray-900">
                          {formatPrice(convertPrice(item.planData.price * item.quantity, 'EUR', currency))}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                <Card className="bg-white/90 backdrop-blur-sm border-2 border-white/50 shadow-2xl rounded-3xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-emerald-50 via-blue-50 to-purple-50 pb-6">
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mr-3">
                        <ShoppingCart className="h-4 w-4 text-white" />
                      </div>
                      Order Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between text-lg">
                        <span className="text-gray-600">Items ({getTotalItems()})</span>
                        <span className="font-semibold">{formatPrice(convertPrice(getTotalValue(), 'EUR', currency))}</span>
                      </div>
                      <div className="flex justify-between text-lg">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-semibold text-emerald-600">Free</span>
                      </div>
                      <div className="flex justify-between text-lg">
                        <span className="text-gray-600">Processing Fee</span>
                        <span className="font-semibold text-emerald-600">Free</span>
                      </div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-gray-900">Total</span>
                        <span className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                          {formatPrice(convertPrice(getTotalValue(), 'EUR', currency))}
                        </span>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white py-4 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 mt-6"
                      onClick={handleCheckout}
                    >
                      <ShoppingCart className="h-5 w-5 mr-3" />
                      Secure Checkout
                    </Button>
                    
                    {/* Trust Indicators */}
                    <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200">
                      <div className="text-center">
                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <span className="text-emerald-600 text-lg">🔒</span>
                        </div>
                        <p className="text-xs text-gray-600">SSL Secure</p>
                      </div>
                      <div className="text-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <span className="text-blue-600 text-lg">⚡</span>
                        </div>
                        <p className="text-xs text-gray-600">Instant Delivery</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
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
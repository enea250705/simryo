"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, ShoppingCart, Trash2, Plus, Minus, Loader2, Shield, Zap } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { CartErrorBoundary } from "@/components/cart-error-boundary"
import { useCurrency } from "@/lib/contexts/currency-context"

const countryNameToCode: Record<string, string> = {
  'ireland': 'ie', 'united states': 'us', 'united kingdom': 'gb',
  'china mainland': 'cn', 'south korea': 'kr', 'new zealand': 'nz',
  'saudi arabia': 'sa', 'south africa': 'za', 'uae': 'ae',
  'united arab emirates': 'ae',
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

interface CartItem {
  countryId: number
  countryName: string
  countryCode?: string
  flag: string
  planIndex: number
  quantity: number
  planData: {
    data: string
    days: number
    price: number
    provider: { name: string; apiKey: string }
  }
}

function CartContent() {
  const { formatPrice, convertPrice, currency } = useCurrency()
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    const init = async () => {
      try {
        setIsClient(true)
        await new Promise(resolve => setTimeout(resolve, 100))
        const saved = localStorage.getItem('cart')
        if (saved) {
          const parsed = JSON.parse(saved)
          setCartItems(Array.isArray(parsed) ? parsed : [])
        }
      } catch {
        setCartItems([])
        try { localStorage.removeItem('cart') } catch {}
      } finally {
        setIsLoading(false)
      }
    }
    init()
  }, [])

  useEffect(() => {
    if (isClient && !isLoading) {
      try {
        localStorage.setItem('cart', JSON.stringify(cartItems))
        window.dispatchEvent(new Event('cart-updated'))
      } catch {
        toast.error('Failed to save cart changes')
      }
    }
  }, [cartItems, isLoading, isClient])

  const updateQuantity = (planIndex: number, countryId: number, qty: number) => {
    if (qty < 1) { removeItem(planIndex, countryId); return }
    setCartItems(prev => prev.map(i =>
      i.planIndex === planIndex && i.countryId === countryId ? { ...i, quantity: qty } : i
    ))
  }

  const removeItem = (planIndex: number, countryId: number) => {
    setCartItems(prev => prev.filter(i => !(i.planIndex === planIndex && i.countryId === countryId)))
  }

  const fmt = (price: number) => formatPrice(convertPrice(price, 'EUR', currency))
  const totalItems = cartItems.reduce((t, i) => t + (i.quantity || 0), 0)
  const totalValue = cartItems.reduce((t, i) => t + (i.planData?.price || 0) * i.quantity, 0)

  const handleCheckout = () => {
    const valid = cartItems.filter(i => i.planData && typeof i.planData.price === 'number' && i.quantity > 0)
    if (!valid.length) { toast.error('Your cart is empty'); return }
    router.push(`/checkout?cart=${encodeURIComponent(JSON.stringify(valid))}`)
  }

  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your cart</h1>
            {cartItems.length > 0 && (
              <p className="text-sm text-gray-400 mt-0.5">{totalItems} item{totalItems > 1 ? 's' : ''}</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Link href="/plans">
              <button className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Continue shopping
              </button>
            </Link>
            {cartItems.length > 0 && (
              <button
                onClick={() => setCartItems([])}
                className="text-sm text-red-500 hover:text-red-700 transition-colors ml-auto sm:ml-0"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-24 border border-gray-200 rounded-2xl">
            <ShoppingCart className="h-10 w-10 text-gray-300 mx-auto mb-4" />
            <p className="font-semibold text-gray-900 mb-2">Your cart is empty</p>
            <p className="text-sm text-gray-500 mb-6">Browse plans and add one to get started.</p>
            <Link href="/plans">
              <button className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                Browse plans
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Items */}
            <div className="lg:col-span-2 space-y-3 order-2 lg:order-1">
              {cartItems.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2.5 mb-3">
                        {(() => {
                          const url = getFlagUrl(item.countryCode, item.countryName)
                          return url ? (
                            <img src={url} alt={item.countryName} className="w-7 h-5 rounded-sm object-cover border border-gray-100 shrink-0" />
                          ) : null
                        })()}
                        <span className="font-semibold text-gray-900">{item.countryName}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-medium bg-gray-100 text-gray-600 rounded-lg px-2.5 py-1">{item.planData.data}</span>
                        <span className="text-xs font-medium bg-gray-100 text-gray-600 rounded-lg px-2.5 py-1">{item.planData.days} days</span>
                      </div>
                      <div className="text-lg font-bold text-gray-900">{fmt(item.planData.price)} each</div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      {/* Quantity */}
                      <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-1 py-1">
                        <button
                          onClick={() => updateQuantity(item.planIndex, item.countryId, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
                        >
                          <Minus className="h-3 w-3 text-gray-600" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold text-gray-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.planIndex, item.countryId, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
                        >
                          <Plus className="h-3 w-3 text-gray-600" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.planIndex, item.countryId)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-sm text-gray-400">Subtotal</span>
                    <span className="text-sm font-semibold text-gray-900">{fmt(item.planData.price * item.quantity)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1 order-1 lg:order-2">
              <div className="lg:sticky lg:top-24 border border-gray-200 rounded-2xl overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-900">Order summary</h2>
                </div>
                <div className="px-6 py-5 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Items ({totalItems})</span>
                    <span className="font-medium text-gray-900">{fmt(totalValue)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Delivery</span>
                    <span className="font-medium text-gray-900">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Processing fee</span>
                    <span className="font-medium text-gray-900">Free</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-gray-900">{fmt(totalValue)}</span>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-xl py-3.5 text-sm font-semibold transition-colors mt-2"
                  >
                    Checkout
                  </button>

                  <div className="flex items-center justify-center gap-4 pt-3 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <Shield className="h-3.5 w-3.5" />
                      <span>Secure payment</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="h-3.5 w-3.5" />
                      <span>Instant delivery</span>
                    </div>
                  </div>
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

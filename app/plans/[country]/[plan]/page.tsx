"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  Wifi, 
  Clock, 
  Shield, 
  CheckCircle, 
  Star, 
  Globe, 
  Smartphone,
  CreditCard,
  Loader2,
  AlertCircle,
  Users,
  Zap,
  ShoppingCart
} from "lucide-react"
import Link from "next/link"
import { toast } from 'sonner'

interface PlanDetails {
  id: string
  country: string
  countryCode: string
  flag: string
  region: string
  data: string
  dataInMB: number
  days: number
  price: number
  currency: string
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
  featured?: boolean
}

interface CustomerInfo {
  name: string
  email: string
  phone?: string
}

interface DeviceInfo {
  deviceType: string
  os: string
  model?: string
}

export default function PlanDetailPage() {
  const params = useParams()
  const router = useRouter()
  const countrySlug = params.country as string
  const planSlug = params.plan as string
  
  const [plan, setPlan] = useState<PlanDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: ''
  })
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    deviceType: 'smartphone',
    os: 'ios'
  })
  const [addingToCart, setAddingToCart] = useState(false)

  // Convert slug back to country name
  const countryName = countrySlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  useEffect(() => {
    loadPlanDetails()
  }, [countrySlug, planSlug])

  const loadPlanDetails = async () => {
    try {
      setLoading(true)
      setError(null)

      // First get plans for the country
      const response = await fetch(`/api/plans/${countrySlug.toUpperCase()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch plan details')
      }

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to load plan')
      }

      // Find the specific plan by slug
      const foundPlan = data.data.find((p: PlanDetails) => {
        const planId = `${p.data.toLowerCase()}-${p.days}d-${p.providerId}`
        return planId === planSlug || p.id === planSlug
      })

      if (!foundPlan) {
        throw new Error('Plan not found')
      }

      setPlan(foundPlan)
    } catch (error) {
      console.error('Error loading plan details:', error)
      setError(error instanceof Error ? error.message : 'Failed to load plan')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!plan) return

    try {
      setAddingToCart(true)

      // Create cart item
      const cartItem = {
        countryId: Math.random(), // Use plan ID as unique identifier
        countryName: plan.country,
        flag: plan.flag,
        planIndex: 0,
        quantity: 1,
        planData: {
          data: plan.data,
          days: plan.days,
          price: plan.price,
          provider: {
            name: plan.providerDisplayName,
            apiKey: plan.providerId
          }
        }
      }

      // Get existing cart
      const existingCart = localStorage.getItem('cart')
      let cart = []
      
      if (existingCart) {
        try {
          cart = JSON.parse(existingCart)
        } catch (e) {
          console.error('Failed to parse cart:', e)
          cart = []
        }
      }

      // Check if item already exists
      const existingItemIndex = cart.findIndex((item: any) => 
        item.countryName === cartItem.countryName && 
        item.planData.data === cartItem.planData.data &&
        item.planData.days === cartItem.planData.days
      )

      if (existingItemIndex >= 0) {
        // Update quantity
        cart[existingItemIndex].quantity += 1
        toast.success('Updated quantity in cart')
      } else {
        // Add new item
        cart.push(cartItem)
        toast.success('Added to cart successfully!')
      }

      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(cart))
      
      // Dispatch event to update cart counter
      window.dispatchEvent(new Event('cart-updated'))
      
      // Redirect to cart page
      setTimeout(() => {
        router.push('/cart')
      }, 1000)

    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Failed to add to cart')
    } finally {
      setAddingToCart(false)
    }
  }

  const handlePurchase = async () => {
    if (!plan) return

    // Validate customer info
    if (!customerInfo.name.trim() || !customerInfo.email.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    if (!customerInfo.email.includes('@')) {
      toast.error('Please enter a valid email address')
      return
    }

    try {
      setPurchasing(true)

      // Create purchase request
      const purchaseData = {
        planId: plan.id,
        providerId: plan.providerId,
        customerInfo: {
          name: customerInfo.name.trim(),
          email: customerInfo.email.trim(),
          phone: customerInfo.phone?.trim()
        },
        deviceInfo
      }

      const response = await fetch('/api/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([{
          planId: plan.id,
          plan: {
            provider: {
              name: plan.providerDisplayName
            },
            data: plan.data,
            days: plan.days,
            price: plan.price
          },
          customerInfo: purchaseData.customerInfo,
          deviceInfo: purchaseData.deviceInfo
        }])
      })

      const result = await response.json()

      if (result.success && result.data.length > 0) {
        const purchaseResult = result.data[0]
        
        if (purchaseResult.success) {
          toast.success('Purchase successful! Redirecting to confirmation...')
          
          // Redirect to confirmation page with purchase details
          const confirmationData = {
            orderId: purchaseResult.orderId,
            qrCodeUrl: purchaseResult.qrCodeUrl,
            activationCode: purchaseResult.activationCode,
            instructions: purchaseResult.instructions,
            plan: plan,
            customerInfo: purchaseData.customerInfo
          }
          
          // Store in sessionStorage for confirmation page
          sessionStorage.setItem('purchaseConfirmation', JSON.stringify(confirmationData))
          
          router.push('/checkout/confirmation')
        } else {
          throw new Error(purchaseResult.error || 'Purchase failed')
        }
      } else {
        throw new Error(result.error || 'Purchase failed')
      }
    } catch (error) {
      console.error('Purchase error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Purchase failed'
      toast.error(errorMessage)
    } finally {
      setPurchasing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 pt-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-emerald-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Plan Details</h2>
            <p className="text-gray-600">Please wait...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !plan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 pt-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/plans" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Plans
          </Link>
          <div className="text-center bg-white rounded-2xl shadow-lg p-12">
            <AlertCircle className="h-16 w-16 mx-auto text-red-500 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Plan Not Found</h1>
            <p className="text-gray-600 text-lg mb-6">{error || 'The requested plan could not be found.'}</p>
            <Link href="/plans">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                Browse All Plans
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 pt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <Link href={`/plans/${countrySlug}`} className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to {countryName} Plans
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Plan Details */}
          <Card className="bg-white shadow-xl">
            <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-6xl">{plan.flag}</span>
                  <div>
                    <CardTitle className="text-2xl">{plan.country}</CardTitle>
                    <p className="text-emerald-100">{plan.region}</p>
                  </div>
                </div>
                {plan.featured && (
                  <Badge className="bg-yellow-400 text-yellow-900 border-yellow-300">
                    ⭐ Featured
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {/* Plan Overview */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900">{plan.data}</h3>
                    <p className="text-gray-600">Data Allowance</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-emerald-600">${plan.price}</p>
                    <p className="text-gray-600">{plan.currency}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 text-gray-600">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    <span>{plan.days} days</span>
                  </div>
                  <div className="flex items-center">
                    <Wifi className="h-5 w-5 mr-2" />
                    <span>{plan.network.type}</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 mr-2" />
                    <span>Popularity: {plan.popularity}</span>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Provider Info */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">Provider</h4>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">{plan.providerDisplayName}</span>
                  <Badge variant={plan.inStock ? "default" : "destructive"}>
                    {plan.inStock ? "In Stock" : "Out of Stock"}
                  </Badge>
                </div>
              </div>

              {/* Network Details */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Network Details</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Network Type:</span>
                    <span className="font-medium">{plan.network.type}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Coverage:</span>
                    <span className="font-medium">{plan.network.coverage}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Carriers:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {plan.network.carriers.map((carrier, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {carrier}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Features</h4>
                <div className="grid grid-cols-1 gap-2">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-emerald-600 mr-2" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Purchase Form */}
          <Card className="bg-white shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                {plan.featured ? (
                  <>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Quick Purchase
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 mr-2" />
                    Complete Your Purchase
                  </>
                )}
              </CardTitle>
              {plan.featured && (
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">
                    Featured Plan
                  </Badge>
                  <p className="text-sm text-gray-600">Skip the form - add to cart and checkout!</p>
                </div>
              )}
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Order Summary */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Plan:</span>
                      <span className="font-medium">{plan.data} • {plan.days} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Provider:</span>
                      <span className="font-medium">{plan.providerDisplayName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Country:</span>
                      <span className="font-medium">{plan.country}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-emerald-600">${plan.price} {plan.currency}</span>
                    </div>
                  </div>
                </div>

                {plan.featured ? (
                  /* Featured Plan - Simple Add to Cart */
                  <div className="space-y-4">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                      <h4 className="font-semibold text-emerald-800 mb-2">✨ Featured Plan Benefits</h4>
                      <ul className="text-sm text-emerald-700 space-y-1">
                        <li>• Instant activation</li>
                        <li>• No complicated forms</li>
                        <li>• Add to cart and checkout quickly</li>
                        <li>• 24/7 customer support</li>
                      </ul>
                    </div>
                    
                    <Button 
                      onClick={handleAddToCart}
                      disabled={addingToCart || !plan.inStock}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-lg"
                    >
                      {addingToCart ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Adding to Cart...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-5 w-5 mr-2" />
                          Add to Cart - ${plan.price}
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  /* Regular Plan - Full Form */
                  <div className="space-y-6">
                    {/* Customer Information */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Customer Information</h4>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            value={customerInfo.name}
                            onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                            placeholder="Enter your full name"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={customerInfo.email}
                            onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                            placeholder="Enter your email address"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number (Optional)</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={customerInfo.phone || ''}
                            onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                            placeholder="Enter your phone number"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Device Information */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Device Information</h4>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="deviceType">Device Type</Label>
                          <select
                            id="deviceType"
                            value={deviceInfo.deviceType}
                            onChange={(e) => setDeviceInfo({...deviceInfo, deviceType: e.target.value})}
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          >
                            <option value="smartphone">Smartphone</option>
                            <option value="tablet">Tablet</option>
                            <option value="laptop">Laptop</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div>
                          <Label htmlFor="os">Operating System</Label>
                          <select
                            id="os"
                            value={deviceInfo.os}
                            onChange={(e) => setDeviceInfo({...deviceInfo, os: e.target.value})}
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          >
                            <option value="ios">iOS</option>
                            <option value="android">Android</option>
                            <option value="windows">Windows</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Purchase Button */}
                    <Button 
                      onClick={handlePurchase}
                      disabled={purchasing || !plan.inStock}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-lg"
                    >
                      {purchasing ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Processing Purchase...
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-5 w-5 mr-2" />
                          Purchase Now - ${plan.price}
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {!plan.inStock && (
                  <p className="text-center text-red-600 text-sm">
                    This plan is currently out of stock. Please try another plan.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


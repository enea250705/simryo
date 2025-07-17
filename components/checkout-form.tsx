'use client'

import { useState } from 'react'
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Lock } from 'lucide-react'
import { toast } from 'sonner'

interface CheckoutFormProps {
  orderItems: any[]
  onSuccessfulPurchase: (completedOrder: any) => void
}

export function CheckoutForm({ orderItems, onSuccessfulPurchase }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()

  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [customerInfo, setCustomerInfo] = useState({
    email: '',
    name: '',
    phone: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return
    }

    // Validate customer info
    if (!customerInfo.email || !customerInfo.name) {
      setMessage('Please fill in your email and name.')
      return
    }

    setIsProcessing(true)
    setMessage(null)

    // First, confirm the payment with Stripe
    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // We will handle the redirection manually after provisioning the eSIMs
        return_url: `https://simryo.com/checkout/confirmation`,
      },
      redirect: 'if_required', // Prevent automatic redirection
    })

    if (stripeError) {
      setMessage(stripeError.message || 'An unexpected error occurred.')
      setIsProcessing(false)
      return
    }

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      toast.success('Payment successful! Provisioning your eSIMs...')
      
      // If payment is successful, call our own backend to provision the eSIMs
      try {
        const response = await fetch('/api/purchase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderItems, customerInfo }),
        })

        if (!response.ok) {
          throw new Error('Failed to provision eSIMs.')
        }

        const completedOrder = await response.json()
        
        // Guest checkout - no user account needed

        onSuccessfulPurchase(completedOrder)

      } catch (purchaseError) {
        console.error(purchaseError)
        setMessage('Your payment was successful, but we failed to provision your eSIMs. Please contact support.')
        toast.error('eSIM provisioning failed. Please contact support.')
        setIsProcessing(false)
      }
    } else {
      setMessage('Payment did not succeed. Please try again.')
      setIsProcessing(false)
    }
  }

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      {/* Customer Information */}
      <div className="space-y-4 mb-6">
        <h3 className="text-lg font-semibold">Customer Information</h3>
        
        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={customerInfo.email}
            onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
            required
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            value={customerInfo.name}
            onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
            required
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="phone">Phone Number (optional)</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={customerInfo.phone}
            onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
            className="mt-1"
          />
        </div>
      </div>
      
      {/* Payment Information */}
      <div className="space-y-4 mb-6">
        <h3 className="text-lg font-semibold">Payment Information</h3>
        <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
      </div>
      
      <Button
        disabled={isProcessing || !stripe || !elements}
        id="submit"
        className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-bold"
        size="lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Lock className="mr-2 h-5 w-5" />
            Complete Purchase
          </>
        )}
      </Button>
      {message && <div id="payment-message" className="text-red-500 text-center mt-2">{message}</div>}
    </form>
  )
} 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
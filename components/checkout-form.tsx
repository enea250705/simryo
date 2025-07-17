'use client'

import { useState } from 'react'
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return
    }

    setIsProcessing(true)
    setMessage(null)

    // First, confirm the payment with Stripe
    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // We will handle the redirection manually after provisioning the eSIMs
        return_url: `${window.location.origin}/checkout/confirmation`,
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
          body: JSON.stringify(orderItems),
        })

        if (!response.ok) {
          throw new Error('Failed to provision eSIMs.')
        }

        const completedOrder = await response.json()
        
        // Save purchases to user account
        try {
          // Get current user from JWT auth
          const userResponse = await fetch('/api/auth/me')
          const userData = await userResponse.json()
          
          if (userData.success && userData.user) {
            const user = userData.user
            
            // Save each successful purchase to user's account
            if (completedOrder.success && completedOrder.data) {
              const successfulPurchases = completedOrder.data.filter((item: any) => item.success)
              
              for (const purchase of successfulPurchases) {
                const purchaseData = {
                  orderId: purchase.orderId,
                  country: purchase.countryName || 'Unknown',
                  flag: purchase.flag || '🌍',
                  provider: purchase.providerName || 'Maya.net',
                  planName: `${purchase.plan?.data || 'Unknown'} - ${purchase.plan?.days || 'Unknown'} days`,
                  dataAmount: purchase.plan?.data || 'Unknown',
                  dataUsed: '0GB',
                  dataRemaining: purchase.plan?.data || 'Unknown',
                  usagePercentage: 0,
                  status: 'pending',
                  activationDate: '',
                  expiryDate: new Date(Date.now() + (purchase.plan?.days || 30) * 24 * 60 * 60 * 1000).toISOString(),
                  qrCodeUrl: purchase.qrCodeUrl || '',
                  activationCode: purchase.activationCode || '',
                  price: purchase.plan?.price || 0,
                  currency: 'USD',
                  autoRenew: false,
                  isRoaming: false,
                  lastUsed: '',
                  instructions: purchase.instructions || []
                }
                
                // Save to user purchases API
                await fetch('/api/user/purchases', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    userId: user.id,
                    orderData: purchaseData
                  })
                })
              }
            }
          } else {
            console.warn('User not authenticated, skipping purchase save')
          }
        } catch (error) {
          console.error('Failed to save purchases to user account:', error)
          // Don't fail the whole process if this fails
        }

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
      <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
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
            Pay Now
          </>
        )}
      </Button>
      {message && <div id="payment-message" className="text-red-500 text-center mt-2">{message}</div>}
    </form>
  )
} 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
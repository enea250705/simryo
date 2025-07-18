import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createStripePaymentIntent } from '@/lib/services/stripe'

// Initialize Stripe with the secret key from environment variables.
// The STRIPE_SECRET_KEY is kept on the server and never exposed to the client.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
  typescript: true,
})

export async function POST(request: Request) {
  try {
    const { amount, currency = 'usd' } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    const paymentIntentResult = await createStripePaymentIntent(amount, currency);

    if (!paymentIntentResult.success) {
      return NextResponse.json({ error: paymentIntentResult.error }, { status: 500 });
    }

    return NextResponse.json({ clientSecret: paymentIntentResult.clientSecret })
    
  } catch (error) {
    console.error('Failed to create Payment Intent:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.'
    return NextResponse.json(
      { error: `Internal Server Error: ${errorMessage}` },
      { status: 500 }
    )
  }
}

 
 
 
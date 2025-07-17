import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil'
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { planId, quantity = 1 } = body

    if (!planId) {
      return NextResponse.json(
        { success: false, error: 'Plan ID is required' },
        { status: 400 }
      )
    }

    // Get the plan
      const plan = await prisma.plan.findUnique({
      where: { id: planId },
      include: { provider: true }
    })

      if (!plan) {
      return NextResponse.json(
        { success: false, error: 'Plan not found' },
        { status: 404 }
      )
    }

    if (!plan.inStock) {
      return NextResponse.json(
        { success: false, error: 'Plan is out of stock' },
        { status: 400 }
      )
    }

    // Calculate total amount
    const totalAmount = plan.price * quantity

    // Create Stripe payment intent with metadata
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Convert to cents
      currency: plan.currency.toLowerCase(),
      metadata: {
        planId: plan.id,
        userId: session.user.id,
        quantity: quantity.toString(),
        planName: plan.country,
        dataAmount: plan.dataAmount.toString(),
        days: plan.days.toString()
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    // Create order in database
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        planId: plan.id,
        providerId: plan.providerId,
        quantity,
        amount: totalAmount,
        currency: plan.currency,
        status: 'PENDING',
        paymentIntentId: paymentIntent.id
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        clientSecret: paymentIntent.client_secret,
        amount: totalAmount,
        currency: plan.currency,
        paymentIntentId: paymentIntent.id
      }
    })
  } catch (error) {
    console.error('Purchase error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create purchase' },
      { status: 500 }
    )
  }
} 
 
 
 
 
 
 
 
 
 
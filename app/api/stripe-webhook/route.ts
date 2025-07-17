import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { prisma } from '@/lib/db'
import { esimAccessAPI } from '@/lib/esim-access'
import { sendESIMEmail, sendOrderConfirmationEmail } from '@/lib/email'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil'
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      console.error('No Stripe signature found')
      return NextResponse.json(
        { error: 'No signature found' },
        { status: 400 }
      )
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    console.log('Received Stripe webhook event:', event.type)

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent)
        break
      
      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object as Stripe.PaymentIntent)
        break
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('Processing successful payment:', paymentIntent.id)
    
    const { planId, userId, quantity } = paymentIntent.metadata
    
    if (!planId || !userId) {
      console.error('Missing required metadata in payment intent')
      return
    }

    // Get the order
    const order = await prisma.order.findFirst({
      where: { 
        paymentIntentId: paymentIntent.id,
        status: 'PENDING'
      },
      include: {
        user: true,
        plan: true
      }
    })

    if (!order) {
      console.error('Order not found for payment intent:', paymentIntent.id)
      return
    }

    // Update order status to PAID
    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'PAID' }
    })

    console.log('Order marked as PAID:', order.id)

    // Send order confirmation email
    await sendOrderConfirmationEmail(
      order.user.email,
      order.user.name,
      order.id,
      order.amount,
      order.currency
    )

    // Provision eSIM via eSIM Access API
    const provisionResult = await provisionESIM(order, quantity ? parseInt(quantity) : 1)
    
    if (provisionResult.success) {
      console.log('eSIM provisioned successfully:', provisionResult.data?.iccid)
      
      // Send eSIM details email
      await sendESIMEmail({
        userEmail: order.user.email,
        userName: order.user.name,
        planName: order.plan.country,
        country: order.plan.country,
        dataAmount: `${order.plan.dataAmount}MB`,
        days: order.plan.days,
        price: order.plan.price,
        currency: order.plan.currency,
        qrCodeUrl: provisionResult.data!.qr_code_url,
        activationCode: provisionResult.data!.activation_code,
        iccid: provisionResult.data!.iccid,
        expiresAt: new Date(Date.now() + order.plan.days * 24 * 60 * 60 * 1000).toISOString()
      })
    } else {
      console.error('Failed to provision eSIM:', provisionResult.error)
    }

  } catch (error) {
    console.error('Error handling payment success:', error)
  }
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('Processing failed payment:', paymentIntent.id)
    
    // Update order status to FAILED
    await prisma.order.updateMany({
      where: { paymentIntentId: paymentIntent.id },
      data: { status: 'FAILED' }
    })

    console.log('Order marked as FAILED for payment intent:', paymentIntent.id)
  } catch (error) {
    console.error('Error handling payment failure:', error)
  }
}

async function provisionESIM(order: any, quantity: number) {
  try {
    // Use mock API for development, real API for production
    const useMockAPI = process.env.NODE_ENV === 'development' || !process.env.ESIM_ACCESS_API_KEY
    
    if (useMockAPI) {
      console.log('Using mock eSIM Access API for development')
      return await esimAccessAPI.provisionESIMMock({
        planId: order.planId,
        userId: order.userId,
        userEmail: order.user.email,
        quantity
      })
    } else {
      console.log('Using real eSIM Access API')
      return await esimAccessAPI.provisionESIM({
        planId: order.planId,
        userId: order.userId,
        userEmail: order.user.email,
        quantity
      })
    }
  } catch (error) {
    console.error('Error provisioning eSIM:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
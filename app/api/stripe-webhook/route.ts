import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/services/stripe'
import { prisma } from '@/lib/db'

const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No Stripe signature header found' }, { status: 400 })
  }

  let event: Stripe.Event

  try {    event = stripe.webhooks.constructEvent(body, signature, stripeWebhookSecret)
  } catch (error: any) {
    console.error(`Webhook signature verification failed: ${error.message}`)
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful! Payment Intent ID: ${paymentIntent.id}`)

      try {
        // Find the order in your database using the paymentIntent.id
        const order = await prisma.order.findFirst({
          where: { id: paymentIntent.id },
          include: { esims: true }
        });
        
        if (order) {
          await prisma.order.update({
            where: { id: order.id },
            data: { status: 'PAID' }
          });
        }

        if (order) {
          console.log(`Order ${order.id} marked as PAID.`)          // Update status of associated eSIMs
          for (const esim of order.esims) {
            await prisma.esim.update({
              where: { id: esim.id },
              data: { status: 'ACTIVE' }, // Set to ACTIVE or trigger real provisioning service
            });
            console.log(`eSIM ${esim.id} for order ${order.id} marked as ACTIVE.`);
          }
        } else {
          console.warn(`Order with Payment Intent ID ${paymentIntent.id} not found.`);
        }

      } catch (dbError) {
        console.error('Error updating order/eSIM status in database from webhook:', dbError)
        // You might want to log this error and consider an admin alert for manual intervention
      }
      break
    case 'payment_intent.payment_failed':
      const failedPaymentIntent = event.data.object as Stripe.PaymentIntent
      console.log(`PaymentIntent failed: ${failedPaymentIntent.id}`)
      // Handle failed payment intent
      try {
        const failedOrder = await prisma.order.findFirst({
          where: { id: failedPaymentIntent.id }
        });
        
        if (failedOrder) {
          await prisma.order.update({
            where: { id: failedOrder.id },
            data: { status: 'FAILED' }
          });
        }
        console.log(`Order with Payment Intent ID ${failedPaymentIntent.id} marked as FAILED.`);
      } catch (dbError) {
        console.error('Error updating order status to FAILED in database:', dbError);
      }
      break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object as Stripe.PaymentMethod
      console.log('PaymentMethod was attached to a Customer:', paymentMethod.id)
      // Handle payment method attached event
      break
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  // Return a 200 response to acknowledge receipt of the event
  return NextResponse.json({ received: true }, { status: 200 })
} 
 
 
 
 
 
 
 
 
 
 

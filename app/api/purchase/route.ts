import { NextRequest, NextResponse } from 'next/server'
import { EsimAccessProvider } from '@/lib/services/providers/esim-access'
import { prisma } from '@/lib/db'
import { stripe } from '@/lib/services/stripe'

const EUR_TO_USD = 1.09
const AMOUNT_TOLERANCE = 0.10 // allow 10% tolerance for rounding/FX

// Initialize eSIM Access provider
const esimAccessProvider = new EsimAccessProvider({
  name: 'esim-access',
  displayName: 'eSIM Access',
  apiKey: process.env.ESIM_ACCESS_API_KEY || '',
  baseUrl: process.env.ESIM_ACCESS_BASE_URL || 'https://api.esimaccess.com/api/v1',
  enabled: true,
  rateLimits: {
    requestsPerMinute: 30,
    requestsPerHour: 300
  },
  markup: {
    percentage: 70,
    fixedAmount: 0
  }
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderItems, customerInfo, paymentIntentId } = body
    
    if (!orderItems || !Array.isArray(orderItems)) {
      return NextResponse.json(
        { success: false, error: 'Invalid order items' },
        { status: 400 }
      )
    }

    if (!customerInfo || !customerInfo.email) {
      return NextResponse.json(
        { success: false, error: 'Customer email is required' },
        { status: 400 }
      )
    }

    // Verify payment intent: status + amount matches server-set metadata
    if (!paymentIntentId) {
      return NextResponse.json({ success: false, error: 'Missing payment reference' }, { status: 400 })
    }

    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

      if (paymentIntent.status !== 'succeeded') {
        return NextResponse.json(
          { success: false, error: 'Payment not completed' },
          { status: 402 }
        )
      }

      const chargedUsd = paymentIntent.amount / 100

      // Primary check: compare against server-set metadata (tamper-proof)
      const metaExpected = paymentIntent.metadata?.expectedAmountUsd
        ? parseFloat(paymentIntent.metadata.expectedAmountUsd)
        : null

      if (metaExpected !== null) {
        const ratio = chargedUsd / metaExpected
        if (ratio < (1 - AMOUNT_TOLERANCE) || ratio > (1 + AMOUNT_TOLERANCE)) {
          console.error(`Amount mismatch: charged $${chargedUsd}, metadata expected $${metaExpected} (ratio ${ratio.toFixed(3)})`)
          return NextResponse.json(
            { success: false, error: 'Payment amount does not match order total. Contact support.' },
            { status: 402 }
          )
        }
      } else {
        // Fallback: compare against item prices (older intents without metadata)
        const expectedEur = orderItems.reduce(
          (sum: number, item: any) => sum + (item.plan?.price ?? 0) * (item.quantity ?? 1),
          0
        )
        const expectedUsd = expectedEur * EUR_TO_USD
        const ratio = chargedUsd / expectedUsd
        if (ratio < (1 - AMOUNT_TOLERANCE) || ratio > (1 + AMOUNT_TOLERANCE)) {
          console.error(`Amount mismatch (fallback): charged $${chargedUsd}, expected $${expectedUsd.toFixed(2)} (ratio ${ratio.toFixed(3)})`)
          return NextResponse.json(
            { success: false, error: 'Payment amount does not match order total. Contact support.' },
            { status: 402 }
          )
        }
      }

      console.log(`Payment verified: $${chargedUsd} for intent ${paymentIntentId}`)
    } catch (stripeErr) {
      console.error('Stripe verification error:', stripeErr)
      return NextResponse.json(
        { success: false, error: 'Could not verify payment. Contact support.' },
        { status: 402 }
      )
    }

    // Process real eSIM provisioning
    const results = []
    
    for (let i = 0; i < orderItems.length; i++) {
      const item = orderItems[i]
      
      try {
        console.log(`Processing eSIM order ${i + 1}/${orderItems.length}:`, {
          country: item.countryName,
          plan: item.plan,
          customer: customerInfo.email
        })

        // Find the plan ID - it should be in the format "ea-PACKAGECODE"
        const planId = item.planId || `ea-${item.plan.packageCode || 'default'}`
        
        // Create purchase request
        const purchaseRequest = {
          planId: planId,
          customerEmail: customerInfo.email,
          customerName: customerInfo.name
        }

        // Call real eSIM Access API
        const purchaseResponse = await esimAccessProvider.purchasePlan(purchaseRequest)
        
        if (purchaseResponse.success) {
          // Save order to database
          try {
            const isPending = !purchaseResponse.qrCodeUrl && !purchaseResponse.activationCode
            const order = await prisma.order.create({
              data: {
                id: paymentIntentId ? `${paymentIntentId}_${i}` : `order_${Date.now()}_${i}`,
                customerEmail: customerInfo.email,
                customerName: customerInfo.name,
                customerPhone: customerInfo.phone,
                amount: item.plan.price * item.quantity,
                currency: 'EUR',
                quantity: item.quantity,
                status: isPending ? 'PENDING' : 'PAID'
              }
            })

            // Create eSIM record
            await prisma.esim.create({
              data: {
                orderId: order.id,
                iccid: purchaseResponse.activationCode || null,
                qrCodeUrl: purchaseResponse.qrCodeUrl || '',
                activationCode: purchaseResponse.activationCode || '',
                status: isPending ? 'PENDING' : 'ACTIVE',
                dataLimit: item.plan.dataInMB || 0,
                expiresAt: purchaseResponse.expiresAt
              }
            })
            
            console.log('Order saved to database:', order.id)
          } catch (dbError) {
            console.error('Failed to save order to database:', dbError)
          }

          results.push({
            success: true,
            orderId: purchaseResponse.orderId,
            countryName: item.countryName,
            flag: item.flag,
            plan: item.plan,
            quantity: item.quantity,
            providerName: 'eSIM Access',
            qrCodeUrl: purchaseResponse.qrCodeUrl,
            activationCode: purchaseResponse.activationCode,
            instructions: purchaseResponse.instructions,
            status: purchaseResponse.qrCodeUrl ? 'active' : 'pending',
            message: purchaseResponse.qrCodeUrl ? 'eSIM provisioned successfully' : 'eSIM will be delivered to your email within 15 minutes',
            expiresAt: purchaseResponse.expiresAt
          })
        } else {
          // Handle failed purchase - fail entire transaction
          console.error('eSIM provisioning failed:', purchaseResponse.error)
          
          // Log detailed error information
          console.error('Full purchase response:', JSON.stringify(purchaseResponse, null, 2))
          console.error('Request details:', { planId, customerInfo })
          
          return NextResponse.json({
            success: false,
            error: purchaseResponse.error || 'eSIM provisioning failed',
            message: `Failed to provision eSIM. Error: ${purchaseResponse.error}. Please contact support with this error code: ERR_${Date.now()}`,
            orderId: purchaseResponse.orderId || `failed_${Date.now()}_${i}`,
            details: purchaseResponse.error
          }, { status: 400 })
        }
      } catch (error) {
        console.error(`Failed to process eSIM order ${i + 1}:`, error)
        
        // Fail entire transaction on any error
        return NextResponse.json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred',
          message: 'Failed to process eSIM order. Please try again or contact support.',
          orderId: `error_${Date.now()}_${i}`
        }, { status: 500 })
      }
    }

    // Send admin notification email for manual processing
    try {
      const adminEmailResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/send-admin-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerInfo,
          orderItems,
          paymentIntentId
        })
      })
      
      if (!adminEmailResponse.ok) {
        console.error('Failed to send admin notification:', await adminEmailResponse.text())
      } else {
        console.log('Admin notification sent successfully')
      }
    } catch (emailError) {
      console.error('Admin notification error:', emailError)
    }

    // Send customer confirmation email (without eSIM details)
    try {
      const customerEmailResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/send-customer-confirmation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerInfo,
          orderItems: results,
          paymentIntentId
        })
      })
      
      if (!customerEmailResponse.ok) {
        console.error('Failed to send customer confirmation:', await customerEmailResponse.text())
      }
    } catch (emailError) {
      console.error('Customer confirmation error:', emailError)
    }

    return NextResponse.json({
      success: true,
      data: results,
      customerInfo,
      message: 'All eSIMs provisioned successfully and email sent'
    })
  } catch (error) {
    console.error('Purchase error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process purchase' },
      { status: 500 }
    )
  }
} 
 
 
 
 
 
 
 
 
 
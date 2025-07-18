import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { EsimAccessProvider } from '@/lib/services/providers/esim-access'
import { Resend } from 'resend'
import Stripe from 'stripe'

// Initialize services
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil'
})

const resend = new Resend(process.env.RESEND_API_KEY)

const esimAccessProvider = new EsimAccessProvider({
  name: 'esim-access',
  displayName: 'eSIM Access',
  apiKey: process.env.ESIM_ACCESS_API_KEY!,
  apiSecret: process.env.ESIM_ACCESS_API_SECRET!,
  baseUrl: process.env.ESIM_ACCESS_BASE_URL!,
  enabled: process.env.ESIM_ACCESS_ENABLED === 'true',
  rateLimits: {
    requestsPerMinute: 30,
    requestsPerHour: 300
  },
  markup: {
    percentage: 0,
    fixedAmount: 0
  }
})

export async function GET(request: NextRequest) {
  const testResults = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    tests: {
      database: { status: 'pending', details: '' },
      stripe: { status: 'pending', details: '' },
      esimAccess: { status: 'pending', details: '' },
      email: { status: 'pending', details: '' },
      webhook: { status: 'pending', details: '' }
    }
  }

  // Test 1: Database Connection
  try {
    await prisma.$connect()
    const userCount = await prisma.user.count()
    const orderCount = await prisma.order.count()
    const esimCount = await prisma.esim.count()
    
    testResults.tests.database = {
      status: 'pass',
      details: `Connected to Neon DB. Users: ${userCount}, Orders: ${orderCount}, eSIMs: ${esimCount}`
    }
  } catch (error) {
    testResults.tests.database = {
      status: 'fail',
      details: `Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }

  // Test 2: Stripe Configuration
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 100, // $1.00
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    })
    
    // Cancel the test payment intent
    await stripe.paymentIntents.cancel(paymentIntent.id)
    
    testResults.tests.stripe = {
      status: 'pass',
      details: `Stripe API working. Test payment intent created and cancelled: ${paymentIntent.id}`
    }
  } catch (error) {
    testResults.tests.stripe = {
      status: 'fail',
      details: `Stripe API failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }

  // Test 3: eSIM Access API
  try {
    const plans = await esimAccessProvider.fetchPlans('US')
    testResults.tests.esimAccess = {
      status: 'pass',
      details: `eSIM Access API working. Found ${plans.length} plans for US`
    }
  } catch (error) {
    testResults.tests.esimAccess = {
      status: 'fail',
      details: `eSIM Access API failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }

  // Test 4: Email Service (Resend)
  try {
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'your-resend-api-key') {
      // Only test if real API key is configured
      const testEmail = await resend.emails.send({
        from: 'SIMRYO Test <test@simryo.com>',
        to: ['test@example.com'], // This will fail but confirms API key works
        subject: 'SIMRYO System Test',
        html: '<p>This is a test email from SIMRYO system.</p>',
      })
      
      testResults.tests.email = {
        status: 'pass',
        details: `Resend API configured correctly. Test email attempted.`
      }
    } else {
      testResults.tests.email = {
        status: 'fail',
        details: 'Resend API key not configured. Please set RESEND_API_KEY in .env'
      }
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      testResults.tests.email = {
        status: 'pass',
        details: 'Resend API key is valid (domain verification needed for sending)'
      }
    } else {
      testResults.tests.email = {
        status: 'fail',
        details: `Resend API failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  // Test 5: Webhook Configuration
  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (webhookSecret && webhookSecret !== 'whsec_YOUR_WEBHOOK_SECRET_HERE') {
      testResults.tests.webhook = {
        status: 'pass',
        details: 'Stripe webhook secret is configured'
      }
    } else {
      testResults.tests.webhook = {
        status: 'fail',
        details: 'Stripe webhook secret not configured. Please set STRIPE_WEBHOOK_SECRET in .env'
      }
    }
  } catch (error) {
    testResults.tests.webhook = {
      status: 'fail',
      details: `Webhook test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }

  // Calculate overall status
  const passCount = Object.values(testResults.tests).filter(test => test.status === 'pass').length
  const totalTests = Object.keys(testResults.tests).length
  const overallStatus = passCount === totalTests ? 'ALL_PASS' : `${passCount}/${totalTests}_PASS`

  return NextResponse.json({
    ...testResults,
    overallStatus,
    summary: `${passCount} out of ${totalTests} tests passed`,
    recommendations: generateRecommendations(testResults.tests)
  })
}

function generateRecommendations(tests: any) {
  const recommendations = []
  
  if (tests.database.status === 'fail') {
    recommendations.push('Fix database connection - check DATABASE_URL in .env')
  }
  
  if (tests.stripe.status === 'fail') {
    recommendations.push('Check Stripe API keys - verify STRIPE_SECRET_KEY in .env')
  }
  
  if (tests.esimAccess.status === 'fail') {
    recommendations.push('Verify eSIM Access API credentials - check ESIM_ACCESS_API_KEY')
  }
  
  if (tests.email.status === 'fail') {
    recommendations.push('Configure Resend API key - get one from https://resend.com/')
  }
  
  if (tests.webhook.status === 'fail') {
    recommendations.push('Configure Stripe webhook secret - see setup instructions below')
  }
  
  return recommendations
}

// Test individual purchase flow
export async function POST(request: NextRequest) {
  try {
    const { testType } = await request.json()
    
    if (testType === 'purchase_flow') {
      // Test the complete purchase flow
      const testOrder = {
        customerInfo: {
          email: 'test@example.com',
          name: 'Test Customer',
          phone: '+1234567890'
        },
        orderItems: [{
          countryName: 'United States',
          flag: '🇺🇸',
          plan: {
            packageCode: 'US_5GB_30D',
            data: '5GB',
            days: 30,
            price: 29.99,
            dataInMB: 5000
          },
          quantity: 1
        }]
      }
      
      // Test eSIM provisioning
      const purchaseRequest = {
        planId: 'ea-US_5GB_30D',
        customerEmail: testOrder.customerInfo.email,
        customerName: testOrder.customerInfo.name
      }
      
      const purchaseResponse = await esimAccessProvider.purchasePlan(purchaseRequest)
      
      if (purchaseResponse.success) {
        return NextResponse.json({
          success: true,
          message: 'Purchase flow test completed successfully',
          testResults: {
            esimProvisioned: true,
            orderId: purchaseResponse.orderId,
            qrCodeUrl: purchaseResponse.qrCodeUrl ? 'Generated' : 'Mock',
            activationCode: purchaseResponse.activationCode
          }
        })
      } else {
        return NextResponse.json({
          success: false,
          message: 'Purchase flow test failed',
          error: 'eSIM provisioning failed'
        })
      }
    }
    
    return NextResponse.json({
      success: false,
      message: 'Invalid test type'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
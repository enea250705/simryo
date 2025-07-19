import { NextRequest, NextResponse } from 'next/server'
import { EsimAccessProvider } from '@/lib/services/providers/esim-access'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { planId, customerEmail = 'test@example.com', customerName = 'Test User' } = body
    
    if (!planId) {
      return NextResponse.json(
        { success: false, error: 'planId is required' },
        { status: 400 }
      )
    }

    // Initialize eSIM Access provider
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

    console.log('Testing real eSIM purchase with:', { planId, customerEmail, customerName })

    // Test the real purchase flow - no mocks, will fail if API is not configured correctly
    const purchaseRequest = {
      planId: planId,
      customerEmail: customerEmail,
      customerName: customerName
    }

    const purchaseResponse = await esimAccessProvider.purchasePlan(purchaseRequest)
    
    console.log('Purchase test result:', JSON.stringify(purchaseResponse, null, 2))

    return NextResponse.json({
      success: true,
      testRequest: purchaseRequest,
      testResponse: purchaseResponse,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Purchase test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
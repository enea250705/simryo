import { NextResponse } from 'next/server'
import { EsimAccessProvider } from '@/lib/services/providers/esim-access'

export async function GET() {
  try {
    // Test eSIM Access configuration and connection
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

    console.log('Testing eSIM Access Provider...')
    
    // Test configuration
    const configTest = {
      name: esimAccessProvider.getName(),
      displayName: esimAccessProvider.getDisplayName(),
      enabled: esimAccessProvider.isEnabled(),
      hasApiKey: !!process.env.ESIM_ACCESS_API_KEY,
      hasApiSecret: !!process.env.ESIM_ACCESS_API_SECRET,
      baseUrl: process.env.ESIM_ACCESS_BASE_URL,
      apiKeyLength: process.env.ESIM_ACCESS_API_KEY?.length || 0
    }

    console.log('Configuration test:', configTest)

    // Test API connection by fetching plans
    let plansTest
    try {
      const plans = await esimAccessProvider.fetchPlans('US')
      plansTest = {
        success: true,
        planCount: plans.length,
        samplePlan: plans[0] || null
      }
    } catch (error) {
      plansTest = {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      }
    }

    console.log('Plans fetch test:', plansTest)

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      config: configTest,
      plansTest,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        esimAccessEnabled: process.env.ESIM_ACCESS_ENABLED
      }
    })
  } catch (error) {
    console.error('eSIM test error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
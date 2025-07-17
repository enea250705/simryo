import { NextRequest, NextResponse } from 'next/server'
import { ProviderManager } from '@/lib/services/provider-manager'

export async function GET(request: NextRequest) {
  try {
    const providerManager = new ProviderManager()
    const healthStatus = providerManager.getHealthStatus()
    const enabledProviders = providerManager.getEnabledProviders()
    
    // Test a quick API call to check if providers are responding
    let apiHealth = 'unknown'
    try {
      const testPlans = await providerManager.getPopularPlans(1)
      apiHealth = testPlans.length > 0 ? 'healthy' : 'degraded'
    } catch (error) {
      apiHealth = 'unhealthy'
    }

    return NextResponse.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      data: {
        providers: {
          enabled: enabledProviders,
          count: enabledProviders.length,
          health: healthStatus
        },
        api: {
          status: apiHealth,
          version: '1.0.0'
        },
        platform: {
          name: 'SIMRYO',
          environment: process.env.NODE_ENV || 'development'
        }
      }
    })
  } catch (error) {
    console.error('Health check failed:', error)
    return NextResponse.json({
      success: false,
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: process.env.NODE_ENV === 'development' ? String(error) : 'Service temporarily unavailable'
    }, { status: 503 })
  }
} 
 
 
 
 
 
 
 
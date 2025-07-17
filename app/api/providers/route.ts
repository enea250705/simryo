// API Route: GET /api/providers - Get provider information and health status
import { NextResponse } from 'next/server'
import { providerManager } from '@/lib/services/provider-manager'

export async function GET() {
  try {
    const healthStatus = providerManager.getHealthStatus()
    const enabledProviders = providerManager.getEnabledProviders()

    const providersInfo = enabledProviders.map(providerId => {
      return providerManager.getProviderInfo(providerId)
    }).filter(Boolean)

    return NextResponse.json({
      success: true,
      data: {
        health: healthStatus,
        providers: providersInfo,
        summary: {
          totalProviders: healthStatus.totalProviders,
          enabledProviders: healthStatus.enabledProviders,
          healthPercentage: healthStatus.healthPercentage,
          initialized: healthStatus.initialized
        }
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Error getting provider information:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get provider info',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
} 
 
 
 
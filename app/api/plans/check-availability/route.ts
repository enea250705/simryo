// API Route: POST /api/plans/check-availability - Check plan availability
import { NextResponse } from 'next/server'
import { providerManager } from '@/lib/services/provider-manager'

export async function POST(request: Request) {
  try {
    const { providerId, planId } = await request.json()

    if (!providerId || !planId) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Provider ID and Plan ID are required',
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      )
    }

    console.log(`🔍 Checking availability for plan ${planId} from provider ${providerId}`)

    const isAvailable = await providerManager.checkPlanAvailability(providerId, planId)
    const providerInfo = providerManager.getProviderInfo(providerId)

    return NextResponse.json({
      success: true,
      data: {
        planId,
        providerId,
        providerName: providerInfo?.displayName || 'Unknown',
        available: isAvailable,
        checkedAt: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Error checking plan availability:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to check availability',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
} 
 
 
 
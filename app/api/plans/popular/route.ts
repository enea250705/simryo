// API Route: GET /api/plans/popular - Fetch popular plans
import { NextRequest, NextResponse } from 'next/server'
import { ProviderManager } from '@/lib/services/provider-manager'

// GET /api/plans/popular - Get all popular eSIM plans
export async function GET(request: NextRequest) {
  try {
    console.log('Fetching popular plans from providers...')
    
    const providerManager = new ProviderManager()
    const popularPlans = await providerManager.getPopularPlans(10) // Get top 10 popular plans
    
    console.log(`Found ${popularPlans.length} popular plans`)
    console.log('MAYA_NET_API_KEY (first 5 chars):', process.env.MAYA_NET_API_KEY?.substring(0, 5))
    console.log('MAYA_NET_PARTNER_TYPE:', process.env.MAYA_NET_PARTNER_TYPE)
    
    return NextResponse.json({ 
      success: true, 
      plans: popularPlans,
      meta: {
        total: popularPlans.length,
        providers: providerManager.getEnabledProviders(),
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Error fetching popular plans:', error)
    
    // Check for specific error types
    if (error instanceof Error) {
      console.error('Error details:', error.message)
      console.error('Error stack:', error.stack)
    }
    
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to fetch popular plans',
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
} 
 
 
 
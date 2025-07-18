// API Route: GET /api/plans/popular - Fetch popular plans
import { NextRequest, NextResponse } from 'next/server'
import { ProviderManager } from '@/lib/services/provider-manager'

// Enable edge runtime for better performance
export const runtime = 'nodejs'

// Cache the response for 5 minutes
const CACHE_DURATION = 300 // 5 minutes

// GET /api/plans/popular - Get all popular eSIM plans
export async function GET(request: NextRequest) {
  try {
    const providerManager = new ProviderManager()
    const popularPlans = await providerManager.getPopularPlans(10) // Get top 10 popular plans
    
    const response = NextResponse.json({ 
      success: true, 
      plans: popularPlans,
      meta: {
        total: popularPlans.length,
        providers: providerManager.getEnabledProviders(),
        timestamp: new Date().toISOString()
      }
    })

    // Add cache headers
    response.headers.set('Cache-Control', `public, max-age=${CACHE_DURATION}, stale-while-revalidate=600`)
    response.headers.set('CDN-Cache-Control', `public, max-age=${CACHE_DURATION}`)
    
    return response
  } catch (error) {
    console.error('Error fetching popular plans:', error)
    
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
 
 
 
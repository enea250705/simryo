// API Route: GET /api/plans - Fetch all plans from all providers
import { NextRequest, NextResponse } from 'next/server'
import { ProviderManager } from '@/lib/services/provider-manager'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const countryCode = searchParams.get('countryCode') || undefined
    const popular = searchParams.get('popular') === 'true'
    const sortBy = searchParams.get('sortBy') as 'price' | 'data' | 'days' | 'popularity' || 'price'
    const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' || 'asc'
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined

    // Fetch plans from provider manager
    const providerManager = new ProviderManager()
    let plans
    if (popular) {
      plans = await providerManager.getPopularPlans(limit || 10)
    } else {
      plans = await providerManager.getAllPlans({
        countryCode,
        sortBy,
        sortOrder,
        maxResults: limit
      })
    }

    return NextResponse.json({
      success: true,
      plans,
      meta: {
        total: plans.length,
        filters: {
          countryCode,
          popular,
          sortBy,
          sortOrder
        },
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Plans fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch plans' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    // This endpoint could be used to refresh plan cache
    // The original code had a ProviderManager, but it's removed.
    // If a cache refresh mechanism is needed, it would need to be re-implemented
    // or the logic moved to a different service.
    // For now, we'll just return a placeholder response.
    return NextResponse.json({
      success: true,
      message: 'Plan cache refresh endpoint is not fully implemented yet.',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Error refreshing plan cache:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to refresh cache',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// Removed the duplicate getAvailableESIMPlans export as it's redundant with GET
/*
export async function getAvailableESIMPlans(request: NextRequest) {
  try {
    const plans = await prisma.plan.findMany({
      orderBy: { price: 'asc' } // Order by price ascending by default
    })

    return NextResponse.json({ success: true, plans })
  } catch (error) {
    console.error('Error fetching plans:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
*/ 
 
 
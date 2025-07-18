// API Route: GET /api/plans/[countryCode] - Fetch plans for specific country
import { NextRequest, NextResponse } from 'next/server'
import { ProviderManager } from '@/lib/services/provider-manager'

// GET /api/plans/[countryCode] - Get eSIM plans for a specific country
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ countryCode: string }> }
) {
  try {
    const { countryCode } = await params

    if (!countryCode) {
      return NextResponse.json(
        { success: false, error: 'Country code is required' },
        { status: 400 }
      )
    }

    const providerManager = new ProviderManager()
    const plans = await providerManager.getPlansByCountry(countryCode)

    if (plans.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        count: 0,
        message: `No plans available for country code: ${countryCode}`,
        timestamp: new Date().toISOString()
      })
    }

    // Group plans by provider for better organization
    const plansByProvider = plans.reduce((acc, plan) => {
      if (!acc[plan.providerId]) {
        acc[plan.providerId] = {
          providerId: plan.providerId,
          providerName: plan.providerDisplayName,
          plans: []
        }
      }
      acc[plan.providerId].plans.push(plan)
      return acc
    }, {} as Record<string, any>)

    return NextResponse.json({
      success: true,
      data: plans,
      plansByProvider: Object.values(plansByProvider),
      count: plans.length,
      countryCode,
      timestamp: new Date().toISOString(),
      providers: providerManager.getEnabledProviders()
    })

  } catch (error) {
    const { countryCode } = await params
    console.error(`❌ Error fetching plans for ${countryCode}:`, error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch country plans',
        countryCode: countryCode,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
} 

 
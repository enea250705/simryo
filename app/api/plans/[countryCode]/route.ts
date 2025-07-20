// API Route: GET /api/plans/[countryCode] - Fetch plans for specific country
import { NextRequest, NextResponse } from 'next/server'
import { ProviderManager } from '@/lib/services/provider-manager'

// GET /api/plans/[countryCode] - Get eSIM plans for a specific country
// Convert slug back to proper country identifier
function convertSlugToCountryIdentifier(slug: string): string {
  // Special mapping for known problematic slugs
  const slugMapping: Record<string, string> = {
    'china-mainland': 'China Mainland',
    'hong-kong': 'Hong Kong', 
    'macao': 'Macao',
    'south-korea': 'South Korea',
    'united-states': 'United States',
    'united-kingdom': 'United Kingdom'
  }
  
  // If we have a specific mapping, use it
  if (slugMapping[slug.toLowerCase()]) {
    return slugMapping[slug.toLowerCase()]
  }
  
  // Otherwise, convert slug back to title case
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ countryCode: string }> }
) {
  try {
    const { countryCode: slug } = await params

    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Country code is required' },
        { status: 400 }
      )
    }

    console.log(`🔍 API: Received slug "${slug}", converting to country identifier...`)
    const countryIdentifier = convertSlugToCountryIdentifier(slug)
    console.log(`🔄 API: Converted "${slug}" to "${countryIdentifier}"`)

    const providerManager = new ProviderManager()
    const plans = await providerManager.getPlansByCountry(countryIdentifier)

    if (plans.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        count: 0,
        message: `No plans available for: ${countryIdentifier} (slug: ${slug})`,
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
      countryCode: countryIdentifier,
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

 
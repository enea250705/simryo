import { NextRequest, NextResponse } from 'next/server'
import { esimAccessAPI } from '@/lib/esim-access'

// GET /api/esim-access/[country] - Get eSIM plans for a specific country
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ country: string }> }
) {
  try {
    const { country } = await params
    
    if (!country) {
      return NextResponse.json(
        { success: false, error: 'Country parameter is required' },
        { status: 400 }
      )
    }

    // Get all plans from eSIM Access
    const allPlans = await esimAccessAPI.getPlans()
    
    // Filter plans by country (case-insensitive)
    const countryPlans = allPlans.filter(plan => 
      plan.country.toLowerCase() === country.toLowerCase() ||
      plan.countryCode.toLowerCase() === country.toLowerCase()
    )

    if (countryPlans.length === 0) {
      return NextResponse.json({
        success: true,
        plans: [],
        meta: {
          country: country,
          total: 0,
          message: `No eSIM plans available for ${country}`,
          timestamp: new Date().toISOString()
        }
      })
    }

    return NextResponse.json({
      success: true,
      plans: countryPlans,
      meta: {
        country: country,
        total: countryPlans.length,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    const { country } = await params
    console.error(`❌ Error fetching eSIM plans for ${country}:`, error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch eSIM plans',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// POST /api/esim-access/[country] - Purchase/provision eSIM for a specific country
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ country: string }> }
) {
  try {
    const { country } = await params
    const body = await request.json()
    
    const { planId, userId, userEmail, quantity = 1 } = body

    if (!planId || !userId || !userEmail) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: planId, userId, userEmail' 
        },
        { status: 400 }
      )
    }

    // Validate the plan exists for the country
    const allPlans = await esimAccessAPI.getPlans()
    const plan = allPlans.find(p => 
      p.id === planId && 
      (p.country.toLowerCase() === country.toLowerCase() ||
       p.countryCode.toLowerCase() === country.toLowerCase())
    )

    if (!plan) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Plan ${planId} not found for country ${country}` 
        },
        { status: 404 }
      )
    }

    // Provision the eSIM
    const provisionResult = await esimAccessAPI.provisionESIM({
      planId,
      userId,
      userEmail,
      quantity
    })

    if (!provisionResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: provisionResult.error || 'Failed to provision eSIM' 
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        ...provisionResult.data,
        country: country,
        purchaseDetails: {
          planId,
          quantity,
          totalPrice: plan.price * quantity,
          currency: plan.currency
        }
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    const { country } = await params
    console.error(`❌ Error provisioning eSIM for ${country}:`, error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to provision eSIM',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
} 
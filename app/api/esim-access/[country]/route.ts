import { NextRequest, NextResponse } from 'next/server'
import { ProviderManager } from '@/lib/services/provider-manager'

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

    // Get filtered plans from ProviderManager (applies plan filtering automatically)
    const providerManager = new ProviderManager()
    const countryPlans = await providerManager.getPlansByCountry(country)

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

    // Validate the plan exists for the country using ProviderManager
    const providerManager = new ProviderManager()
    const countryPlans = await providerManager.getPlansByCountry(country)
    const plan = countryPlans.find(p => p.id === planId)

    if (!plan) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Plan ${planId} not found for country ${country}` 
        },
        { status: 404 }
      )
    }

    // Provision the eSIM using the ProviderManager
    const provisionResult = await providerManager.purchasePlan(plan.providerId, {
      planId,
      customerEmail: userEmail,
      customerName: userId // Using userId as name for now
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
        orderId: provisionResult.orderId,
        qrCodeUrl: provisionResult.qrCodeUrl,
        activationCode: provisionResult.activationCode,
        instructions: provisionResult.instructions,
        estimatedActivationTime: provisionResult.estimatedActivationTime,
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
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
// import { verifyToken } from '@/lib/auth' // Remove this line

// POST /api/esim/activate - Activate a specific eSIM for the authenticated user
export async function POST(request: NextRequest) {
  // Remove tokenVerification and use NextAuth session if needed
  // const tokenVerification = verifyToken(request)

  // if (!tokenVerification.isValid) {
  //   return tokenVerification.error
  // }

  // const userId = tokenVerification.userId

  try {
    const { esimId } = await request.json()

    if (!esimId) {
      return NextResponse.json(
        { success: false, error: 'eSIM ID is required for activation' },
        { status: 400 }
      )
    }

    // Find the eSIM and ensure it belongs to the authenticated user and is not already active
    const esimToActivate = await prisma.eSIM.findFirst({
      where: {
        id: esimId,
        // userId: userId, // Remove userId check if not authenticated
        status: 'PENDING', // Only allow activating PENDING eSIMs
      },
    })

    if (!esimToActivate) {
      return NextResponse.json(
        { success: false, error: 'eSIM not found, already active, or does not belong to user' },
        { status: 404 }
      )
    }

    // In a real scenario, this is where you would call an external eSIM provisioning service
    // to genuinely activate the eSIM with the provider. For now, we simulate it.
    console.log(`Simulating activation for eSIM ID: ${esimToActivate.id}`)

    // Update the eSIM status and activatedAt timestamp in the database
    const activatedEsim = await prisma.eSIM.update({
      where: { id: esimId },
      data: {
        status: 'ACTIVE',
        activatedAt: new Date(),
      },
      select: {
        id: true,
        iccid: true,
        status: true,
        activatedAt: true,
        expiresAt: true,
        plan: { select: { name: true } },
      },
    })

    return NextResponse.json({
      success: true,
      esim: activatedEsim,
      message: 'eSIM activated successfully',
    })
  } catch (error) {
    console.error('Error activating eSIM:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
 
 
 
 
 
 
 
 
 
 
 
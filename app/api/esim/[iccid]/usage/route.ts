import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
// import { verifyToken } from '@/lib/auth' // Remove this line

// GET /api/esim/[iccid]/usage - Get usage statistics for a specific eSIM
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ iccid: string }> }
) {
  // Remove tokenVerification and use NextAuth session if needed
  // const tokenVerification = verifyToken(request)

  // if (!tokenVerification.isValid) {
  //   return tokenVerification.error
  // }

  const { iccid } = await params

  if (!iccid) {
    return NextResponse.json(
      { success: false, error: 'eSIM ICCID is required' },
      { status: 400 }
    )
  }

  try {
    const esim = await prisma.esim.findFirst({
      where: {
        iccid: iccid,
        // userId: tokenVerification.userId, // Remove this line
      },
      select: {
        id: true,
        iccid: true,
        dataUsed: true,
        dataLimit: true,
        status: true,
        createdAt: true,
        expiresAt: true,
        plan: {
          select: { country: true, dataAmount: true, days: true }
        }
      }
    })

    if (!esim) {
      return NextResponse.json(
        { success: false, error: 'eSIM not found or does not belong to user' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, esim })
  } catch (error) {
    console.error('Error fetching eSIM usage:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
 
 
 
 
 
 
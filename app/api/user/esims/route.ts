import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const esims = await prisma.eSIM.findMany({
      where: { userId: session.user.id },
      include: {
        plan: {
          select: {
            country: true,
            countryCode: true,
            flag: true,
            dataAmount: true,
            days: true,
            price: true,
            currency: true,
            features: true,
            networkType: true,
            carriers: true,
            coverage: true,
            activation: true
          }
        },
        provider: {
          select: {
            name: true,
            displayName: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const formattedEsims = esims.map((esim: any) => ({
      id: esim.id,
      iccid: esim.iccid,
      status: esim.status.toLowerCase(),
      dataLimit: esim.dataLimit,
      dataUsed: esim.dataUsed,
      dataRemaining: esim.dataLimit - esim.dataUsed,
      usagePercentage: Math.round((esim.dataUsed / esim.dataLimit) * 100),
      expiresAt: esim.expiresAt.toISOString(),
      qrCodeUrl: esim.qrCodeUrl,
      activationCode: esim.activationCode,
      autoRenew: esim.autoRenew,
      isRoaming: esim.isRoaming,
      lastUsed: esim.lastUsed?.toISOString() || null,
      plan: {
        country: esim.plan.country,
        flag: esim.plan.flag,
        dataAmount: esim.plan.dataAmount,
        days: esim.plan.days,
        price: esim.plan.price,
        currency: esim.plan.currency,
        features: esim.plan.features,
        networkType: esim.plan.networkType,
        carriers: esim.plan.carriers,
        coverage: esim.plan.coverage,
        activation: esim.plan.activation
      },
      provider: esim.provider.displayName
    }))

    return NextResponse.json({
      success: true,
      esims: formattedEsims
    })
  } catch (error) {
    console.error('eSIMs fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch eSIMs' },
      { status: 500 }
    )
  }
} 
 
 
 
 
 
 
 
 
 
 
 
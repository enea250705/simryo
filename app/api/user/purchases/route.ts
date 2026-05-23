import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/session'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 })
    }

    const esims = await prisma.esim.findMany({
      where: { userId: session.userId },
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
        provider: { select: { name: true, displayName: true } },
        order: { select: { id: true, status: true, amount: true, currency: true, createdAt: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    const purchases = esims.map((esim: any) => ({
      id: esim.id,
      orderId: esim.orderId || 'N/A',
      country: esim.plan.country,
      flag: esim.plan.flag,
      provider: esim.provider.displayName,
      planName: `${esim.plan.dataAmount}MB ${esim.plan.country} Plan`,
      dataAmount: `${esim.dataLimit}MB`,
      dataUsed: `${esim.dataUsed}MB`,
      dataRemaining: `${esim.dataLimit - esim.dataUsed}MB`,
      usagePercentage: Math.round((esim.dataUsed / esim.dataLimit) * 100),
      status: esim.status.toLowerCase(),
      activationDate: esim.createdAt.toISOString(),
      expiryDate: esim.expiresAt.toISOString(),
      qrCodeUrl: esim.qrCodeUrl,
      activationCode: esim.activationCode,
      price: esim.plan.price,
      currency: esim.plan.currency,
      autoRenew: esim.autoRenew,
      isRoaming: esim.isRoaming,
      lastUsed: esim.lastUsed?.toISOString() || null,
      instructions: [
        'Download the eSIM QR code from the link provided',
        'Go to your phone Settings > Cellular/Mobile Data',
        'Tap "Add Cellular Plan" or "Add eSIM"',
        'Scan the QR code or enter the activation code manually',
        'Follow the on-screen instructions to complete setup'
      ]
    }))

    return NextResponse.json({ success: true, purchases })
  } catch (error) {
    console.error('Purchases fetch error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch purchases' }, { status: 500 })
  }
}

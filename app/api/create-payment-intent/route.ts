import { NextResponse } from 'next/server'
import { createStripePaymentIntent, stripe } from '@/lib/services/stripe'
import { prisma } from '@/lib/db'

const EUR_TO_USD = 1.09
const MIN_CHARGE_USD = 0.50
// Max age for cached price: 24 hours
const CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000

export async function POST(request: Request) {
  try {
    const { items } = await request.json()

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 })
    }

    // Look up authoritative prices from server-side cache (populated by /api/plans)
    const planIds: string[] = items.map((i: any) => i?.plan?.id || i?.planId).filter(Boolean)
    const cached = await prisma.planCache.findMany({ where: { externalId: { in: planIds } } })
    const priceMap = new Map(cached.map(c => [c.externalId, c]))

    let totalEur = 0
    const staleIds: string[] = []

    for (const item of items) {
      const planId = item?.plan?.id || item?.planId
      const qty = typeof item?.quantity === 'number' ? item.quantity : 1
      const cached = planId ? priceMap.get(planId) : null

      if (cached) {
        const ageMs = Date.now() - cached.cachedAt.getTime()
        if (ageMs > CACHE_MAX_AGE_MS) staleIds.push(planId)
        totalEur += cached.priceEur * qty
      } else {
        // Plan not in cache — fall back to client-supplied price but flag it
        console.warn(`PlanCache miss for planId: ${planId} — using client price as fallback`)
        const fallbackPrice = typeof item?.plan?.price === 'number' ? item.plan.price : 0
        totalEur += fallbackPrice * qty
      }
    }

    if (staleIds.length > 0) {
      console.warn(`Stale cache entries for: ${staleIds.join(', ')}`)
    }

    const totalUsd = totalEur * EUR_TO_USD

    if (totalUsd < MIN_CHARGE_USD) {
      return NextResponse.json({ error: 'Order total is too low' }, { status: 400 })
    }

    const result = await createStripePaymentIntent(totalUsd, 'usd')

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    // Store server-computed expected amount in Stripe metadata
    await stripe.paymentIntents.update(result.paymentIntentId!, {
      metadata: {
        expectedAmountUsd: totalUsd.toFixed(4),
        itemCount: String(items.length),
      },
    })

    return NextResponse.json({ clientSecret: result.clientSecret })

  } catch (error) {
    console.error('Failed to create Payment Intent:', error)
    const msg = error instanceof Error ? error.message : 'Unexpected error'
    return NextResponse.json({ error: `Internal Server Error: ${msg}` }, { status: 500 })
  }
}

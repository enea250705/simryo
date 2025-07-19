import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 100 // Latest 100 orders
    })

    return NextResponse.json({
      success: true,
      orders: orders.map(order => ({
        id: order.id,
        customerEmail: order.customerEmail,
        customerName: order.customerName,
        status: order.status,
        amount: order.amount,
        createdAt: order.createdAt
      }))
    })
  } catch (error) {
    console.error('Failed to fetch orders:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
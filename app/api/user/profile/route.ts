import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { getSession } from '@/lib/session'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        joinDate: true,
        createdAt: true,
        _count: { select: { orders: true, esims: true } }
      }
    })

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      select: { amount: true }
    })
    const totalSpent = orders.reduce((sum, order) => sum + order.amount, 0)

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        joinDate: user.joinDate,
        totalEsims: user._count.esims,
        totalSpent
      }
    })
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    const { name, email, currentPassword, newPassword } = body

    const user = await prisma.user.findUnique({ where: { id: session.userId } })
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    const updateData: any = {}
    if (name) updateData.name = name
    if (email) updateData.email = email

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ success: false, error: 'Current password required' }, { status: 400 })
      }
      if (!user.password) {
        return NextResponse.json({ success: false, error: 'Google accounts cannot change password here' }, { status: 400 })
      }
      const isValidPassword = await bcrypt.compare(currentPassword, user.password)
      if (!isValidPassword) {
        return NextResponse.json({ success: false, error: 'Current password is incorrect' }, { status: 400 })
      }
      updateData.password = await bcrypt.hash(newPassword, 10)
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: { id: true, name: true, email: true, avatar: true, joinDate: true }
    })

    return NextResponse.json({ success: true, data: updatedUser })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ success: false, error: 'Failed to update profile' }, { status: 500 })
  }
}

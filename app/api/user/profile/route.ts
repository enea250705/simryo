import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
  }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        joinDate: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
            esims: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Calculate total spent
    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      select: { amount: true }
    })
    const totalSpent = orders.reduce((sum, order) => sum + order.amount, 0)

    const profile = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      joinDate: user.joinDate,
      totalEsims: user._count.esims,
      totalSpent: totalSpent
    }

    return NextResponse.json({
      success: true,
      data: profile
    })
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
  }

    const body = await request.json()
    const { name, email, currentPassword, newPassword } = body

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    const updateData: any = {}
    
    if (name) updateData.name = name
    if (email) updateData.email = email
    
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { success: false, error: 'Current password required' },
          { status: 400 }
        )
      }
      
      const isValidPassword = await bcrypt.compare(currentPassword, user.password)
      if (!isValidPassword) {
        return NextResponse.json(
          { success: false, error: 'Current password is incorrect' },
          { status: 400 }
        )
      }
      
      updateData.password = await bcrypt.hash(newPassword, 10)
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        joinDate: true
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: 'Profile updated successfully'
    })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    )
  }
} 
 
 
 
 
 
 
 
 
 
 
 
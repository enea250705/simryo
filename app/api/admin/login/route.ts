import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Simple admin credentials - you can change these
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@simryo.com'
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
    const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key'

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Create JWT token
      const token = jwt.sign(
        { email, role: 'admin' },
        JWT_SECRET,
        { expiresIn: '24h' }
      )

      console.log('Admin login successful:', email)

      return NextResponse.json({
        success: true,
        token,
        message: 'Login successful'
      })
    } else {
      console.log('Admin login failed:', email)
      
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    )
  }
}
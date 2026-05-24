import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const inputEmail = String(email || '').trim().toLowerCase()
    const inputPassword = String(password || '').trim()

    // Simple admin credentials - you can change these
    const ADMIN_EMAIL = String(process.env.ADMIN_EMAIL || 'admin@simryo.com').trim().toLowerCase()
    const ADMIN_PASSWORD = String(process.env.ADMIN_PASSWORD || 'admin123').trim()
    const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key'

    if (inputEmail === ADMIN_EMAIL && inputPassword === ADMIN_PASSWORD) {
      // Create JWT token
      const token = jwt.sign(
        { email, role: 'admin' },
        JWT_SECRET,
        { expiresIn: '24h' }
      )

      console.log('Admin login successful:', email)

      const response = NextResponse.json({
        success: true,
        token,
        message: 'Login successful'
      })
      response.cookies.set('admin_token', token, {
        path: '/',
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60,
      })
      return response
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
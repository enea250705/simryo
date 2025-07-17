import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('simryo-session')?.value

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: 'No session found' },
        { status: 401 }
      )
    }

    // Decode session token
    const sessionData = JSON.parse(Buffer.from(sessionToken, 'base64').toString())

    // Check if token is expired
    if (Date.now() > sessionData.exp) {
      return NextResponse.json(
        { success: false, error: 'Session expired' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: sessionData.userId,
        name: sessionData.name,
        email: sessionData.email,
        image: null
      }
    })

  } catch (error) {
    console.error('Session verification error:', error)
    return NextResponse.json(
      { success: false, error: 'Invalid session' },
      { status: 401 }
    )
  }
}
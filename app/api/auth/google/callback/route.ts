import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  if (error) {
    return NextResponse.redirect(`${appUrl}/login?error=google_denied`)
  }

  const storedState = request.cookies.get('google-oauth-state')?.value
  if (!state || state !== storedState) {
    return NextResponse.redirect(`${appUrl}/login?error=invalid_state`)
  }

  if (!code) {
    return NextResponse.redirect(`${appUrl}/login?error=no_code`)
  }

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${appUrl}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    })

    if (!tokenRes.ok) throw new Error('Token exchange failed')
    const tokens = await tokenRes.json()

    const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })
    if (!userInfoRes.ok) throw new Error('Failed to fetch Google user info')
    const gUser = await userInfoRes.json()
    // gUser shape: { id, email, name, picture, verified_email }

    // Find user by linked Google account
    let user = await prisma.user.findFirst({
      where: { accounts: { some: { provider: 'google', providerAccountId: gUser.id } } },
    })

    if (!user) {
      // Check if email already exists (link accounts)
      user = await prisma.user.findUnique({ where: { email: gUser.email.toLowerCase() } })

      if (user) {
        await prisma.account.create({
          data: {
            userId: user.id,
            type: 'oauth',
            provider: 'google',
            providerAccountId: gUser.id,
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token ?? null,
            expires_at: tokens.expires_in ? Math.floor(Date.now() / 1000) + tokens.expires_in : null,
            token_type: tokens.token_type ?? null,
            scope: tokens.scope ?? null,
            id_token: tokens.id_token ?? null,
          },
        })
        if (!user.avatar && gUser.picture) {
          user = await prisma.user.update({ where: { id: user.id }, data: { avatar: gUser.picture } })
        }
      } else {
        user = await prisma.user.create({
          data: {
            name: gUser.name,
            email: gUser.email.toLowerCase(),
            password: null,
            avatar: gUser.picture ?? null,
            accounts: {
              create: {
                type: 'oauth',
                provider: 'google',
                providerAccountId: gUser.id,
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token ?? null,
                expires_at: tokens.expires_in ? Math.floor(Date.now() / 1000) + tokens.expires_in : null,
                token_type: tokens.token_type ?? null,
                scope: tokens.scope ?? null,
                id_token: tokens.id_token ?? null,
              },
            },
          },
        })
      }
    }

    const sessionToken = Buffer.from(
      JSON.stringify({
        userId: user.id,
        email: user.email,
        name: user.name,
        image: user.avatar,
        exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
      })
    ).toString('base64')

    const response = NextResponse.redirect(`${appUrl}/profile`)

    response.cookies.set('simryo-session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    })

    response.cookies.delete('google-oauth-state')

    return response
  } catch (err) {
    console.error('Google OAuth callback error:', err)
    return NextResponse.redirect(`${appUrl}/login?error=oauth_failed`)
  }
}

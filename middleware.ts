import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Security headers
const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
}

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://simryo.com', 'https://www.simryo.com']
    : ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}

// Rate limiting configuration
const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // 100 requests per window
  authMaxRequests: 5, // 5 auth attempts per window
  paymentMaxRequests: 10, // 10 payment attempts per hour
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip')
  
  return forwarded?.split(',')[0] || realIp || cfConnectingIp || 'unknown'
}

function checkRateLimit(
  clientId: string, 
  maxRequests: number, 
  windowMs: number = rateLimitConfig.windowMs
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const resetTime = now + windowMs
  
  let entry = rateLimitStore.get(clientId)
  
  if (!entry || now > entry.resetTime) {
    entry = { count: 0, resetTime }
    rateLimitStore.set(clientId, entry)
  }
  
  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetTime: entry.resetTime }
  }
  
  entry.count++
  const remaining = Math.max(0, maxRequests - entry.count)
  
  return { allowed: true, remaining, resetTime: entry.resetTime }
}

// Clean up expired rate limit entries (inline cleanup)
function cleanupExpiredEntries() {
  const now = Date.now()
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const clientIP = getClientIP(request)
  
  // Clean up expired entries periodically
  if (Math.random() < 0.01) { // 1% chance to clean up
    cleanupExpiredEntries()
  }
  
  // Create response
  const response = NextResponse.next()
  
  // Add security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  
  // Handle CORS for API routes
  if (pathname.startsWith('/api')) {
    const origin = request.headers.get('origin')
    
    if (origin && corsOptions.origin.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin)
      response.headers.set('Access-Control-Allow-Credentials', 'true')
      response.headers.set('Access-Control-Allow-Methods', corsOptions.methods.join(', '))
      response.headers.set('Access-Control-Allow-Headers', corsOptions.allowedHeaders.join(', '))
    }
    
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: response.headers })
    }
  }
  
  // Rate limiting for API routes
  if (pathname.startsWith('/api')) {
    let maxRequests = rateLimitConfig.maxRequests
    let windowMs = rateLimitConfig.windowMs
    
    // Stricter limits for sensitive endpoints
    if (pathname.includes('/auth/') || pathname.includes('/login') || pathname.includes('/signup')) {
      maxRequests = rateLimitConfig.authMaxRequests
    } else if (pathname.includes('/payment') || pathname.includes('/purchase') || pathname.includes('/stripe')) {
      maxRequests = rateLimitConfig.paymentMaxRequests
      windowMs = 60 * 60 * 1000 // 1 hour for payment endpoints
    }
    
    const rateLimit = checkRateLimit(`${clientIP}:${pathname}`, maxRequests, windowMs)
    
    // Add rate limit headers
    response.headers.set('X-RateLimit-Limit', maxRequests.toString())
    response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString())
    response.headers.set('X-RateLimit-Reset', rateLimit.resetTime.toString())
    
    if (!rateLimit.allowed) {
      const retryAfter = Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: 'Rate limit exceeded',
          message: `Too many requests. Try again in ${retryAfter} seconds.`,
          retryAfter
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': retryAfter.toString(),
            ...Object.fromEntries(response.headers.entries())
          }
        }
      )
    }
  }
  
  // Authentication checks for protected routes
  const protectedPaths = ['/profile', '/admin', '/dashboard', '/checkout']
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))
  
  if (isProtectedPath) {
    try {
      // Check JWT token from cookie
      const token = request.cookies.get('auth-token')?.value
      
      if (!token) {
        // Redirect to login with return URL
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('callbackUrl', request.url)
        return NextResponse.redirect(loginUrl)
      }
      
      // Verify JWT token
      const { jwtVerify } = await import('jose')
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret')
      
      try {
        await jwtVerify(token, secret)
      } catch (jwtError) {
        console.error('JWT verification failed:', jwtError)
        // Invalid token, redirect to login
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('callbackUrl', request.url)
        return NextResponse.redirect(loginUrl)
      }
      
      // Note: Admin role checking would need to be implemented 
      // by verifying the user's role from the JWT payload if needed
      
    } catch (error) {
      console.error('Auth middleware error:', error)
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }
  
  // Block suspicious requests
  const suspiciousPatterns = [
    /\/wp-admin/,
    /\/wp-content/,
    /\.php$/,
    /\/\.env/,
    /\/config/,
    /\/admin\.php/,
    /\/phpmyadmin/,
  ]
  
  if (suspiciousPatterns.some(pattern => pattern.test(pathname))) {
    return new NextResponse('Not Found', { status: 404 })
  }
  
  // Bot detection and blocking
  const userAgent = request.headers.get('user-agent') || ''
  const suspiciousBots = [
    'bytespider',
    'bot',
    'crawler',
    'spider',
    'scraper'
  ]
  
  if (suspiciousBots.some(bot => userAgent.toLowerCase().includes(bot))) {
    // Allow legitimate search engine bots
    const allowedBots = ['googlebot', 'bingbot', 'slurp']
    const isAllowed = allowedBots.some(bot => userAgent.toLowerCase().includes(bot))
    
    if (!isAllowed && !pathname.startsWith('/api/health')) {
      return new NextResponse('Access Denied', { status: 403 })
    }
  }
  
  // Add performance headers
  response.headers.set('X-Response-Time', Date.now().toString())
  
  // Add cache control for static assets
  if (pathname.includes('/_next/static/')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, icons, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
} 
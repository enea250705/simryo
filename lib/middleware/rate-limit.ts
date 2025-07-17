import { NextRequest, NextResponse } from 'next/server'

// Rate limit configuration
interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
  keyGenerator?: (req: NextRequest) => string
}

// In-memory store for rate limiting (for development)
// In production, use Redis or a distributed cache
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}, 5 * 60 * 1000)

export function createRateLimiter(config: RateLimitConfig) {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes default
    maxRequests = 100, // 100 requests default
    skipSuccessfulRequests = false,
    skipFailedRequests = false,
    keyGenerator = (req) => getClientIdentifier(req)
  } = config

  return async function rateLimitMiddleware(
    req: NextRequest,
    handler: (req: NextRequest) => Promise<NextResponse>
  ): Promise<NextResponse> {
    const key = keyGenerator(req)
    const now = Date.now()
    const resetTime = now + windowMs

    // Get or create rate limit entry
    let entry = rateLimitStore.get(key)
    
    if (!entry || now > entry.resetTime) {
      entry = { count: 0, resetTime }
      rateLimitStore.set(key, entry)
    }

    // Check if limit exceeded
    if (entry.count >= maxRequests) {
      const remainingTime = Math.ceil((entry.resetTime - now) / 1000)
      
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: 'Too many requests',
          message: `Rate limit exceeded. Try again in ${remainingTime} seconds.`,
          retryAfter: remainingTime
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': entry.resetTime.toString(),
            'Retry-After': remainingTime.toString()
          }
        }
      )
    }

    // Increment counter before processing request
    entry.count++

    try {
      // Process the request
      const response = await handler(req)
      const status = response.status

      // Optionally skip counting successful requests
      if (skipSuccessfulRequests && status >= 200 && status < 300) {
        entry.count--
      }

      // Add rate limit headers to response
      const remaining = Math.max(0, maxRequests - entry.count)
      const newHeaders = new Headers(response.headers)
      newHeaders.set('X-RateLimit-Limit', maxRequests.toString())
      newHeaders.set('X-RateLimit-Remaining', remaining.toString())
      newHeaders.set('X-RateLimit-Reset', entry.resetTime.toString())

      return new NextResponse(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders
      })

    } catch (error) {
      // Optionally skip counting failed requests
      if (skipFailedRequests) {
        entry.count--
      }
      throw error
    }
  }
}

// Helper function to identify clients
function getClientIdentifier(req: NextRequest): string {
  // Try to get IP address from various headers
  const forwarded = req.headers.get('x-forwarded-for')
  const realIp = req.headers.get('x-real-ip')
  const cfConnectingIp = req.headers.get('cf-connecting-ip')
  
  const ip = forwarded?.split(',')[0] || realIp || cfConnectingIp || 'unknown'
  
  // For authenticated users, you might want to use user ID
  // const userId = req.headers.get('x-user-id')
  // return userId || ip
  
  return ip
}

// Predefined rate limiters for common use cases
export const authRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 login attempts per 15 minutes
  skipSuccessfulRequests: true
})

export const apiRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100 // 100 API calls per 15 minutes
})

export const strictApiRateLimit = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10 // 10 requests per minute
})

export const paymentRateLimit = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 10 // 10 payment attempts per hour
})

// Wrapper for easy use in API routes
export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  rateLimiter = apiRateLimit
) {
  return async function (req: NextRequest) {
    return rateLimiter(req, handler)
  }
}

// Redis-based rate limiter for production
export class RedisRateLimiter {
  private redisClient: any // Replace with your Redis client type
  
  constructor(redisClient: any) {
    this.redisClient = redisClient
  }

  createRateLimiter(config: RateLimitConfig) {
    const {
      windowMs = 15 * 60 * 1000,
      maxRequests = 100,
      keyGenerator = (req) => getClientIdentifier(req)
    } = config

    return async (req: NextRequest, handler: (req: NextRequest) => Promise<NextResponse>) => {
      const key = `rate_limit:${keyGenerator(req)}`
      const now = Date.now()
      const window = Math.floor(now / windowMs)
      const redisKey = `${key}:${window}`

      try {
        const current = await this.redisClient.incr(redisKey)
        
        if (current === 1) {
          await this.redisClient.expire(redisKey, Math.ceil(windowMs / 1000))
        }

        if (current > maxRequests) {
          const ttl = await this.redisClient.ttl(redisKey)
          return new NextResponse(
            JSON.stringify({
              success: false,
              error: 'Too many requests',
              retryAfter: ttl
            }),
            {
              status: 429,
              headers: {
                'X-RateLimit-Limit': maxRequests.toString(),
                'X-RateLimit-Remaining': '0',
                'Retry-After': ttl.toString()
              }
            }
          )
        }

        const response = await handler(req)
        const remaining = Math.max(0, maxRequests - current)
        
        const newHeaders = new Headers(response.headers)
        newHeaders.set('X-RateLimit-Limit', maxRequests.toString())
        newHeaders.set('X-RateLimit-Remaining', remaining.toString())

        return new NextResponse(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: newHeaders
        })

      } catch (error) {
        console.error('Redis rate limiter error:', error)
        // Fallback to allowing the request if Redis fails
        return handler(req)
      }
    }
  }
} 
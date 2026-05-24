import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

export function verifyAdminToken(request: NextRequest): boolean {
  const authHeader = request.headers.get('Authorization')
  const headerToken = authHeader?.replace('Bearer ', '')
  const cookieToken = request.cookies.get('admin_token')?.value
  const token = headerToken || cookieToken
  if (!token) return false
  try {
    const secret = process.env.JWT_SECRET || 'your-jwt-secret-key'
    const payload = jwt.verify(token, secret) as any
    return payload.role === 'admin'
  } catch {
    return false
  }
}

import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

// Debug environment variables
console.log('NextAuth config:', {
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '***SET***' : 'NOT SET',
  NODE_ENV: process.env.NODE_ENV
})

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST } 
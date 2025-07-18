import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import type { NextAuthOptions } from 'next-auth'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          console.log('NextAuth authorize called with:', credentials?.email)
          
          if (!credentials?.email || !credentials?.password) {
            console.log('Missing credentials')
            return null
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email.toLowerCase() }
          })

          if (!user) {
            console.log('User not found:', credentials.email)
            return null
          }

          const isValid = await bcrypt.compare(credentials.password, user.password)
          if (!isValid) {
            console.log('Invalid password for user:', credentials.email)
            return null
          }

          console.log('User authenticated successfully:', user.email)
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.avatar
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-key-for-development',
  callbacks: {
    async jwt({ token, user }) {
      console.log('JWT callback - user:', user, 'token:', token)
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      console.log('Session callback - session:', session, 'token:', token)
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    newUser: '/signup'
  },
  debug: process.env.NODE_ENV === 'development'
}
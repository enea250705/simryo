import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import type { NextAuthOptions } from 'next-auth'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email.toLowerCase() }
          })

          if (!user) {
            return null
          }

          const isValid = await bcrypt.compare(credentials.password, user.password)
          if (!isValid) {
            return null
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.avatar
          }
        } catch (error) {
          console.error('Auth error:', error)
          throw new Error('Authentication failed')
        }
      }
    }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    // })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account, trigger }) {
      if (user) {
        token.id = user.id
      }
      
      // Check for custom auth token if no NextAuth session
      if (!user && trigger === 'signIn') {
        // This will be triggered when we need to check the custom auth
        return token
      }
      
      return token
    },
    async session({ session, token, trigger }) {
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

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST } 
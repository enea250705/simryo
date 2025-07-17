'use client'

import React, { useState, useEffect, createContext, useContext } from 'react'
import { signIn as nextAuthSignIn, signOut as nextAuthSignOut, useSession } from 'next-auth/react'
import { toast } from 'sonner'
import type { ReactNode } from 'react'

interface User {
  id: string
  email: string
  name?: string
  image?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: Error | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name?: string) => Promise<void>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const { data: session, status } = useSession()
  const [error, setError] = useState<Error | null>(null)
  const [customUser, setCustomUser] = useState<User | null>(null)
  const [customLoading, setCustomLoading] = useState(true)

  const loading = status === 'loading' || customLoading

  // Check for custom auth token if no NextAuth session
  useEffect(() => {
    if (status !== 'loading' && !session) {
      const checkCustomAuth = async () => {
        try {
          const response = await fetch('/api/auth/me')
          const data = await response.json()
          
          if (data.success && data.user) {
            setCustomUser({
              id: data.user.id,
              email: data.user.email,
              name: data.user.name,
              image: data.user.avatar
            })
          }
        } catch (error) {
          console.error('Custom auth check failed:', error)
        } finally {
          setCustomLoading(false)
        }
      }
      
      checkCustomAuth()
    } else {
      setCustomLoading(false)
    }
  }, [session, status])

  const signIn = async (email: string, password: string) => {
    try {
      setError(null)
      
      // Use custom login API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Login failed')
      }

      // The login API automatically sets the auth cookie
      toast.success("Logged in successfully!")
      
      // Refresh the page to update the session
      const redirectUrl = localStorage.getItem('redirectAfterAuth') || '/profile'
      localStorage.removeItem('redirectAfterAuth')
      window.location.href = redirectUrl
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'))
      throw err
    }
  }

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      setError(null)
      
      // Create user account using custom API
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to create account')
      }

      // The signup API automatically sets the auth cookie, so we just need to refresh the page
      // to let NextAuth pick up the session
      toast.success("Account created successfully!")
      
      // Refresh the page to update the session
      const redirectUrl = localStorage.getItem('redirectAfterAuth') || '/profile'
      localStorage.removeItem('redirectAfterAuth')
      window.location.href = redirectUrl
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'))
      throw err
    }
  }

  const signInWithGoogle = async () => {
    try {
      setError(null)
      
      const result = await nextAuthSignIn('google', {
        redirect: false,
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      // Successful Google login - redirect to profile or stored redirect URL
      const redirectUrl = localStorage.getItem('redirectAfterAuth') || '/profile'
      localStorage.removeItem('redirectAfterAuth')
      window.location.href = redirectUrl
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'))
      throw err
    }
  }

  const signOut = async () => {
    try {
      setError(null)
      
      // Clear custom user state
      setCustomUser(null)
      
      // Call custom logout API
      await fetch('/api/auth/logout', { method: 'POST' })
      
      // Also clear NextAuth session if exists
      if (session) {
        await nextAuthSignOut({ redirect: false })
      }
      
      // Redirect to home page after logout
      window.location.href = '/'
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'))
      throw err
    }
  }

  // Transform session to match our User interface, prioritizing custom auth
  const user: User | null = customUser || (session?.user ? {
    id: session.user.id || '',
    email: session.user.email || '',
    name: session.user.name || '',
    image: session.user.image || ''
  } : null)

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error, 
      signIn, 
      signUp, 
      signOut,
      signInWithGoogle 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 
 
 
 
 
 
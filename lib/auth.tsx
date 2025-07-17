'use client'

import React, { useState, useEffect, createContext, useContext } from 'react'
import { signIn as nextAuthSignIn, signOut as nextAuthSignOut, useSession } from 'next-auth/react'
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

  const loading = status === 'loading'

  const signIn = async (email: string, password: string) => {
    try {
      setError(null)
      
      const result = await nextAuthSignIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      // Successful login - redirect to profile or stored redirect URL
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
      
      // Create user account using NextAuth-compatible endpoint
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create account')
      }

      // After successful signup, sign them in with NextAuth
      const result = await nextAuthSignIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      // Successful signup and login - redirect to profile or stored redirect URL
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
      await nextAuthSignOut({ redirect: false })
      // Redirect to home page after logout
      window.location.href = '/'
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'))
      throw err
    }
  }

  // Transform session to match our User interface
  const user: User | null = session?.user ? {
    id: session.user.id || '',
    email: session.user.email || '',
    name: session.user.name || '',
    image: session.user.image || ''
  } : null

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
 
 
 
 
 
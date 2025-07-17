'use client'

import React, { useState, useEffect, createContext, useContext } from 'react'
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
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check authentication on mount and when page becomes visible
  useEffect(() => {
    checkAuth()
    
    // Re-check when page becomes visible (useful after login redirects)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkAuth()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  const checkAuth = async () => {
    try {
      // Check localStorage first for immediate UI update
      const storedUser = localStorage.getItem('simryo-user')
      if (storedUser) {
        const userData = JSON.parse(storedUser)
        setUser(userData)
      }

      // Then verify with server
      const response = await fetch('/api/auth/verify', {
        method: 'GET',
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.user) {
          setUser(data.user)
          localStorage.setItem('simryo-user', JSON.stringify(data.user))
        } else {
          setUser(null)
          localStorage.removeItem('simryo-user')
        }
      } else {
        setUser(null)
        localStorage.removeItem('simryo-user')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setUser(null)
      localStorage.removeItem('simryo-user')
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Login failed')
      }

      const data = await response.json()
      setUser(data.user)
      localStorage.setItem('simryo-user', JSON.stringify(data.user))
      toast.success('Logged in successfully!')
    } catch (error) {
      throw error
    }
  }

  const signOut = async () => {
    try {
      // Clear local state immediately
      setUser(null)
      localStorage.removeItem('simryo-user')
      
      // Call server to clear session
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      })
      
      toast.success('Logged out successfully!')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Logout failed')
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
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
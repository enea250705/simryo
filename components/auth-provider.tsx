'use client'

import { SessionProvider } from 'next-auth/react'
import { AuthProvider as AuthContextProvider } from '@/lib/auth'
import type { ReactNode } from 'react'

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthContextProvider>{children}</AuthContextProvider>
    </SessionProvider>
  )
} 
 
 
 
 
 
 
'use client'

import { AuthProvider as ServerlessAuthProvider } from '@/lib/serverless-auth'
import type { ReactNode } from 'react'

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <ServerlessAuthProvider>
      {children}
    </ServerlessAuthProvider>
  )
} 
 
 
 
 
 
 
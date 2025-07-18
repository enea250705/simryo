import { NextRequest, NextResponse } from 'next/server'

// Temporarily disable NextAuth for production build
export function GET(request: NextRequest) {
  return NextResponse.json({ error: 'Auth temporarily disabled' }, { status: 503 })
}

export function POST(request: NextRequest) {
  return NextResponse.json({ error: 'Auth temporarily disabled' }, { status: 503 })
} 
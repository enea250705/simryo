import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const vitals = await request.json()
  
  // Enhanced Web Vitals tracking with detailed metrics
  const enhancedVitals = {
    ...vitals,
    timestamp: new Date().toISOString(),
    userAgent: request.headers.get('user-agent'),
    url: request.headers.get('referer'),
    connectionType: request.headers.get('connection'),
    deviceMemory: request.headers.get('device-memory'),
    effectiveType: request.headers.get('ect'),
    rtt: request.headers.get('rtt'),
    downlink: request.headers.get('downlink'),
    saveData: request.headers.get('save-data'),
  }

  // Log to console for development (disabled to reduce noise)
  // console.log('Web Vitals:', enhancedVitals)

  // Here you would typically send to your analytics service
  // await analytics.track('web-vitals', enhancedVitals)

  return NextResponse.json({ success: true })
}
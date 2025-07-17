'use client'

import { useReportWebVitals } from 'next/web-vitals'
import { useEffect } from 'react'

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Enhanced Web Vitals reporting
    const enhancedMetric = {
      ...metric,
      // Add additional context
      pathname: window.location.pathname,
      search: window.location.search,
      referrer: document.referrer,
      connectionType: (navigator as any).connection?.effectiveType,
      deviceMemory: (navigator as any).deviceMemory,
      hardwareConcurrency: navigator.hardwareConcurrency,
      language: navigator.language,
      languages: navigator.languages,
      platform: navigator.platform,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      screen: {
        width: window.screen.width,
        height: window.screen.height,
        colorDepth: window.screen.colorDepth,
      },
      // Performance timing
      timing: performance.timing,
      // Memory usage (if available)
      memory: (performance as any).memory,
      // Navigation timing
      navigation: performance.navigation,
    }

    // Send to API endpoint
    fetch('/api/web-vitals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(enhancedMetric),
    }).catch(console.error)

    // Log critical metrics
    if (metric.name === 'CLS' && metric.value > 0.1) {
      console.warn('High CLS detected:', metric.value)
    }
    if (metric.name === 'LCP' && metric.value > 2500) {
      console.warn('High LCP detected:', metric.value)
    }
    if (metric.name === 'FID' && metric.value > 100) {
      console.warn('High FID detected:', metric.value)
    }
  })

  useEffect(() => {
    // Additional performance monitoring
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'resource') {
          const resourceEntry = entry as PerformanceResourceTiming
          // Log slow resources
          if (resourceEntry.duration > 1000) {
            console.warn('Slow resource:', resourceEntry.name, resourceEntry.duration)
          }
        }
      })
    })

    observer.observe({ entryTypes: ['resource', 'navigation', 'paint'] })

    return () => observer.disconnect()
  }, [])

  return null
}
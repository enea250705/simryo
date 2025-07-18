"use client"

import { useEffect, useState } from 'react'

export function usePerformanceOptimization() {
  const [isLowEnd, setIsLowEnd] = useState(false)
  const [connection, setConnection] = useState<'fast' | 'slow' | 'unknown'>('unknown')
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    // Check for low-end device
    const checkLowEnd = () => {
      const hardwareConcurrency = navigator.hardwareConcurrency || 4
      const deviceMemory = (navigator as any).deviceMemory || 4
      
      setIsLowEnd(hardwareConcurrency <= 2 || deviceMemory <= 2)
    }

    // Check connection speed
    const checkConnection = () => {
      const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
      
      if (conn) {
        if (conn.effectiveType === '4g' || conn.effectiveType === '3g') {
          setConnection('fast')
        } else if (conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g') {
          setConnection('slow')
        }
      }
    }

    // Check reduced motion preference
    const checkReducedMotion = () => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      setReducedMotion(mediaQuery.matches)
      
      mediaQuery.addEventListener('change', (e) => {
        setReducedMotion(e.matches)
      })
    }

    checkLowEnd()
    checkConnection()
    checkReducedMotion()
  }, [])

  return {
    isLowEnd,
    connection,
    reducedMotion,
    shouldReduceAnimations: isLowEnd || reducedMotion || connection === 'slow',
    shouldLazyLoad: connection === 'slow' || isLowEnd,
    shouldPreload: connection === 'fast' && !isLowEnd
  }
}

export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [ref, options])

  return isIntersecting
}

export function useViewportSize() {
  const [size, setSize] = useState({
    width: 0,
    height: 0,
    isMobile: false,
    isTablet: false,
    isDesktop: false
  })

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      setSize({
        width,
        height,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024
      })
    }

    updateSize()
    window.addEventListener('resize', updateSize)

    return () => window.removeEventListener('resize', updateSize)
  }, [])

  return size
}
// Advanced analytics and tracking utilities for SEO optimization

export interface AnalyticsEvent {
  event: string
  properties: Record<string, any>
  timestamp: number
  sessionId: string
  userId?: string
  pageUrl: string
  referrer: string
  userAgent: string
  viewport: { width: number; height: number }
  performance: {
    loadTime: number
    domContentLoaded: number
    timeToInteractive: number
  }
}

export interface SEOMetrics {
  pageViews: number
  uniqueVisitors: number
  bounceRate: number
  avgSessionDuration: number
  pagesPerSession: number
  organicTraffic: number
  keywordRankings: { [keyword: string]: number }
  clickThroughRate: number
  conversionRate: number
  coreWebVitals: {
    lcp: number
    fid: number
    cls: number
    fcp: number
    ttfb: number
  }
}

export class AdvancedAnalytics {
  private static instance: AdvancedAnalytics
  private sessionId: string
  private userId?: string
  private eventQueue: AnalyticsEvent[] = []
  private isOnline = true

  private constructor() {
    this.sessionId = this.generateSessionId()
    this.initializeTracking()
  }

  static getInstance(): AdvancedAnalytics {
    if (!AdvancedAnalytics.instance) {
      AdvancedAnalytics.instance = new AdvancedAnalytics()
    }
    return AdvancedAnalytics.instance
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private initializeTracking() {
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      this.track('page_visibility_change', {
        visible: !document.hidden,
        timestamp: Date.now()
      })
    })

    // Track scroll depth
    let maxScrollDepth = 0
    window.addEventListener('scroll', () => {
      const scrollDepth = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      )
      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth
        if (scrollDepth >= 25 && scrollDepth < 50) {
          this.track('scroll_depth_25', { depth: scrollDepth })
        } else if (scrollDepth >= 50 && scrollDepth < 75) {
          this.track('scroll_depth_50', { depth: scrollDepth })
        } else if (scrollDepth >= 75 && scrollDepth < 100) {
          this.track('scroll_depth_75', { depth: scrollDepth })
        } else if (scrollDepth >= 100) {
          this.track('scroll_depth_100', { depth: scrollDepth })
        }
      }
    })

    // Track time on page
    let startTime = Date.now()
    window.addEventListener('beforeunload', () => {
      const timeOnPage = Date.now() - startTime
      this.track('time_on_page', { duration: timeOnPage })
    })

    // Track clicks on external links
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement
      const link = target.closest('a') as HTMLAnchorElement
      
      if (link && link.href) {
        const isExternal = !link.href.includes(window.location.hostname)
        if (isExternal) {
          this.track('external_link_click', {
            url: link.href,
            text: link.textContent,
            position: { x: event.clientX, y: event.clientY }
          })
        }
      }
    })

    // Track form interactions
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement
      this.track('form_submit', {
        formId: form.id,
        formAction: form.action,
        formMethod: form.method,
        fields: Array.from(form.elements).map(el => ({
          name: (el as HTMLInputElement).name,
          type: (el as HTMLInputElement).type
        }))
      })
    })

    // Track search queries
    const urlParams = new URLSearchParams(window.location.search)
    const searchQuery = urlParams.get('q') || urlParams.get('search')
    if (searchQuery) {
      this.track('search_query', { query: searchQuery })
    }

    // Track network connection changes
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      this.track('connection_info', {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      })
    }

    // Track online/offline status
    window.addEventListener('online', () => {
      this.isOnline = true
      this.track('connection_status', { online: true })
      this.flushEventQueue()
    })

    window.addEventListener('offline', () => {
      this.isOnline = false
      this.track('connection_status', { online: false })
    })
  }

  track(eventName: string, properties: Record<string, any> = {}) {
    const event: AnalyticsEvent = {
      event: eventName,
      properties,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
      pageUrl: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      performance: {
        loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
        domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
        timeToInteractive: this.getTimeToInteractive()
      }
    }

    if (this.isOnline) {
      this.sendEvent(event)
    } else {
      this.eventQueue.push(event)
    }
  }

  private getTimeToInteractive(): number {
    // Simplified TTI calculation
    const entries = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    return entries.loadEventEnd - entries.fetchStart
  }

  private async sendEvent(event: AnalyticsEvent) {
    try {
      // Send to multiple analytics services
      await Promise.all([
        this.sendToGoogleAnalytics(event),
        this.sendToCustomAnalytics(event),
        this.sendToHeatmapService(event)
      ])
    } catch (error) {
      console.error('Failed to send analytics event:', error)
      // Fallback to queue for retry
      this.eventQueue.push(event)
    }
  }

  private async sendToGoogleAnalytics(event: AnalyticsEvent) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.event, {
        custom_parameter: event.properties,
        session_id: event.sessionId,
        user_id: event.userId
      })
    }
  }

  private async sendToCustomAnalytics(event: AnalyticsEvent) {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event)
    })
  }

  private async sendToHeatmapService(event: AnalyticsEvent) {
    // Integration with heatmap services like Hotjar, Crazy Egg, etc.
    if (typeof hj !== 'undefined') {
      hj('event', event.event)
    }
  }

  private flushEventQueue() {
    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift()
      if (event) {
        this.sendEvent(event)
      }
    }
  }

  // SEO-specific tracking methods
  trackKeywordRanking(keyword: string, position: number, page: number = 1) {
    this.track('keyword_ranking', {
      keyword,
      position,
      page,
      url: window.location.href
    })
  }

  trackCTR(keyword: string, impressions: number, clicks: number) {
    this.track('search_ctr', {
      keyword,
      impressions,
      clicks,
      ctr: clicks / impressions
    })
  }

  trackConversion(type: 'signup' | 'purchase' | 'download', value?: number) {
    this.track('conversion', {
      type,
      value,
      url: window.location.href,
      referrer: document.referrer
    })
  }

  trackPagePerformance(metrics: Partial<SEOMetrics['coreWebVitals']>) {
    this.track('page_performance', metrics)
  }

  trackUserEngagement(action: 'scroll' | 'click' | 'hover' | 'focus', element: string) {
    this.track('user_engagement', {
      action,
      element,
      timestamp: Date.now()
    })
  }

  trackSEOExperiment(experimentId: string, variant: string, metric: string, value: number) {
    this.track('seo_experiment', {
      experimentId,
      variant,
      metric,
      value
    })
  }

  // A/B testing for SEO
  initializeABTest(testId: string, variants: string[]) {
    const variant = variants[Math.floor(Math.random() * variants.length)]
    localStorage.setItem(`ab_test_${testId}`, variant)
    
    this.track('ab_test_assignment', {
      testId,
      variant,
      timestamp: Date.now()
    })
    
    return variant
  }

  getABTestVariant(testId: string): string | null {
    return localStorage.getItem(`ab_test_${testId}`)
  }

  // Real-time SEO monitoring
  monitorSEOMetrics() {
    // Monitor Core Web Vitals
    this.observeCoreWebVitals()
    
    // Monitor click-through rates
    this.monitorCTR()
    
    // Monitor bounce rate
    this.monitorBounceRate()
    
    // Monitor page load speed
    this.monitorPageSpeed()
  }

  private observeCoreWebVitals() {
    // Already implemented in WebVitals component
    // This would integrate with that system
  }

  private monitorCTR() {
    // Track search result clicks vs impressions
    const searchParams = new URLSearchParams(window.location.search)
    const utm_source = searchParams.get('utm_source')
    const utm_medium = searchParams.get('utm_medium')
    
    if (utm_source === 'google' && utm_medium === 'organic') {
      this.track('organic_click', {
        keyword: searchParams.get('q'),
        position: searchParams.get('position'),
        device: this.getDeviceType()
      })
    }
  }

  private monitorBounceRate() {
    let bounced = true
    let startTime = Date.now()
    
    // Track user interactions that indicate non-bounce
    const nonBounceEvents = ['click', 'scroll', 'keydown', 'mousemove']
    
    nonBounceEvents.forEach(eventType => {
      document.addEventListener(eventType, () => {
        if (bounced && Date.now() - startTime > 15000) { // 15 seconds threshold
          bounced = false
          this.track('non_bounce', { timeToEngage: Date.now() - startTime })
        }
      }, { once: true })
    })
    
    window.addEventListener('beforeunload', () => {
      if (bounced) {
        this.track('bounce', { timeOnPage: Date.now() - startTime })
      }
    })
  }

  private monitorPageSpeed() {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    
    this.track('page_speed', {
      dns: navigation.domainLookupEnd - navigation.domainLookupStart,
      connection: navigation.connectEnd - navigation.connectStart,
      request: navigation.responseStart - navigation.requestStart,
      response: navigation.responseEnd - navigation.responseStart,
      domProcessing: navigation.domContentLoadedEventEnd - navigation.responseEnd,
      totalLoad: navigation.loadEventEnd - navigation.navigationStart
    })
  }

  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.innerWidth
    if (width <= 768) return 'mobile'
    if (width <= 1024) return 'tablet'
    return 'desktop'
  }

  // Generate SEO reports
  generateSEOReport(): Promise<SEOMetrics> {
    return fetch('/api/seo-metrics')
      .then(response => response.json())
      .then(data => ({
        pageViews: data.pageViews || 0,
        uniqueVisitors: data.uniqueVisitors || 0,
        bounceRate: data.bounceRate || 0,
        avgSessionDuration: data.avgSessionDuration || 0,
        pagesPerSession: data.pagesPerSession || 0,
        organicTraffic: data.organicTraffic || 0,
        keywordRankings: data.keywordRankings || {},
        clickThroughRate: data.clickThroughRate || 0,
        conversionRate: data.conversionRate || 0,
        coreWebVitals: data.coreWebVitals || {
          lcp: 0,
          fid: 0,
          cls: 0,
          fcp: 0,
          ttfb: 0
        }
      }))
  }

  // Heatmap integration
  generateHeatmapData() {
    const clicks: { x: number; y: number; timestamp: number }[] = []
    const scrollDepths: number[] = []
    
    document.addEventListener('click', (event) => {
      clicks.push({
        x: event.clientX,
        y: event.clientY,
        timestamp: Date.now()
      })
    })
    
    let maxScroll = 0
    window.addEventListener('scroll', () => {
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent
        scrollDepths.push(scrollPercent)
      }
    })
    
    return {
      clicks,
      scrollDepths,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    }
  }
}

// Export singleton instance
export const analytics = AdvancedAnalytics.getInstance()

// Global event tracking function
export function trackSEOEvent(eventName: string, properties: Record<string, any> = {}) {
  analytics.track(eventName, properties)
}

// Initialize analytics on page load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    analytics.monitorSEOMetrics()
  })
}
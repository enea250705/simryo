// Provider Manager - Orchestrates all eSIM providers
import { BaseProvider, ProviderPlan, PurchaseRequest, PurchaseResponse } from './providers/base-provider'
import { EsimAccessProvider } from './providers/esim-access'
import { SimifyDirectProvider } from './providers/simify-direct'
import { GlobalConnectProvider } from './providers/global-connect'
import { MayaNetProvider } from './providers/maya-net'
import { PromotionManager } from './promotion-manager'
import { getCountryCode } from '../country-mapping'
import { filterAllowedPlans, getFilteringSummary } from '../utils/plan-filter'

export interface EnhancedPlan extends ProviderPlan {
  providerId: string
  providerDisplayName: string
  popularity: number
  lastUpdated: Date
  featured?: boolean
  promoApplied?: {
    id: string
    originalPrice: number
    savings: number
  }
}

export interface PlanAggregationOptions {
  countryCode?: string
  sortBy?: 'price' | 'data' | 'days' | 'popularity'
  sortOrder?: 'asc' | 'desc'
  maxResults?: number
  includeUnavailable?: boolean
}

export class ProviderManager {
  private providers: Map<string, BaseProvider> = new Map()
  private initialized = false

  constructor() {
    this.initializeProviders()
  }

  private initializeProviders() {
    const providers = [
      // Disable Maya.net provider for now
      new MayaNetProvider({
        name: 'maya-net',
        displayName: 'Maya.net',
        apiKey: process.env.MAYA_NET_API_KEY || '',
        apiSecret: process.env.MAYA_NET_SECRET_KEY || '',
        baseUrl: process.env.MAYA_NET_BASE_URL || 'https://api.maya.net',
        enabled: false, // Set to false to disable Maya.net
        partnerId: process.env.MAYA_NET_PARTNER_ID,
        partnerType: (process.env.MAYA_NET_PARTNER_TYPE || 'distributor') as 'distributor' | 'referral',
        rateLimits: {
          requestsPerMinute: 30,
          requestsPerHour: 1000
        },
        markup: {
          percentage: 10, // 10% markup exactly as requested
          fixedAmount: 2.00 // €2.00 fixed profit exactly as requested
        }
      }),
      // Enable EsimAccess provider with environment credentials
      new EsimAccessProvider({
        name: 'esim-access',
        displayName: 'eSIM Access',
        apiKey: process.env.ESIM_ACCESS_API_KEY || 'cfd3a757a99d4795a5ff3b1714eae3e6',
        apiSecret: '2f268c701f2b43beafa9dc4ebed24d47',
        baseUrl: process.env.ESIM_ACCESS_BASE_URL || 'https://api.esimaccess.com/api/v1',
        enabled: true, // Enable EsimAccess
        rateLimits: {
          requestsPerMinute: 60,
          requestsPerHour: 2000
        },
        markup: {
          percentage: 10, // 10% markup as requested
          fixedAmount: 2.00 // €2.00 fixed profit as requested
        }
      })
    ]

    providers.forEach(provider => {
      if (provider.isEnabled()) {
        this.providers.set(provider.getName(), provider)
        console.log(`✅ Provider initialized: ${provider.getDisplayName()}`)
      } else {
        console.warn(`⚠️  Provider disabled: ${provider.getDisplayName()}`)
      }
    })

    this.initialized = true
    console.log(`🚀 Provider Manager initialized with ${this.providers.size} active providers`)
  }

  public async getAllPlans(options: PlanAggregationOptions = {}, userId?: string): Promise<EnhancedPlan[]> {
    if (!this.initialized) {
      throw new Error('Provider Manager not initialized')
    }

    const allPlans: EnhancedPlan[] = []

    const code = options.countryCode ? getCountryCode(options.countryCode) : undefined
    if (options.countryCode && !code) {
      console.warn(`Could not find country code for: ${options.countryCode}`)
      return [] // Return empty if country code is invalid
    }

    // Fetch plans from all enabled providers in parallel
    const providerPromises = Array.from(this.providers.entries()).map(async ([providerId, provider]) => {
      try {
        console.log(`🔄 Fetching plans from ${provider.getDisplayName()}...`)
        const plans = await provider.fetchPlans(code)
        
        // Ensure plans is an array
        if (!Array.isArray(plans)) {
          console.warn(`Invalid plans data from ${provider.getDisplayName()}:`, plans)
          return []
        }
        
        const enhancedPlans = plans.map(plan => ({
          ...plan,
          providerId,
          providerDisplayName: provider.getDisplayName(),
          popularity: this.calculatePopularity(plan),
          lastUpdated: new Date(),
          featured: this.isFeaturedPlan(plan, provider.getDisplayName())
        }))

        return enhancedPlans
      } catch (error) {
        console.error(`❌ Failed to fetch plans from ${provider.getDisplayName()}:`, error)
        return []
      }
    })

    const providerResults = await Promise.all(providerPromises)
    providerResults.forEach(plans => allPlans.push(...plans))

    // Apply plan filtering to keep only allowed data/duration combinations
    console.log(`🔍 Applying plan filtering to ${allPlans.length} plans...`)
    const allowedPlans = filterAllowedPlans(allPlans)
    const filteringSummary = getFilteringSummary(allPlans, allowedPlans)
    console.log(`📊 Plan filtering results: ${filteringSummary.filteredCount}/${filteringSummary.originalCount} plans kept (${filteringSummary.percentageKept}%), ${filteringSummary.removedCount} plans filtered out`)

    // Deduplicate plans by country + data + days, keeping the cheapest one
    console.log(`🔄 Deduplicating ${allowedPlans.length} plans...`)
    const deduplicatedPlans = this.deduplicatePlans(allowedPlans)
    console.log(`✅ Deduplicated to ${deduplicatedPlans.length} unique plans (removed ${allowedPlans.length - deduplicatedPlans.length} duplicates)`)

    // Filter out unavailable plans if requested
    let filteredPlans = options.includeUnavailable ? deduplicatedPlans : deduplicatedPlans.filter(plan => plan.inStock)

    // Sort plans
    if (options.sortBy) {
      filteredPlans = this.sortPlans(filteredPlans, options.sortBy, options.sortOrder || 'asc')
    }

    // Limit results
    if (options.maxResults) {
      filteredPlans = filteredPlans.slice(0, options.maxResults)
    }

    console.log(`📊 Retrieved ${filteredPlans.length} plans from ${this.providers.size} providers`)
    return filteredPlans
  }

  public async getPlansByCountry(countryIdentifier: string): Promise<EnhancedPlan[]> {
    return this.getAllPlans({ 
      countryCode: countryIdentifier,
      sortBy: 'popularity',
      sortOrder: 'desc'
    })
  }

  public async getPopularPlans(limit: number = 10): Promise<EnhancedPlan[]> {
    const allPlans = await this.getAllPlans({
      sortBy: 'popularity',
      sortOrder: 'desc'
    })

    // Create a more diverse selection of popular plans
    // Group by data amount and select best from each group
    const planGroups = new Map<string, EnhancedPlan[]>()
    
    allPlans.forEach(plan => {
      const dataKey = plan.dataInMB > 10000 ? 'large' : 
                     plan.dataInMB > 5000 ? 'medium' : 
                     plan.dataInMB > 1000 ? 'small' : 'tiny'
      
      if (!planGroups.has(dataKey)) {
        planGroups.set(dataKey, [])
      }
      planGroups.get(dataKey)!.push(plan)
    })

    // Select top plans from each group to ensure diversity
    const diversePlans: EnhancedPlan[] = []
    const groupSizes = {
      'large': Math.ceil(limit * 0.4),  // 40% large plans
      'medium': Math.ceil(limit * 0.3), // 30% medium plans
      'small': Math.ceil(limit * 0.2),  // 20% small plans
      'tiny': Math.ceil(limit * 0.1)    // 10% tiny plans
    }

    for (const [groupKey, groupPlans] of planGroups) {
      const groupLimit = groupSizes[groupKey as keyof typeof groupSizes] || 1
      const sortedGroupPlans = groupPlans
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, groupLimit)
      
      diversePlans.push(...sortedGroupPlans)
    }

    // Sort by popularity and return the requested limit
    return diversePlans
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, limit)
  }

  public async purchasePlan(
    providerId: string, 
    request: PurchaseRequest
  ): Promise<PurchaseResponse> {
    const provider = this.providers.get(providerId)
    
    if (!provider) {
      throw new Error(`Provider not found: ${providerId}`)
    }

    if (!provider.isEnabled()) {
      throw new Error(`Provider is currently disabled: ${providerId}`)
    }

    console.log(`💳 Processing purchase via ${provider.getDisplayName()}...`)
    
    try {
      // Validate plan first
      const isValid = await provider.validatePlan(request.planId)
      if (!isValid) {
        throw new Error(`Invalid plan ID: ${request.planId}`)
      }

      // Check availability
      const isAvailable = await provider.checkPlanAvailability(request.planId)
      if (!isAvailable) {
        throw new Error(`Plan currently unavailable: ${request.planId}`)
      }

      // Process purchase
      const result = await provider.purchasePlan(request)
      
      if (result.success) {
        console.log(`✅ Purchase successful via ${provider.getDisplayName()}: ${result.orderId}`)
      } else {
        console.error(`❌ Purchase failed via ${provider.getDisplayName()}: ${result.error}`)
      }

      return result
    } catch (error) {
      console.error(`💥 Purchase error via ${provider.getDisplayName()}:`, error)
      throw error
    }
  }

  public async checkPlanAvailability(providerId: string, planId: string): Promise<boolean> {
    const provider = this.providers.get(providerId)
    return provider ? await provider.checkPlanAvailability(planId) : false
  }

  public getEnabledProviders(): string[] {
    return Array.from(this.providers.keys())
  }

  public getProviderInfo(providerId: string) {
    const provider = this.providers.get(providerId)
    return provider ? {
      id: providerId,
      name: provider.getName(),
      displayName: provider.getDisplayName(),
      enabled: provider.isEnabled()
    } : null
  }

  private calculatePopularity(plan: ProviderPlan): number {
    // Simple popularity calculation based on data/price ratio and features
    const dataToPrice = plan.dataInMB / plan.price
    const featureBonus = plan.features.length * 0.1
    const networkBonus = plan.network.type.includes('5G') ? 0.5 : 0
    
    return Math.round((dataToPrice + featureBonus + networkBonus) * 10) / 10
  }

  private isFeaturedPlan(plan: ProviderPlan, providerName: string): boolean {
    // Mark plans as featured based on various criteria
    // 1. High data/price ratio (good value)
    const dataToPrice = plan.dataInMB / plan.price
    const valueThreshold = 150 // MB per dollar
    
    // 2. Common travel durations (7, 14, 30 days)
    const popularDurations = [7, 14, 30]
    
    // 3. Good data amounts (1GB+)
    const minimumDataMB = 1000
    
    // 4. In stock and affordable
    const maxPrice = 50
    
    // 5. Has good features
    const hasGoodFeatures = plan.features.some(feature => 
      feature.toLowerCase().includes('unlimited') ||
      feature.toLowerCase().includes('5g') ||
      feature.toLowerCase().includes('hotspot')
    )
    
    return (
      plan.inStock &&
      plan.price <= maxPrice &&
      plan.dataInMB >= minimumDataMB &&
      dataToPrice >= valueThreshold &&
      popularDurations.includes(plan.days) &&
      (hasGoodFeatures || dataToPrice >= 200) // Either has good features or excellent value
    )
  }

  private deduplicatePlans(plans: EnhancedPlan[]): EnhancedPlan[] {
    const planMap = new Map<string, EnhancedPlan>()
    
    plans.forEach(plan => {
      // Create a unique key based on country, data amount, and validity period
      const key = `${plan.countryCode.toLowerCase()}-${plan.dataInMB}-${plan.days}`
      
      // Check if we already have a plan for this combination
      const existingPlan = planMap.get(key)
      
      if (!existingPlan || plan.price < existingPlan.price) {
        // Keep this plan if it's new or cheaper than the existing one
        planMap.set(key, plan)
      }
    })
    
    return Array.from(planMap.values())
  }

  private sortPlans(plans: EnhancedPlan[], sortBy: string, sortOrder: 'asc' | 'desc'): EnhancedPlan[] {
    return plans.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'price':
          comparison = a.price - b.price
          break
        case 'data':
          comparison = a.dataInMB - b.dataInMB
          break
        case 'days':
          comparison = a.days - b.days
          break
        case 'popularity':
          comparison = a.popularity - b.popularity
          break
        default:
          comparison = 0
      }

      return sortOrder === 'desc' ? -comparison : comparison
    })
  }

  public async refreshPlanCache(): Promise<void> {
    console.log('🔄 Refreshing plan cache for all providers...')
    // In a real application, you might implement caching here
    // For now, this is just a placeholder for future caching implementation
  }

  public getHealthStatus() {
    const enabledCount = this.providers.size
    const totalCount = 3 // Total number of configured providers
    
    return {
      initialized: this.initialized,
      enabledProviders: enabledCount,
      totalProviders: totalCount,
      healthPercentage: Math.round((enabledCount / totalCount) * 100),
      providers: Array.from(this.providers.entries()).map(([id, provider]) => ({
        id,
        name: provider.getDisplayName(),
        enabled: provider.isEnabled(),
        lastActivity: new Date().toISOString()
      }))
    }
  }
}

// Create singleton instance
export const providerManager = new ProviderManager() 
 
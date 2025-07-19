// Base Provider Class for eSIM Services

export interface ProviderPlan {
  id: string
  country: string
  countryCode: string
  region?: string
  flag?: string
  data: string
  dataInMB: number
  days: number
  price: number
  currency: string
  network: {
    type: string // "4G", "5G", "4G/5G"
    carriers: string[]
    coverage: string // "National", "Urban", "Nationwide"
  }
  features: string[]
  inStock: boolean
  promoApplied?: {
    id: string
    originalPrice: number
    savings: number
  }
}

export interface PurchaseRequest {
  planId: string
  customerEmail: string
  customerName: string
  deviceInfo?: {
    deviceType: string
    os: string
    model?: string
  }
}

export interface PurchaseResponse {
  success: boolean
  orderId: string
  qrCodeUrl?: string
  activationCode?: string
  instructions: string[]
  estimatedActivationTime: string
  expiresAt: Date
  error?: string
}

export interface ProviderConfig {
  name: string
  displayName: string
  apiKey: string
  apiSecret?: string
  baseUrl: string
  enabled: boolean
  rateLimits: {
    requestsPerMinute: number
    requestsPerHour: number
  }
  markup?: {
    percentage: number
    fixedAmount: number
  }
}

export abstract class BaseProvider {
  protected config: ProviderConfig
  protected lastRequest: Date = new Date(0)
  protected requestCount: number = 0

  constructor(config: ProviderConfig) {
    this.config = config
  }

  abstract getName(): string
  abstract getDisplayName(): string
  abstract fetchPlans(countryCode?: string): Promise<ProviderPlan[]>
  abstract purchasePlan(request: PurchaseRequest): Promise<PurchaseResponse>
  abstract checkPlanAvailability(planId: string): Promise<boolean>
  abstract validatePlan(planId: string): Promise<boolean>

  protected async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    // Rate limiting
    await this.handleRateLimit()

    const url = `${this.config.baseUrl}${endpoint}`
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.config.apiKey}`,
      ...options.headers
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return response.json()
    } catch (error) {
      console.error(`Request failed for ${url}:`, error)
      throw error
    }
  }

  private async handleRateLimit(): Promise<void> {
    const now = new Date()
    const timeSinceLastRequest = now.getTime() - this.lastRequest.getTime()
    const minInterval = 60000 / this.config.rateLimits.requestsPerMinute // ms between requests

    if (timeSinceLastRequest < minInterval) {
      const waitTime = minInterval - timeSinceLastRequest
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }

    this.lastRequest = now
    this.requestCount++
  }

  protected generateMockQRCode(data: string): string {
    // Generate a mock QR code URL for testing
    const encodedData = encodeURIComponent(data)
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedData}`
  }

  protected validateConfig(): boolean {
    return !!(
      this.config.apiKey && 
      this.config.baseUrl && 
      this.config.enabled
    )
  }

  public isEnabled(): boolean {
    return this.config.enabled && this.validateConfig()
  }

  public getConfig(): ProviderConfig {
    return { ...this.config }
  }

  protected convertUsdToEur(usdPrice: number): number {
    // USD to EUR conversion rate (approximately 1 USD = 0.92 EUR)
    const conversionRate = 0.92;
    return Math.round(usdPrice * conversionRate * 100) / 100;
  }

  protected applyMarkup(price: number): number {
    // Start with the base price (already in EUR from CSV)
    let finalPrice = price;
    
    // Apply 10% markup
    finalPrice *= 1.10;
    
    // Add €2 fixed profit
    finalPrice += 2.00;
    
    // Round to 2 decimal places
    return Math.round(finalPrice * 100) / 100;
  }

  protected shouldExcludePlan(plan: ProviderPlan): boolean {
    // Exclude overpriced plans (over €80 after markup)
    const finalPrice = this.applyMarkup(plan.price);
    if (finalPrice > 80) return true;
    
    // Exclude plans with unusual durations (check ID for duration indicators)
    if (plan.id.includes('180Days') || plan.id.includes('365Days') || plan.id.includes('1Year') || 
        plan.id.includes('_50_180') || plan.id.includes('_1_365')) return true;
    
    // Exclude specific problematic plan IDs/slugs
    const excludedPatterns = [
      'PE_10_30', // Peru 10GB €84.15
      'BO_20_30', // Bolivia 20GB €99
      'PE_20_30', // Peru 20GB €98
      'MU_20_30', // Mauritius 20GB €94
      'AE_50_180', // UAE 50GB 180Days €105
      '_50_180', // Any 50GB 180-day plans
      '_1_365', // Any 1GB 365-day plans
      'GL-139_1_365', // Global 139 1GB 365Days
      'GL-120_1_365' // Global 120 1GB 365Days
    ];
    
    // Check if plan ID contains any excluded pattern
    for (const pattern of excludedPatterns) {
      if (plan.id.includes(pattern)) return true;
    }
    
    return false;
  }

  protected transformPlan(plan: ProviderPlan): ProviderPlan {
    return {
      ...plan,
      price: this.applyMarkup(plan.price)
    };
  }
} 
 
 
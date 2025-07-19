// eSIM Access Provider Implementation
import { BaseProvider, ProviderPlan, PurchaseRequest, PurchaseResponse } from './base-provider'

interface EsimAccessConfig {
  name: string
  displayName: string
  apiKey: string // RT-AccessCode
  apiSecret?: string // Not directly used by eSIM Access for auth, but kept for consistency
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

export class EsimAccessProvider extends BaseProvider {
  protected config: EsimAccessConfig

  constructor(config: EsimAccessConfig) {
    super(config)
    this.config = config
  }

  getName(): string {
    return this.config.name
  }

  getDisplayName(): string {
    return this.config.displayName
  }

  isEnabled(): boolean {
    return this.config.enabled
  }

  async fetchPlans(countryCode?: string): Promise<ProviderPlan[]> {
    try {
      const realPlans = await this.fetchFromEsimAccessAPI(countryCode)
      if (realPlans && realPlans.length > 0) {
        return realPlans
      }
      
      // If API returns empty results, log warning and return empty array
      console.warn('eSIM Access API returned no plans for country:', countryCode)
      return []
    } catch (error) {
      console.error('eSIM Access API call failed:', error)
      
      // No fallbacks - if API fails, return empty array
      console.error('eSIM Access API failed, no plans available')
      return []
    }
  }

  async purchasePlan(request: PurchaseRequest): Promise<PurchaseResponse> {
    try {
      console.log('Processing manual eSIM delivery order:', request)
      
      // For manual delivery, we don't need to actually provision the eSIM
      // Just create a pending order that will be fulfilled manually
      
      const orderId = `MANUAL-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
      
      console.log('Manual order created:', {
        orderId,
        planId: request.planId,
        customerEmail: request.customerEmail,
        customerName: request.customerName
      })

      // Return success response for manual processing
      return {
        success: true,
        orderId: orderId,
        qrCodeUrl: '', // No QR code - will be sent manually
        activationCode: '', // No activation code - will be sent manually
        instructions: [
          'Your eSIM order has been confirmed!',
          'You will receive your eSIM activation details via email within 10-15 minutes.',
          'Please check your email (including spam folder) for delivery.',
          'If you don\'t receive it within 15 minutes, please contact our support team.',
          'Thank you for your purchase!'
        ],
        estimatedActivationTime: '10-15 minutes via email',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      }
    } catch (error) {
      console.error('Failed to purchase plan from eSIM Access:', error)
      
      // Log detailed error for debugging
      console.error('eSIM Access Purchase Error Details:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        config: {
          baseUrl: this.config.baseUrl,
          hasApiKey: !!this.config.apiKey,
          enabled: this.config.enabled
        }
      })
      
      // Always return failure - no fallbacks, purchase must fail if eSIM provisioning fails
      return {
        success: false,
        error: error instanceof Error ? error.message : 'eSIM provisioning failed',
        orderId: `EA-FAILED-${Date.now()}`,
        instructions: [],
        estimatedActivationTime: 'N/A',
        expiresAt: new Date()
      }
    }
  }

  async checkPlanAvailability(planId: string): Promise<boolean> {
    try {
      // Extract the actual package code from our prefixed ID
      const packageCode = planId.replace('ea-', '')
      
      const headers = {
        'RT-AccessCode': this.config.apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }

      // Use the correct endpoint for checking availability
      const url = `${this.config.baseUrl}/open/package/list`
      const requestBody = {
        locationCode: "",
        type: "",
        slug: "",
        packageCode: packageCode,
        iccid: ""
      }

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(10000)
      })

      if (!response.ok) {
        console.error('Failed to check plan availability:', response.status, response.statusText)
        return false
      }

      const data = await response.json()
      
      if (!data.success) {
        console.error('eSIM Access availability check failed:', data.errorMsg || data.errorCode)
        return false
      }

      // Check if the specific package exists and is available
      const packages = data.obj?.packageList || []
      const targetPackage = packages.find((pkg: any) => pkg.packageCode === packageCode)
      
      return targetPackage && targetPackage.inStock !== false
    } catch (error) {
      console.error('Failed to check plan availability:', error)
      return false
    }
  }

  async validatePlan(planId: string): Promise<boolean> {
    try {
      // For eSIM Access, validation is the same as availability check
      return await this.checkPlanAvailability(planId)
    } catch (error) {
      console.error('Failed to validate plan:', error)
      return false
    }
  }

  private async fetchFromEsimAccessAPI(countryCode?: string): Promise<ProviderPlan[]> {
    const headers = {
      'RT-AccessCode': this.config.apiKey,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }

    try {
      // Try to get package list using the working API endpoint
      const packagesUrl = `${this.config.baseUrl}/open/package/list`
      
      const packagesResponse = await fetch(packagesUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          locationCode: countryCode || "",
          type: "",
          slug: "",
          packageCode: "",
          iccid: ""
        }),
        signal: AbortSignal.timeout(10000)
      })

      if (!packagesResponse.ok) {
        throw new Error(`Failed to fetch packages: ${packagesResponse.status}`)
      }

      const packagesData = await packagesResponse.json()
      console.log('eSIM Access packages response:', JSON.stringify(packagesData, null, 2))
      
      if (packagesData.success && packagesData.obj?.packageList) {
        return this.transformEsimAccessResponse(packagesData)
      } else {
        console.warn('No packages found in eSIM Access response')
        return []
      }
      
    } catch (error) {
      console.error('Failed to fetch eSIM Access packages:', error)
      throw error
    }
  }

  private transformEsimAccessResponse(data: any): ProviderPlan[] {
    if (!data || !data.obj || !data.obj.packageList) {
      console.warn('eSIM Access API response missing packageList:', data)
      return []
    }

    const packages = data.obj.packageList
    console.log(`Processing ${packages.length} packages from eSIM Access`)

    return packages.map((pkg: any) => {
      // Extract data quota and convert from bytes to MB
      const dataQuotaBytes = pkg.volume || pkg.dataQuota || 0 // 'volume' is the data quota in bytes
      let dataInMB = dataQuotaBytes > 0 ? Math.round(dataQuotaBytes / (1024 * 1024)) : 0
      
      // If no data quota found, try to extract from name or description
      if (dataInMB === 0 && pkg.name) {
        const nameMatch = pkg.name.match(/(\d+(?:\.\d+)?)\s*(GB|MB)/i)
        if (nameMatch) {
          const amount = parseFloat(nameMatch[1])
          const unit = nameMatch[2].toUpperCase()
          if (unit === 'GB') {
            dataInMB = amount * 1024
          } else if (unit === 'MB') {
            dataInMB = amount
          }
        }
      }
      
      // Extract pricing - different providers use different pricing formats
      // Try multiple price fields and formats
      let priceUsd = 0
      
      if (pkg.retailPrice) {
        // If retailPrice is in cents (divide by 100) or in 1/100 cents (divide by 10000)
        priceUsd = pkg.retailPrice > 10000 ? pkg.retailPrice / 10000 : pkg.retailPrice / 100
      } else if (pkg.price) {
        // If price is in cents (divide by 100) or in 1/100 cents (divide by 10000)
        priceUsd = pkg.price > 10000 ? pkg.price / 10000 : pkg.price / 100
      } else if (pkg.priceUsd) {
        // If already in USD
        priceUsd = pkg.priceUsd
      } else if (pkg.cost) {
        // Alternative cost field
        priceUsd = pkg.cost > 10000 ? pkg.cost / 10000 : pkg.cost / 100
      }
      
      // Ensure minimum price
      if (priceUsd < 0.01) {
        priceUsd = 1.99 // Default minimum price
      }
      
      // Extract location information
      const locationNetwork = pkg.locationNetworkList && pkg.locationNetworkList[0]
      const countryName = locationNetwork?.locationName || pkg.name?.split(' ')[0] || 'Unknown'
      const countryCode = pkg.location || locationNetwork?.locationCode || 'WW'
      
      // Extract validity period
      const validityDays = pkg.duration || pkg.validityDays || pkg.days || 7 // Default to 7 days if not specified
      
      // Extract network information
      const networkType = pkg.speed || '4G/5G'
      const carriers = locationNetwork?.operatorList 
        ? locationNetwork.operatorList.map((op: any) => op.operatorName).filter(Boolean)
        : ['eSIM Access Network']

      // Map country to region and flag
      const regionInfo = this.getRegionInfo(countryCode, countryName)

      // Apply markup
      const finalPrice = this.applyMarkup(priceUsd)

      const plan: ProviderPlan = {
        id: `ea-${pkg.packageCode || pkg.slug}`,
        country: countryName,
        countryCode: countryCode.toUpperCase(),
        region: regionInfo.region,
        flag: regionInfo.flag,
        data: dataInMB > 1024 ? `${Math.round(dataInMB / 1024)}GB` : `${dataInMB}MB`,
        dataInMB,
        days: validityDays,
        price: finalPrice,
        currency: 'USD',
        network: {
          type: networkType,
          carriers,
          coverage: 'Nationwide'
        },
        features: [
          'Data only',
          'Instant activation',
          '24/7 Support',
          ...(pkg.smsStatus === 1 ? ['SMS included'] : []),
          ...(pkg.favorite ? ['Popular choice'] : [])
        ],
        inStock: true, // eSIM Access doesn't provide stock status, assume available
        promoApplied: undefined
      }

      // Log individual plan for debugging
      console.log(`Transformed plan: ${plan.id} - ${plan.country} ${plan.data} for ${plan.days} days at $${plan.price} (original: $${priceUsd})`)
      
      return plan
    }).filter((plan: ProviderPlan) => {
      // Filter out plans with invalid data
      const isValid = plan.dataInMB > 0 && plan.days > 0 && plan.price > 0
      if (!isValid) {
        console.warn(`Filtered out invalid plan: ${plan.id}`)
      }
      return isValid
    })
  }

  private getRegionInfo(countryCode: string, countryName: string): { region: string; flag: string } {
    // Handle multi-country plans
    if (countryCode.includes(',')) {
      return { region: 'Multi-Country', flag: '🌍' }
    }

    // Country to region mapping
    const regionMap: Record<string, { region: string; flag: string }> = {
      // Europe
      'ES': { region: 'Europe', flag: '🇪🇸' },
      'FR': { region: 'Europe', flag: '🇫🇷' },
      'IT': { region: 'Europe', flag: '🇮🇹' },
      'DE': { region: 'Europe', flag: '🇩🇪' },
      'GB': { region: 'Europe', flag: '🇬🇧' },
      'NL': { region: 'Europe', flag: '🇳🇱' },
      'PT': { region: 'Europe', flag: '🇵🇹' },
      'BE': { region: 'Europe', flag: '🇧🇪' },
      'AT': { region: 'Europe', flag: '🇦🇹' },
      'CH': { region: 'Europe', flag: '🇨🇭' },
      'SE': { region: 'Europe', flag: '🇸🇪' },
      'NO': { region: 'Europe', flag: '🇳🇴' },
      'DK': { region: 'Europe', flag: '🇩🇰' },
      'FI': { region: 'Europe', flag: '🇫🇮' },
      'IS': { region: 'Europe', flag: '🇮🇸' },
      'IE': { region: 'Europe', flag: '🇮🇪' },
      'PL': { region: 'Europe', flag: '🇵🇱' },
      'CZ': { region: 'Europe', flag: '🇨🇿' },
      'SK': { region: 'Europe', flag: '🇸🇰' },
      'HU': { region: 'Europe', flag: '🇭🇺' },
      'RO': { region: 'Europe', flag: '🇷🇴' },
      'BG': { region: 'Europe', flag: '🇧🇬' },
      'HR': { region: 'Europe', flag: '🇭🇷' },
      'SI': { region: 'Europe', flag: '🇸🇮' },
      'EE': { region: 'Europe', flag: '🇪🇪' },
      'LV': { region: 'Europe', flag: '🇱🇻' },
      'LT': { region: 'Europe', flag: '🇱🇹' },
      'MT': { region: 'Europe', flag: '🇲🇹' },
      'CY': { region: 'Europe', flag: '🇨🇾' },
      'LU': { region: 'Europe', flag: '🇱🇺' },
      'TR': { region: 'Europe', flag: '🇹🇷' },
      'GR': { region: 'Europe', flag: '🇬🇷' },
      'RS': { region: 'Europe', flag: '🇷🇸' },
      'MK': { region: 'Europe', flag: '🇲🇰' },
      'UA': { region: 'Europe', flag: '🇺🇦' },
      'RU': { region: 'Europe', flag: '🇷🇺' },
      
      // North America
      'US': { region: 'North America', flag: '🇺🇸' },
      'CA': { region: 'North America', flag: '🇨🇦' },
      'MX': { region: 'North America', flag: '🇲🇽' },
      
      // Asia Pacific
      'JP': { region: 'Asia Pacific', flag: '🇯🇵' },
      'KR': { region: 'Asia Pacific', flag: '🇰🇷' },
      'CN': { region: 'Asia Pacific', flag: '🇨🇳' },
      'HK': { region: 'Asia Pacific', flag: '🇭🇰' },
      'TW': { region: 'Asia Pacific', flag: '🇹🇼' },
      'SG': { region: 'Asia Pacific', flag: '🇸🇬' },
      'MY': { region: 'Asia Pacific', flag: '🇲🇾' },
      'TH': { region: 'Asia Pacific', flag: '🇹🇭' },
      'VN': { region: 'Asia Pacific', flag: '🇻🇳' },
      'PH': { region: 'Asia Pacific', flag: '🇵🇭' },
      'ID': { region: 'Asia Pacific', flag: '🇮🇩' },
      'IN': { region: 'Asia Pacific', flag: '🇮🇳' },
      'AU': { region: 'Asia Pacific', flag: '🇦🇺' },
      'NZ': { region: 'Asia Pacific', flag: '🇳🇿' },
      
      // Middle East & Africa
      'AE': { region: 'Middle East & Africa', flag: '🇦🇪' },
      'SA': { region: 'Middle East & Africa', flag: '🇸🇦' },
      'IL': { region: 'Middle East & Africa', flag: '🇮🇱' },
      'EG': { region: 'Middle East & Africa', flag: '🇪🇬' },
      'ZA': { region: 'Middle East & Africa', flag: '🇿🇦' },
      'KE': { region: 'Middle East & Africa', flag: '🇰🇪' },
      'NG': { region: 'Middle East & Africa', flag: '🇳🇬' },
      'MA': { region: 'Middle East & Africa', flag: '🇲🇦' },
      'TN': { region: 'Middle East & Africa', flag: '🇹🇳' },
      
      // South America
      'BR': { region: 'South America', flag: '🇧🇷' },
      'AR': { region: 'South America', flag: '🇦🇷' },
      'CL': { region: 'South America', flag: '🇨🇱' },
      'CO': { region: 'South America', flag: '🇨🇴' },
      'PE': { region: 'South America', flag: '🇵🇪' },
      'UY': { region: 'South America', flag: '🇺🇾' },
    }

    return regionMap[countryCode.toUpperCase()] || { region: 'Other', flag: '🌍' }
  }

} 
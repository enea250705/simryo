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
    const packageCode = request.planId.replace(/^ea-/, '')
    const transactionId = `SIMRYO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const headers = {
      'RT-AccessCode': this.config.apiKey,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }

    const pendingResponse: PurchaseResponse = {
      success: true,
      orderId: transactionId,
      qrCodeUrl: '',
      activationCode: '',
      instructions: [
        'Your order is confirmed and payment received!',
        'Your eSIM activation details will be sent to your email within 10-15 minutes.',
        'Please check your inbox and spam folder.',
        'If not received within 15 minutes, contact support.'
      ],
      estimatedActivationTime: '10-15 minutes via email',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }

    try {
      // Get wholesale price for this package
      const pkgRes = await fetch(`${this.config.baseUrl}/open/package/list`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ locationCode: '', type: '', slug: '', packageCode, iccid: '' }),
        signal: AbortSignal.timeout(10000)
      })
      const pkgData = await pkgRes.json()
      const pkg = pkgData?.obj?.packageList?.[0]
      if (!pkg) {
        console.error('Package not found:', packageCode)
        return pendingResponse
      }

      const orderPayload = {
        transactionId,
        packageInfoList: [{ packageCode, count: 1, price: pkg.price }],
        amount: pkg.price
      }

      const orderRes = await fetch(`${this.config.baseUrl}/open/esim/order`, {
        method: 'POST',
        headers,
        body: JSON.stringify(orderPayload),
        signal: AbortSignal.timeout(30000)
      })
      const orderData = await orderRes.json()

      if (orderData.success) {
        // Order placed — query for ICCID/QR code
        const orderNo = orderData.obj?.orderNo
        console.log('eSIM Access order placed:', orderNo)

        try {
          const queryRes = await fetch(`${this.config.baseUrl}/open/esim/query`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ orderNo, iccid: '', pager: { pageNum: 1, pageSize: 10 } }),
            signal: AbortSignal.timeout(15000)
          })
          const queryData = await queryRes.json()
          const esim = queryData?.obj?.esimList?.[0]

          return {
            success: true,
            orderId: orderNo || transactionId,
            qrCodeUrl: esim?.qrCodeUrl || esim?.ac || '',
            activationCode: esim?.iccid || esim?.ac || '',
            instructions: [
              'Your eSIM is ready!',
              'Scan the QR code below with your device or use the activation code.',
              'Make sure your device supports eSIM before activating.'
            ],
            estimatedActivationTime: 'Immediate',
            expiresAt: new Date(Date.now() + (pkg.duration || 30) * 24 * 60 * 60 * 1000)
          }
        } catch {
          // Order placed but query failed — treat as pending
          console.warn('Order placed but profile query failed, marking pending:', orderNo)
          return { ...pendingResponse, orderId: orderNo || transactionId }
        }

      } else if (orderData.errorCode === '200007') {
        // Insufficient balance — payment goes through, eSIM fulfilled manually
        console.warn('eSIM Access insufficient balance — order queued for manual fulfillment:', transactionId)
        return pendingResponse

      } else {
        console.error('eSIM Access order error:', orderData.errorCode, orderData.errorMsg)
        return pendingResponse
      }

    } catch (error) {
      console.error('eSIM Access purchase error (falling back to pending):', error)
      return pendingResponse
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
        signal: AbortSignal.timeout(30000)
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
      
      if (pkg.price) {
        // Use wholesale price (pkg.price), not retailPrice — we apply our own markup
        priceUsd = pkg.price > 10000 ? pkg.price / 10000 : pkg.price / 100
      } else if (pkg.retailPrice) {
        priceUsd = pkg.retailPrice > 10000 ? pkg.retailPrice / 10000 : pkg.retailPrice / 100
      } else if (pkg.priceUsd) {
        priceUsd = pkg.priceUsd
      } else if (pkg.cost) {
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

      // Convert USD to EUR first, then apply markup
      const priceEur = this.convertUsdToEur(priceUsd)
      const finalPrice = this.applyMarkup(priceEur)
      
      // Create promotion: current price becomes "15% off" price
      const originalPriceForPromo = finalPrice / 0.85 // Calculate what original price would be for 15% discount
      const savings = originalPriceForPromo - finalPrice

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
        currency: 'EUR',
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
        promoApplied: {
          id: 'summer-sale-2024',
          originalPrice: originalPriceForPromo,
          savings: savings
        }
      }

      // Log individual plan for debugging
      console.log(`Transformed plan: ${plan.id} - ${plan.country} ${plan.data} for ${plan.days} days at €${plan.price} (original: $${priceUsd}, converted: €${priceEur})`)
      
      return plan
    }).filter((plan: ProviderPlan) => {
      // Filter out plans with invalid data
      const isValid = plan.dataInMB > 0 && plan.days > 0 && plan.price > 0
      if (!isValid) {
        console.warn(`Filtered out invalid plan: ${plan.id}`)
        return false
      }
      
      // Filter out problematic plans
      if (this.shouldExcludePlan(plan)) {
        console.warn(`Filtered out problematic plan: ${plan.id} - ${plan.country} ${plan.data} (Price: €${plan.price})`)
        return false
      }
      
      return true
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
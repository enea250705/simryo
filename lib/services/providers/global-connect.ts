// Global Connect Provider Implementation
import { BaseProvider, ProviderConfig, ProviderPlan, PurchaseRequest, PurchaseResponse } from './base-provider'

export class GlobalConnectProvider extends BaseProvider {
  constructor(config: ProviderConfig) {
    super(config)
  }

  getName(): string {
    return this.config.name
  }

  getDisplayName(): string {
    return this.config.displayName
  }

  async fetchPlans(countryCode?: string): Promise<ProviderPlan[]> {
    try {
      // In production, this would make a real API call to Global Connect
      // For now, return mock data with filtering
      const mockPlans = this.getMockPlans(countryCode)
      return mockPlans.filter(plan => !this.shouldExcludePlan(plan))
    } catch (error) {
      console.error('Failed to fetch plans from Global Connect:', error)
      return []
    }
  }

  async purchasePlan(request: PurchaseRequest): Promise<PurchaseResponse> {
    try {
      // In production, this would make a real API call to Global Connect
      // For now, return mock success response
      return {
        success: true,
        orderId: `GC-${Date.now()}`,
        qrCodeUrl: 'https://example.com/qr-code',
        activationCode: 'GLOBAL-1234-5678',
        instructions: [
          'Download the eSIM QR code',
          'Go to your phone settings',
          'Add cellular plan',
          'Scan the QR code'
        ],
        estimatedActivationTime: '1-2 minutes',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
      }
    } catch (error) {
      console.error('Failed to purchase plan from Global Connect:', error)
      return {
        success: false,
        orderId: '',
        error: 'Failed to process purchase',
        instructions: [],
        estimatedActivationTime: 'N/A',
        expiresAt: new Date()
      }
    }
  }

  async checkPlanAvailability(planId: string): Promise<boolean> {
    try {
      // In production, this would check real-time availability
      // For now, return mock availability
      return true
    } catch (error) {
      console.error('Failed to check plan availability:', error)
      return false
    }
  }

  async validatePlan(planId: string): Promise<boolean> {
    try {
      // In production, this would validate the plan against Global Connect API
      // For now, return mock validation
      return true
    } catch (error) {
      console.error('Failed to validate plan:', error)
      return false
    }
  }

  private getMockPlans(countryCode?: string): ProviderPlan[] {
    // Return mock plans for development/testing
    return [
      {
        id: 'gc-us-1',
        country: 'United States',
        countryCode: 'US',
        data: '4GB',
        dataInMB: 4000,
        days: 30,
        price: 27.99,
        currency: 'EUR',
        network: {
          type: '4G/5G',
          carriers: ['AT&T', 'T-Mobile'],
          coverage: 'Nationwide'
        },
        features: [
          'Data only',
          'No contract required',
          'Instant activation',
          'Multi-carrier support'
        ],
        inStock: true
      },
      {
        id: 'gc-us-2',
        country: 'United States',
        countryCode: 'US',
        data: '12GB',
        dataInMB: 12000,
        days: 30,
        price: 44.99,
        currency: 'EUR',
        network: {
          type: '4G/5G',
          carriers: ['AT&T', 'T-Mobile', 'Verizon'],
          coverage: 'Nationwide'
        },
        features: [
          'Data only',
          'No contract required',
          'Instant activation',
          'Multi-carrier support',
          'Premium support'
        ],
        inStock: true
      }
    ].filter(plan => !countryCode || plan.countryCode === countryCode)
  }
} 
 
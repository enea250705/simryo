// Plan Types and Interfaces

export interface ProviderConfig {
  name: string
  apiKey: string
  baseUrl: string
  enabled: boolean
  features: string[]
  rateLimits?: {
    requestsPerMinute: number
    requestsPerHour: number
  }
}

export interface PlanProvider {
  id: string
  name: string
  displayName: string
  apiKey: string
  apiSecret?: string
  baseUrl: string
  enabled: boolean
  features: string[]
  countries: string[]
  rateLimits?: {
    requestsPerMinute: number
    requestsPerHour: number
  }
}

export interface PlanData {
  id: string
  country: string
  countryCode: string
  flag: string
  region: string
  data: string
  dataInMB: number
  days: number
  price: number
  originalPrice?: number
  currency: string
  popular: boolean
  featured: boolean
  provider: {
    id: string
    name: string
    displayName: string
    apiKey: string
  }
  features: string[]
  network: {
    type: string // "4G", "5G", "4G/5G"
    carriers: string[]
    coverage: string // "National", "Urban", "Nationwide"
  }
  activation: {
    method: string // "QR Code", "Manual", "Automatic"
    timeToActivate: string // "Instant", "1-5 minutes", etc.
  }
  restrictions?: {
    dataSpeedLimit?: string
    hotspotAllowed: boolean
    voiceCallsAllowed: boolean
    smsAllowed: boolean
  }
  availability: {
    inStock: boolean
    lastUpdated: Date
    validUntil?: Date
  }
  metadata: {
    createdAt: Date
    updatedAt: Date
    version: number
  }
}

export interface Country {
  id: number
  name: string
  code: string
  flag: string
  region: string
  timezone: string
  currency: string
  plans: PlanData[]
  availability: {
    providersAvailable: string[]
    totalPlans: number
    lastUpdated: Date
  }
}

export interface PlanPurchaseRequest {
  planId: string
  countryCode: string
  providerId: string
  quantity: number
  customerInfo: {
    email: string
    name: string
    phone?: string
  }
  deviceInfo?: {
    deviceType: string
    os: string
    model?: string
  }
}

export interface PlanPurchaseResponse {
  success: boolean
  orderId: string
  qrCodeUrl?: string
  activationCode?: string
  instructions: string[]
  estimatedActivationTime: string
  expiresAt: Date
  error?: string
}

export interface ProviderResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  rateLimitRemaining?: number
  rateLimitReset?: Date
}

export interface PlanAvailabilityCheck {
  planId: string
  available: boolean
  currentPrice: number
  currency: string
  inStock: boolean
  lastChecked: Date
}

export enum ProviderType {
  ESIM_ACCESS = 'esim-access',
  SIMIFY_DIRECT = 'simify-direct', 
  GLOBAL_CONNECT = 'global-connect',
  AIRALO = 'airalo',
  NOMAD = 'nomad'
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  timestamp: Date
  requestId?: string
} 
 
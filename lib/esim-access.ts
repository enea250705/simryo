interface ESIMAccessPlan {
  id: string
  name: string
  country: string
  countryCode: string
  dataAmount: number
  days: number
  price: number
  currency: string
}

interface ESIMAccessResponse {
  success: boolean
  data?: {
    iccid: string
    qr_code_url: string
    activation_code: string
    plan_details: ESIMAccessPlan
  }
  error?: string
}

interface ProvisionESIMRequest {
  planId: string
  userId: string
  userEmail: string
  quantity?: number
}

export class ESIMAccessAPI {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.ESIM_ACCESS_API_KEY || ''
    this.baseUrl = process.env.ESIM_ACCESS_BASE_URL || 'https://api.esimaccess.com/v1'
    
    if (!this.apiKey) {
      console.warn('ESIM_ACCESS_API_KEY not found in environment variables')
    }
  }

  private async makeRequest(endpoint: string, method: string = 'GET', body?: any): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`
    
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    }

    const config: RequestInit = {
      method,
      headers,
    }

    if (body && method !== 'GET') {
      config.body = JSON.stringify(body)
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error(`ESIM Access API error (${endpoint}):`, error)
      throw error
    }
  }

  async getPlans(): Promise<ESIMAccessPlan[]> {
    try {
      const response = await this.makeRequest('/plans')
      return response.data || []
    } catch (error) {
      console.error('Failed to fetch plans from eSIM Access:', error)
      return []
    }
  }

  async provisionESIM(request: ProvisionESIMRequest): Promise<ESIMAccessResponse> {
    try {
      const response = await this.makeRequest('/esims/provision', 'POST', {
        plan_id: request.planId,
        customer_email: request.userEmail,
        quantity: request.quantity || 1,
        metadata: {
          user_id: request.userId,
          platform: 'simryo'
        }
      })

      return {
        success: true,
        data: {
          iccid: response.data.iccid,
          qr_code_url: response.data.qr_code_url,
          activation_code: response.data.activation_code,
          plan_details: response.data.plan_details
        }
      }
    } catch (error) {
      console.error('Failed to provision eSIM:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async getESIMStatus(iccid: string): Promise<any> {
    try {
      const response = await this.makeRequest(`/esims/${iccid}/status`)
      return response
    } catch (error) {
      console.error('Failed to get eSIM status:', error)
      throw error
    }
  }

  async getESIMUsage(iccid: string): Promise<any> {
    try {
      const response = await this.makeRequest(`/esims/${iccid}/usage`)
      return response
    } catch (error) {
      console.error('Failed to get eSIM usage:', error)
      throw error
    }
  }

  // Mock implementation for development/testing
  async provisionESIMMock(request: ProvisionESIMRequest): Promise<ESIMAccessResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const mockICCID = `890010${Date.now()}${Math.random().toString(36).substring(2, 8)}`
    const mockActivationCode = `ACT${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    
    return {
      success: true,
      data: {
        iccid: mockICCID,
        qr_code_url: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(mockActivationCode)}`,
        activation_code: mockActivationCode,
        plan_details: {
          id: request.planId,
          name: 'Mock Plan',
          country: 'United States',
          countryCode: 'US',
          dataAmount: 1024,
          days: 7,
          price: 4.99,
          currency: 'USD'
        }
      }
    }
  }
}

// Export singleton instance
export const esimAccessAPI = new ESIMAccessAPI() 
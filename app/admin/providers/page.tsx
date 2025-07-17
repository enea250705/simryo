"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { 
  Wifi,
  Settings,
  Activity,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  BarChart3,
  DollarSign,
  Users,
  Globe
} from "lucide-react"
import { toast } from 'sonner'

interface Provider {
  id: string
  name: string
  displayName: string
  enabled: boolean
  apiKey: string
  baseUrl: string
  status: 'online' | 'offline' | 'error'
  lastActivity: string
  stats: {
    orders: number
    revenue: number
    successRate: number
    avgResponseTime: number
  }
  rateLimits: {
    requestsPerMinute: number
    requestsPerHour: number
    currentUsage: number
  }
  countries: string[]
  features: string[]
}

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProvider, setEditingProvider] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Provider>>({})

  useEffect(() => {
    loadProviders()
  }, [])

  const loadProviders = async () => {
    try {
      setLoading(true)
      
      // Get provider health status
      const response = await fetch('/api/providers')
      const data = await response.json()
      
      // Generate mock detailed provider data
      const mockProviders: Provider[] = [
        {
          id: 'esim-access',
          name: 'esim-access',
          displayName: 'eSIM Access',
          enabled: true,
          apiKey: 'ea_live_abc123...',
          baseUrl: 'https://api.esimaccess.com',
          status: 'online',
          lastActivity: '2024-01-15T10:30:00Z',
          stats: {
            orders: 654,
            revenue: 18234.56,
            successRate: 98.5,
            avgResponseTime: 245
          },
          rateLimits: {
            requestsPerMinute: 30,
            requestsPerHour: 1000,
            currentUsage: 12
          },
          countries: ['US', 'GB', 'JP', 'DE', 'FR', 'ES', 'IT', 'NL'],
          features: ['QR Code Generation', 'Instant Activation', 'Voice Calls', 'SMS Support']
        },
        {
          id: 'simify-direct',
          name: 'simify-direct',
          displayName: 'Simify Direct',
          enabled: true,
          apiKey: 'sd_live_def456...',
          baseUrl: 'https://api.simifydirect.com',
          status: 'online',
          lastActivity: '2024-01-15T10:25:00Z',
          stats: {
            orders: 523,
            revenue: 15678.90,
            successRate: 97.2,
            avgResponseTime: 312
          },
          rateLimits: {
            requestsPerMinute: 20,
            requestsPerHour: 800,
            currentUsage: 8
          },
          countries: ['US', 'GB', 'DE', 'FR', 'ES', 'IT', 'BE', 'NL', 'CH'],
          features: ['5G Networks', 'EU Roaming', 'Data Rollover', 'Premium Support']
        },
        {
          id: 'global-connect',
          name: 'global-connect',
          displayName: 'GlobalConnect',
          enabled: true,
          apiKey: 'gc_live_ghi789...',
          baseUrl: 'https://api.globalconnect.com',
          status: 'online',
          lastActivity: '2024-01-15T10:28:00Z',
          stats: {
            orders: 670,
            revenue: 21456.78,
            successRate: 99.1,
            avgResponseTime: 189
          },
          rateLimits: {
            requestsPerMinute: 25,
            requestsPerHour: 1200,
            currentUsage: 15
          },
          countries: ['US', 'GB', 'JP', 'DE', 'FR', 'ES', 'IT', 'NL', 'CH', 'AT', 'SE', 'NO', 'DK', 'FI'],
          features: ['Global Coverage', 'Multi-carrier', 'Business Plans', 'Priority Network']
        }
      ]

      setProviders(mockProviders)
      
    } catch (error) {
      console.error('Error loading providers:', error)
      toast.error('Failed to load provider data')
    } finally {
      setLoading(false)
    }
  }

  const toggleProvider = async (providerId: string, enabled: boolean) => {
    try {
      // In a real app, this would call an API to update the provider status
      setProviders(prev => prev.map(p => 
        p.id === providerId ? { ...p, enabled } : p
      ))
      
      toast.success(`Provider ${enabled ? 'enabled' : 'disabled'} successfully`)
    } catch (error) {
      toast.error('Failed to update provider status')
    }
  }

  const startEditing = (provider: Provider) => {
    setEditingProvider(provider.id)
    setEditForm({
      displayName: provider.displayName,
      apiKey: provider.apiKey,
      baseUrl: provider.baseUrl
    })
  }

  const saveProvider = async () => {
    if (!editingProvider) return

    try {
      // In a real app, this would call an API to update the provider
      setProviders(prev => prev.map(p => 
        p.id === editingProvider 
          ? { ...p, ...editForm }
          : p
      ))
      
      setEditingProvider(null)
      setEditForm({})
      toast.success('Provider updated successfully')
    } catch (error) {
      toast.error('Failed to update provider')
    }
  }

  const cancelEditing = () => {
    setEditingProvider(null)
    setEditForm({})
  }

  const testProvider = async (providerId: string) => {
    try {
      toast.info('Testing provider connection...')
      
      // Simulate API test
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Update provider status
      setProviders(prev => prev.map(p => 
        p.id === providerId 
          ? { ...p, status: 'online' as const, lastActivity: new Date().toISOString() }
          : p
      ))
      
      toast.success('Provider connection test successful')
    } catch (error) {
      toast.error('Provider connection test failed')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800'
      case 'offline': return 'bg-gray-100 text-gray-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="h-4 w-4" />
      case 'offline': return <Clock className="h-4 w-4" />
      case 'error': return <AlertCircle className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Provider Management</h1>
          <p className="text-gray-600">Configure and monitor eSIM providers</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={loadProviders} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Provider
          </Button>
        </div>
      </div>

      {/* Provider Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Wifi className="h-8 w-8 text-emerald-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Providers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {providers.filter(p => p.enabled).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {providers.reduce((sum, p) => sum + p.stats.orders, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${providers.reduce((sum, p) => sum + p.stats.revenue, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(providers.reduce((sum, p) => sum + p.stats.successRate, 0) / providers.length).toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Provider Cards */}
      <div className="space-y-6">
        {providers.map((provider) => (
          <Card key={provider.id} className="overflow-hidden">
            <CardHeader className="bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-4 h-4 rounded-full ${provider.status === 'online' ? 'bg-green-500' : provider.status === 'error' ? 'bg-red-500' : 'bg-gray-400'}`} />
                  <div>
                    <CardTitle className="text-xl">{provider.displayName}</CardTitle>
                    <p className="text-sm text-gray-600">{provider.id}</p>
                  </div>
                  <Badge className={getStatusColor(provider.status)}>
                    {getStatusIcon(provider.status)}
                    <span className="ml-1 capitalize">{provider.status}</span>
                  </Badge>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`provider-${provider.id}`} className="text-sm">
                      {provider.enabled ? 'Enabled' : 'Disabled'}
                    </Label>
                    <Switch
                      id={`provider-${provider.id}`}
                      checked={provider.enabled}
                      onCheckedChange={(checked) => toggleProvider(provider.id, checked)}
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => testProvider(provider.id)}
                  >
                    Test Connection
                  </Button>
                  {editingProvider === provider.id ? (
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={saveProvider}>
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEditing}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEditing(provider)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Configuration */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Configuration</h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`name-${provider.id}`}>Display Name</Label>
                      {editingProvider === provider.id ? (
                        <Input
                          id={`name-${provider.id}`}
                          value={editForm.displayName || ''}
                          onChange={(e) => setEditForm({...editForm, displayName: e.target.value})}
                        />
                      ) : (
                        <Input
                          id={`name-${provider.id}`}
                          value={provider.displayName}
                          disabled
                        />
                      )}
                    </div>
                    <div>
                      <Label htmlFor={`api-${provider.id}`}>API Key</Label>
                      {editingProvider === provider.id ? (
                        <Input
                          id={`api-${provider.id}`}
                          type="password"
                          value={editForm.apiKey || ''}
                          onChange={(e) => setEditForm({...editForm, apiKey: e.target.value})}
                        />
                      ) : (
                        <Input
                          id={`api-${provider.id}`}
                          type="password"
                          value={provider.apiKey}
                          disabled
                        />
                      )}
                    </div>
                    <div>
                      <Label htmlFor={`url-${provider.id}`}>Base URL</Label>
                      {editingProvider === provider.id ? (
                        <Input
                          id={`url-${provider.id}`}
                          value={editForm.baseUrl || ''}
                          onChange={(e) => setEditForm({...editForm, baseUrl: e.target.value})}
                        />
                      ) : (
                        <Input
                          id={`url-${provider.id}`}
                          value={provider.baseUrl}
                          disabled
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Performance Statistics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{provider.stats.orders.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Total Orders</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">${provider.stats.revenue.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Revenue</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{provider.stats.successRate}%</div>
                      <div className="text-sm text-gray-600">Success Rate</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{provider.stats.avgResponseTime}ms</div>
                      <div className="text-sm text-gray-600">Avg Response</div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Rate Limits */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Rate Limits</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Per Minute:</span>
                      <span>{provider.rateLimits.currentUsage}/{provider.rateLimits.requestsPerMinute}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-emerald-600 h-2 rounded-full" 
                        style={{ width: `${(provider.rateLimits.currentUsage / provider.rateLimits.requestsPerMinute) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {provider.rateLimits.requestsPerHour} requests per hour limit
                    </div>
                  </div>
                </div>

                {/* Countries */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Supported Countries</h4>
                  <div className="flex flex-wrap gap-1">
                    {provider.countries.slice(0, 8).map((country) => (
                      <Badge key={country} variant="outline" className="text-xs">
                        {country}
                      </Badge>
                    ))}
                    {provider.countries.length > 8 && (
                      <Badge variant="outline" className="text-xs">
                        +{provider.countries.length - 8} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Features</h4>
                  <div className="space-y-1">
                    {provider.features.map((feature) => (
                      <div key={feature} className="flex items-center text-sm">
                        <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 text-xs text-gray-500">
                Last activity: {new Date(provider.lastActivity).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
 
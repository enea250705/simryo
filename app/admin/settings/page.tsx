"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { 
  Settings,
  Save,
  RefreshCw,
  Mail,
  Bell,
  Shield,
  Globe,
  DollarSign,
  Database,
  Key,
  AlertTriangle,
  CheckCircle,
  Upload,
  Download
} from "lucide-react"
import { toast } from 'sonner'

interface SystemSettings {
  general: {
    siteName: string
    siteDescription: string
    supportEmail: string
    defaultCurrency: string
    timezone: string
    maintenanceMode: boolean
  }
  notifications: {
    emailNotifications: boolean
    orderNotifications: boolean
    lowStockAlerts: boolean
    systemAlerts: boolean
    newsletterEnabled: boolean
  }
  payment: {
    stripePublishableKey: string
    stripeSecretKey: string
    paypalClientId: string
    paypalClientSecret: string
    minimumOrderAmount: number
    taxRate: number
  }
  security: {
    twoFactorAuth: boolean
    sessionTimeout: number
    maxLoginAttempts: number
    requireStrongPasswords: boolean
    allowedIPs: string
  }
  api: {
    rateLimitEnabled: boolean
    requestsPerMinute: number
    requestsPerHour: number
    apiKeyExpiration: number
  }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      
      // Generate mock settings data
      const mockSettings: SystemSettings = {
        general: {
          siteName: "SIMRYO",
          siteDescription: "Global eSIM marketplace for travelers",
          supportEmail: "info@simryo.com",
          defaultCurrency: "USD",
          timezone: "UTC",
          maintenanceMode: false
        },
        notifications: {
          emailNotifications: true,
          orderNotifications: true,
          lowStockAlerts: true,
          systemAlerts: true,
          newsletterEnabled: false
        },
        payment: {
          stripePublishableKey: "pk_test_...",
          stripeSecretKey: "sk_test_...",
          paypalClientId: "",
          paypalClientSecret: "",
          minimumOrderAmount: 5.00,
          taxRate: 0.08
        },
        security: {
          twoFactorAuth: false,
          sessionTimeout: 30,
          maxLoginAttempts: 5,
          requireStrongPasswords: true,
          allowedIPs: ""
        },
        api: {
          rateLimitEnabled: true,
          requestsPerMinute: 60,
          requestsPerHour: 1000,
          apiKeyExpiration: 365
        }
      }

      setSettings(mockSettings)
      
    } catch (error) {
      console.error('Error loading settings:', error)
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    if (!settings) return

    try {
      setSaving(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Settings saved successfully')
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = (section: keyof SystemSettings, key: string, value: any) => {
    if (!settings) return

    setSettings(prev => ({
      ...prev!,
      [section]: {
        ...prev![section],
        [key]: value
      }
    }))
  }

  const exportSettings = () => {
    if (!settings) return

    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `simryo-settings-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success('Settings exported successfully')
  }

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'payment', name: 'Payment', icon: DollarSign },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'api', name: 'API', icon: Database }
  ]

  if (loading || !settings) {
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
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600">Configure your SIMRYO marketplace</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={exportSettings} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={saveSettings} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700">
            {saving ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <tab.icon className={`mr-3 h-4 w-4 ${
                      activeTab === tab.id ? 'text-emerald-500' : 'text-gray-400'
                    }`} />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          {/* General Settings */}
          {activeTab === 'general' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  General Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      value={settings.general.siteName}
                      onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="supportEmail">Support Email</Label>
                    <Input
                      id="supportEmail"
                      type="email"
                      value={settings.general.supportEmail}
                      onChange={(e) => updateSetting('general', 'supportEmail', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea
                    id="siteDescription"
                    value={settings.general.siteDescription}
                    onChange={(e) => updateSetting('general', 'siteDescription', e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="defaultCurrency">Default Currency</Label>
                    <Select
                      value={settings.general.defaultCurrency}
                      onValueChange={(value) => updateSetting('general', 'defaultCurrency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={settings.general.timezone}
                      onValueChange={(value) => updateSetting('general', 'timezone', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                        <SelectItem value="Europe/London">London</SelectItem>
                        <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                    <p className="text-sm text-gray-500">Temporarily disable the site for maintenance</p>
                  </div>
                  <Switch
                    id="maintenanceMode"
                    checked={settings.general.maintenanceMode}
                    onCheckedChange={(checked) => updateSetting('general', 'maintenanceMode', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notification Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-gray-500">Send email notifications for important events</p>
                    </div>
                    <Switch
                      checked={settings.notifications.emailNotifications}
                      onCheckedChange={(checked) => updateSetting('notifications', 'emailNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Order Notifications</Label>
                      <p className="text-sm text-gray-500">Notify when new orders are placed</p>
                    </div>
                    <Switch
                      checked={settings.notifications.orderNotifications}
                      onCheckedChange={(checked) => updateSetting('notifications', 'orderNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Low Stock Alerts</Label>
                      <p className="text-sm text-gray-500">Alert when inventory is running low</p>
                    </div>
                    <Switch
                      checked={settings.notifications.lowStockAlerts}
                      onCheckedChange={(checked) => updateSetting('notifications', 'lowStockAlerts', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>System Alerts</Label>
                      <p className="text-sm text-gray-500">Notify about system issues and updates</p>
                    </div>
                    <Switch
                      checked={settings.notifications.systemAlerts}
                      onCheckedChange={(checked) => updateSetting('notifications', 'systemAlerts', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Newsletter</Label>
                      <p className="text-sm text-gray-500">Enable newsletter functionality</p>
                    </div>
                    <Switch
                      checked={settings.notifications.newsletterEnabled}
                      onCheckedChange={(checked) => updateSetting('notifications', 'newsletterEnabled', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Settings */}
          {activeTab === 'payment' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Payment Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Stripe Configuration</h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="stripePublishableKey">Publishable Key</Label>
                      <Input
                        id="stripePublishableKey"
                        type="password"
                        value={settings.payment.stripePublishableKey}
                        onChange={(e) => updateSetting('payment', 'stripePublishableKey', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="stripeSecretKey">Secret Key</Label>
                      <Input
                        id="stripeSecretKey"
                        type="password"
                        value={settings.payment.stripeSecretKey}
                        onChange={(e) => updateSetting('payment', 'stripeSecretKey', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">PayPal Configuration</h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="paypalClientId">Client ID</Label>
                      <Input
                        id="paypalClientId"
                        type="password"
                        value={settings.payment.paypalClientId}
                        onChange={(e) => updateSetting('payment', 'paypalClientId', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="paypalClientSecret">Client Secret</Label>
                      <Input
                        id="paypalClientSecret"
                        type="password"
                        value={settings.payment.paypalClientSecret}
                        onChange={(e) => updateSetting('payment', 'paypalClientSecret', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Order Settings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="minimumOrderAmount">Minimum Order Amount ($)</Label>
                      <Input
                        id="minimumOrderAmount"
                        type="number"
                        step="0.01"
                        value={settings.payment.minimumOrderAmount}
                        onChange={(e) => updateSetting('payment', 'minimumOrderAmount', parseFloat(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="taxRate">Tax Rate (%)</Label>
                      <Input
                        id="taxRate"
                        type="number"
                        step="0.01"
                        value={settings.payment.taxRate * 100}
                        onChange={(e) => updateSetting('payment', 'taxRate', parseFloat(e.target.value) / 100)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-500">Require 2FA for admin accounts</p>
                    </div>
                    <Switch
                      checked={settings.security.twoFactorAuth}
                      onCheckedChange={(checked) => updateSetting('security', 'twoFactorAuth', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Strong Password Requirements</Label>
                      <p className="text-sm text-gray-500">Enforce strong password policies</p>
                    </div>
                    <Switch
                      checked={settings.security.requireStrongPasswords}
                      onCheckedChange={(checked) => updateSetting('security', 'requireStrongPasswords', checked)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      value={settings.security.maxLoginAttempts}
                      onChange={(e) => updateSetting('security', 'maxLoginAttempts', parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="allowedIPs">Allowed IP Addresses</Label>
                  <Textarea
                    id="allowedIPs"
                    value={settings.security.allowedIPs}
                    onChange={(e) => updateSetting('security', 'allowedIPs', e.target.value)}
                    placeholder="Enter IP addresses separated by commas (leave empty to allow all)"
                    rows={3}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Restrict admin access to specific IP addresses for enhanced security
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* API Settings */}
          {activeTab === 'api' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  API Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Rate Limiting</Label>
                    <p className="text-sm text-gray-500">Enable API rate limiting to prevent abuse</p>
                  </div>
                  <Switch
                    checked={settings.api.rateLimitEnabled}
                    onCheckedChange={(checked) => updateSetting('api', 'rateLimitEnabled', checked)}
                  />
                </div>

                {settings.api.rateLimitEnabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="requestsPerMinute">Requests per Minute</Label>
                      <Input
                        id="requestsPerMinute"
                        type="number"
                        value={settings.api.requestsPerMinute}
                        onChange={(e) => updateSetting('api', 'requestsPerMinute', parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="requestsPerHour">Requests per Hour</Label>
                      <Input
                        id="requestsPerHour"
                        type="number"
                        value={settings.api.requestsPerHour}
                        onChange={(e) => updateSetting('api', 'requestsPerHour', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                )}

                <Separator />

                <div>
                  <Label htmlFor="apiKeyExpiration">API Key Expiration (days)</Label>
                  <Input
                    id="apiKeyExpiration"
                    type="number"
                    value={settings.api.apiKeyExpiration}
                    onChange={(e) => updateSetting('api', 'apiKeyExpiration', parseInt(e.target.value))}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Set to 0 for keys that never expire
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
                    <div>
                      <h5 className="font-medium text-yellow-800">API Security Notice</h5>
                      <p className="text-sm text-yellow-700 mt-1">
                        Make sure to use HTTPS in production and keep your API keys secure. 
                        Regularly rotate keys and monitor API usage for suspicious activity.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

 
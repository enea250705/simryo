"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ShoppingCart,
  Globe,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Target,
  Award
} from "lucide-react"
import { toast } from 'sonner'

interface AnalyticsData {
  revenue: {
    current: number
    previous: number
    growth: number
    daily: Array<{ date: string; amount: number }>
  }
  orders: {
    current: number
    previous: number
    growth: number
    daily: Array<{ date: string; count: number }>
  }
  customers: {
    current: number
    previous: number
    growth: number
    retention: number
  }
  topCountries: Array<{
    country: string
    countryCode: string
    orders: number
    revenue: number
    percentage: number
  }>
  topPlans: Array<{
    name: string
    orders: number
    revenue: number
    provider: string
  }>
  providerPerformance: Array<{
    name: string
    orders: number
    revenue: number
    successRate: number
    avgOrderValue: number
  }>
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30d")

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      
      // Generate mock analytics data
      const mockAnalytics: AnalyticsData = {
        revenue: {
          current: 45678.90,
          previous: 37234.56,
          growth: 22.7,
          daily: [
            { date: '2024-01-01', amount: 1234.56 },
            { date: '2024-01-02', amount: 1456.78 },
            { date: '2024-01-03', amount: 1678.90 },
            { date: '2024-01-04', amount: 1890.12 },
            { date: '2024-01-05', amount: 2012.34 },
            { date: '2024-01-06', amount: 1789.56 },
            { date: '2024-01-07', amount: 2234.78 }
          ]
        },
        orders: {
          current: 1847,
          previous: 1523,
          growth: 21.3,
          daily: [
            { date: '2024-01-01', count: 45 },
            { date: '2024-01-02', count: 52 },
            { date: '2024-01-03', count: 48 },
            { date: '2024-01-04', count: 61 },
            { date: '2024-01-05', count: 58 },
            { date: '2024-01-06', count: 43 },
            { date: '2024-01-07', count: 67 }
          ]
        },
        customers: {
          current: 892,
          previous: 743,
          growth: 20.1,
          retention: 78.5
        },
        topCountries: [
          { country: 'United States', countryCode: 'US', orders: 423, revenue: 12456.78, percentage: 35.2 },
          { country: 'United Kingdom', countryCode: 'GB', orders: 298, revenue: 8234.56, percentage: 24.1 },
          { country: 'Japan', countryCode: 'JP', orders: 187, revenue: 6789.12, percentage: 18.3 },
          { country: 'Germany', countryCode: 'DE', orders: 156, revenue: 4567.89, percentage: 12.8 },
          { country: 'France', countryCode: 'FR', orders: 134, revenue: 3456.78, percentage: 9.6 }
        ],
        topPlans: [
          { name: 'USA 3GB 15 days', orders: 234, revenue: 3041.66, provider: 'eSIM Access' },
          { name: 'UK 5GB 30 days', orders: 189, revenue: 3209.11, provider: 'Simify Direct' },
          { name: 'Japan 8GB 30 days', orders: 156, revenue: 3586.44, provider: 'GlobalConnect' },
          { name: 'Germany 6GB 30 days', orders: 134, revenue: 2544.66, provider: 'eSIM Access' },
          { name: 'France 4GB 21 days', orders: 123, revenue: 1720.77, provider: 'Simify Direct' }
        ],
        providerPerformance: [
          { name: 'eSIM Access', orders: 654, revenue: 18234.56, successRate: 98.5, avgOrderValue: 27.89 },
          { name: 'Simify Direct', orders: 523, revenue: 15678.90, successRate: 97.2, avgOrderValue: 29.98 },
          { name: 'GlobalConnect', orders: 670, revenue: 21456.78, successRate: 99.1, avgOrderValue: 32.02 }
        ]
      }

      setAnalytics(mockAnalytics)
      
    } catch (error) {
      console.error('Error loading analytics:', error)
      toast.error('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  const exportReport = () => {
    if (!analytics) return

    const reportData = {
      generatedAt: new Date().toISOString(),
      timeRange,
      summary: {
        revenue: analytics.revenue.current,
        orders: analytics.orders.current,
        customers: analytics.customers.current
      },
      topCountries: analytics.topCountries,
      topPlans: analytics.topPlans,
      providerPerformance: analytics.providerPerformance
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `simryo-analytics-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success('Analytics report exported successfully')
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

  if (!analytics) {
    return (
      <div className="p-8">
        <div className="text-center">
          <p className="text-gray-600">Failed to load analytics data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Business Analytics</h1>
          <p className="text-gray-600">Insights and performance metrics</p>
        </div>
        <div className="flex space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportReport} className="bg-emerald-600 hover:bg-emerald-700">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics.revenue.current)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {analytics.revenue.growth > 0 ? (
                <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              {formatPercentage(analytics.revenue.growth)} from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.orders.current.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {analytics.orders.growth > 0 ? (
                <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              {formatPercentage(analytics.orders.growth)} from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.customers.current.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {analytics.customers.growth > 0 ? (
                <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              {formatPercentage(analytics.customers.growth)} from last period
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Countries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Top Countries by Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topCountries.map((country, index) => (
                <div key={country.countryCode} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{country.country}</div>
                      <div className="text-sm text-gray-500">{country.orders} orders</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{formatCurrency(country.revenue)}</div>
                    <div className="text-sm text-gray-500">{country.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Plans */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Best Performing Plans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topPlans.map((plan, index) => (
                <div key={plan.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{plan.name}</div>
                      <div className="text-sm text-gray-500">{plan.provider} • {plan.orders} orders</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{formatCurrency(plan.revenue)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Provider Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="h-5 w-5 mr-2" />
            Provider Performance Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {analytics.providerPerformance.map((provider) => (
              <div key={provider.name} className="border rounded-lg p-4">
                <div className="text-lg font-bold mb-3">{provider.name}</div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Orders</span>
                    <span className="font-medium">{provider.orders.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Revenue</span>
                    <span className="font-medium">{formatCurrency(provider.revenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Success Rate</span>
                    <span className="font-medium">{provider.successRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Order Value</span>
                    <span className="font-medium">{formatCurrency(provider.avgOrderValue)}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-emerald-600 h-2 rounded-full" 
                      style={{ width: `${provider.successRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Revenue Trend Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Revenue Trend (Last 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">Chart visualization would be rendered here</p>
              <p className="text-sm text-gray-500">Consider integrating Chart.js or Recharts for interactive charts</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-7 gap-2">
            {analytics.revenue.daily.map((day, index) => (
              <div key={index} className="text-center">
                <div className="text-xs text-gray-500 mb-1">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="text-sm font-medium">{formatCurrency(day.amount)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Customer Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Customer Retention Rate</span>
                <span className="font-bold text-lg">{analytics.customers.retention}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-emerald-600 h-3 rounded-full" 
                  style={{ width: `${analytics.customers.retention}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-500">
                {analytics.customers.retention > 75 ? 'Excellent' : analytics.customers.retention > 60 ? 'Good' : 'Needs Improvement'} retention rate
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Performance Indicators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Average Order Value</span>
                <span className="font-bold">
                  {formatCurrency(analytics.revenue.current / analytics.orders.current)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Orders per Customer</span>
                <span className="font-bold">
                  {(analytics.orders.current / analytics.customers.current).toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Revenue per Customer</span>
                <span className="font-bold">
                  {formatCurrency(analytics.revenue.current / analytics.customers.current)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
 
 
 

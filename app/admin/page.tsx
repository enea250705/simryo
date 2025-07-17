"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  DollarSign, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  Globe, 
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  RefreshCw,
  Download,
  Settings,
  Eye,
  ArrowUp,
  ArrowDown,
  Wifi,
  Server
} from "lucide-react"
import Link from "next/link"
import { toast } from 'sonner'

interface DashboardStats {
  revenue: {
    total: number
    today: number
    thisMonth: number
    growth: number
  }
  orders: {
    total: number
    today: number
    pending: number
    completed: number
    failed: number
  }
  customers: {
    total: number
    new: number
    returning: number
  }
  providers: {
    active: number
    total: number
    healthPercentage: number
  }
  plans: {
    total: number
    mostPopular: string
    countries: number
  }
}

interface RecentOrder {
  id: string
  customer: string
  plan: string
  country: string
  amount: number
  status: 'completed' | 'pending' | 'failed'
  date: string
  provider: string
}

interface ProviderStatus {
  id: string
  name: string
  enabled: boolean
  orders: number
  revenue: number
  successRate: number
  lastActivity: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [providerStatus, setProviderStatus] = useState<ProviderStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Load provider health
      const providersResponse = await fetch('/api/providers')
      const providersData = await providersResponse.json()

      // Load plans data
      const plansResponse = await fetch('/api/plans')
      const plansData = await plansResponse.json()

      // Generate mock dashboard statistics
      const mockStats: DashboardStats = {
        revenue: {
          total: 45678.90,
          today: 1234.56,
          thisMonth: 12456.78,
          growth: 23.5
        },
        orders: {
          total: 1847,
          today: 23,
          pending: 5,
          completed: 1820,
          failed: 22
        },
        customers: {
          total: 892,
          new: 45,
          returning: 156
        },
        providers: {
          active: providersData.success ? providersData.data.health.enabledProviders : 0,
          total: providersData.success ? providersData.data.health.totalProviders : 0,
          healthPercentage: providersData.success ? providersData.data.health.healthPercentage : 0
        },
        plans: {
          total: plansData.success ? plansData.count : 0,
          mostPopular: "USA 3GB 15 days",
          countries: plansData.success ? new Set(plansData.data.map((p: any) => p.country)).size : 0
        }
      }

      // Generate mock recent orders
      const mockOrders: RecentOrder[] = [
        {
          id: "ORD-001",
          customer: "john.doe@email.com",
          plan: "USA 3GB 15 days",
          country: "United States",
          amount: 12.99,
          status: "completed",
          date: "2024-01-15T10:30:00Z",
          provider: "eSIM Access"
        },
        {
          id: "ORD-002", 
          customer: "jane.smith@email.com",
          plan: "UK 5GB 30 days",
          country: "United Kingdom",
          amount: 16.99,
          status: "pending",
          date: "2024-01-15T09:15:00Z",
          provider: "Simify Direct"
        },
        {
          id: "ORD-003",
          customer: "mike.wilson@email.com",
          plan: "Japan 8GB 30 days",
          country: "Japan",
          amount: 22.99,
          status: "completed",
          date: "2024-01-15T08:45:00Z",
          provider: "GlobalConnect"
        },
        {
          id: "ORD-004",
          customer: "sarah.johnson@email.com",
          plan: "Germany 6GB 30 days",
          country: "Germany",
          amount: 18.99,
          status: "failed",
          date: "2024-01-15T07:20:00Z",
          provider: "eSIM Access"
        },
        {
          id: "ORD-005",
          customer: "alex.brown@email.com",
          plan: "France 4GB 21 days",
          country: "France",
          amount: 13.99,
          status: "completed",
          date: "2024-01-15T06:10:00Z",
          provider: "Simify Direct"
        }
      ]

      // Generate mock provider status
      const mockProviderStatus: ProviderStatus[] = [
        {
          id: "esim-access",
          name: "eSIM Access",
          enabled: true,
          orders: 654,
          revenue: 18234.56,
          successRate: 98.5,
          lastActivity: "2024-01-15T10:30:00Z"
        },
        {
          id: "simify-direct", 
          name: "Simify Direct",
          enabled: true,
          orders: 523,
          revenue: 15678.90,
          successRate: 97.2,
          lastActivity: "2024-01-15T10:25:00Z"
        },
        {
          id: "global-connect",
          name: "GlobalConnect", 
          enabled: true,
          orders: 670,
          revenue: 21456.78,
          successRate: 99.1,
          lastActivity: "2024-01-15T10:28:00Z"
        }
      ]

      setStats(mockStats)
      setRecentOrders(mockOrders)
      setProviderStatus(mockProviderStatus)
      
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    setRefreshing(true)
    await loadDashboardData()
    setRefreshing(false)
    toast.success('Dashboard data refreshed')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      case 'failed': return <AlertCircle className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-emerald-600 mb-4" />
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your eSIM marketplace</p>
            </div>
            <div className="flex space-x-3">
              <Button 
                onClick={refreshData} 
                disabled={refreshing}
                variant="outline"
                className="flex items-center"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Link href="/admin/settings">
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats?.revenue.total.toLocaleString()}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                +{stats?.revenue.growth}% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.orders.total.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">
                {stats?.orders.today} orders today
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.customers.total.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">
                {stats?.customers.new} new this month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Provider Health</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.providers.healthPercentage}%</div>
              <div className="text-xs text-muted-foreground">
                {stats?.providers.active}/{stats?.providers.total} providers active
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <Link href="/admin/orders">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm">{order.id}</span>
                        <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{order.status}</span>
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">{order.customer}</div>
                      <div className="text-xs text-gray-500">{order.plan} • {order.provider}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm">${order.amount}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(order.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Provider Status */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Provider Performance</CardTitle>
              <Link href="/admin/providers">
                <Button variant="outline" size="sm">
                  <Server className="h-4 w-4 mr-2" />
                  Manage
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {providerStatus.map((provider) => (
                  <div key={provider.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${provider.enabled ? 'bg-green-500' : 'bg-red-500'}`} />
                      <div>
                        <div className="font-medium text-sm">{provider.name}</div>
                        <div className="text-xs text-gray-500">
                          {provider.orders} orders • {provider.successRate}% success
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm">${provider.revenue.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Revenue</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link href="/admin/orders">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex items-center p-6">
                <ShoppingCart className="h-8 w-8 text-emerald-600 mr-3" />
                <div>
                  <div className="font-medium">Manage Orders</div>
                  <div className="text-sm text-gray-500">View and process orders</div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/customers">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex items-center p-6">
                <Users className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <div className="font-medium">Customer Management</div>
                  <div className="text-sm text-gray-500">View customer data</div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/analytics">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex items-center p-6">
                <BarChart3 className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <div className="font-medium">Analytics</div>
                  <div className="text-sm text-gray-500">Business insights</div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/providers">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex items-center p-6">
                <Wifi className="h-8 w-8 text-orange-600 mr-3" />
                <div>
                  <div className="font-medium">Provider Settings</div>
                  <div className="text-sm text-gray-500">Configure providers</div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats?.plans.total}</div>
                <div className="text-sm text-gray-600">Active Plans</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats?.plans.countries}</div>
                <div className="text-sm text-gray-600">Countries Covered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats?.providers.active}</div>
                <div className="text-sm text-gray-600">Active Providers</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
 
 
 
 
 
 
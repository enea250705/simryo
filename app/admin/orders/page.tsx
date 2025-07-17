"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Search,
  Filter,
  Download,
  Eye,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  Calendar,
  User,
  Globe
} from "lucide-react"
import { toast } from 'sonner'

interface Order {
  id: string
  customer: {
    name: string
    email: string
    phone?: string
  }
  plan: {
    name: string
    data: string
    days: number
    country: string
    countryCode: string
  }
  provider: {
    id: string
    name: string
  }
  amount: number
  currency: string
  status: 'completed' | 'pending' | 'failed' | 'refunded'
  createdAt: string
  updatedAt: string
  qrCodeUrl?: string
  activationCode?: string
  notes?: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [providerFilter, setProviderFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [ordersPerPage] = useState(10)

  useEffect(() => {
    loadOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, searchTerm, statusFilter, providerFilter])

  const loadOrders = async () => {
    try {
      setLoading(true)
      
      // Generate mock orders data
      const mockOrders: Order[] = [
        {
          id: "ORD-2024-001",
          customer: {
            name: "John Doe",
            email: "john.doe@email.com",
            phone: "+1-555-0123"
          },
          plan: {
            name: "USA 3GB 15 days",
            data: "3GB",
            days: 15,
            country: "United States",
            countryCode: "US"
          },
          provider: {
            id: "esim-access",
            name: "eSIM Access"
          },
          amount: 12.99,
          currency: "USD",
          status: "completed",
          createdAt: "2024-01-15T10:30:00Z",
          updatedAt: "2024-01-15T10:32:00Z",
          qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=SIMRYO-ORDER-001",
          activationCode: "EA12345678"
        },
        {
          id: "ORD-2024-002",
          customer: {
            name: "Jane Smith",
            email: "jane.smith@email.com"
          },
          plan: {
            name: "UK 5GB 30 days",
            data: "5GB",
            days: 30,
            country: "United Kingdom",
            countryCode: "GB"
          },
          provider: {
            id: "simify-direct",
            name: "Simify Direct"
          },
          amount: 16.99,
          currency: "USD",
          status: "pending",
          createdAt: "2024-01-15T09:15:00Z",
          updatedAt: "2024-01-15T09:15:00Z"
        },
        {
          id: "ORD-2024-003",
          customer: {
            name: "Mike Wilson",
            email: "mike.wilson@email.com",
            phone: "+1-555-0456"
          },
          plan: {
            name: "Japan 8GB 30 days",
            data: "8GB",
            days: 30,
            country: "Japan",
            countryCode: "JP"
          },
          provider: {
            id: "global-connect",
            name: "GlobalConnect"
          },
          amount: 22.99,
          currency: "USD",
          status: "completed",
          createdAt: "2024-01-15T08:45:00Z",
          updatedAt: "2024-01-15T08:47:00Z",
          qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=SIMRYO-ORDER-003",
          activationCode: "GC87654321"
        },
        {
          id: "ORD-2024-004",
          customer: {
            name: "Sarah Johnson",
            email: "sarah.johnson@email.com"
          },
          plan: {
            name: "Germany 6GB 30 days",
            data: "6GB",
            days: 30,
            country: "Germany",
            countryCode: "DE"
          },
          provider: {
            id: "esim-access",
            name: "eSIM Access"
          },
          amount: 18.99,
          currency: "USD",
          status: "failed",
          createdAt: "2024-01-15T07:20:00Z",
          updatedAt: "2024-01-15T07:25:00Z",
          notes: "Payment failed - insufficient funds"
        },
        {
          id: "ORD-2024-005",
          customer: {
            name: "Alex Brown",
            email: "alex.brown@email.com"
          },
          plan: {
            name: "France 4GB 21 days",
            data: "4GB",
            days: 21,
            country: "France",
            countryCode: "FR"
          },
          provider: {
            id: "simify-direct",
            name: "Simify Direct"
          },
          amount: 13.99,
          currency: "USD",
          status: "completed",
          createdAt: "2024-01-15T06:10:00Z",
          updatedAt: "2024-01-15T06:12:00Z",
          qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=SIMRYO-ORDER-005",
          activationCode: "SD11223344"
        },
        {
          id: "ORD-2024-006",
          customer: {
            name: "Emma Davis",
            email: "emma.davis@email.com"
          },
          plan: {
            name: "Spain 2GB 14 days",
            data: "2GB",
            days: 14,
            country: "Spain",
            countryCode: "ES"
          },
          provider: {
            id: "global-connect",
            name: "GlobalConnect"
          },
          amount: 9.99,
          currency: "USD",
          status: "refunded",
          createdAt: "2024-01-14T15:30:00Z",
          updatedAt: "2024-01-15T10:00:00Z",
          notes: "Customer requested refund - travel cancelled"
        }
      ]

      setOrders(mockOrders)
      
    } catch (error) {
      console.error('Error loading orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const filterOrders = () => {
    let filtered = orders

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.plan.country.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    // Provider filter
    if (providerFilter !== "all") {
      filtered = filtered.filter(order => order.provider.id === providerFilter)
    }

    setFilteredOrders(filtered)
    setCurrentPage(1)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'refunded': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      case 'failed': return <AlertCircle className="h-4 w-4" />
      case 'refunded': return <RefreshCw className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const exportOrders = () => {
    const csvContent = [
      ['Order ID', 'Customer Name', 'Email', 'Plan', 'Country', 'Provider', 'Amount', 'Status', 'Date'].join(','),
      ...filteredOrders.map(order => [
        order.id,
        order.customer.name,
        order.customer.email,
        order.plan.country,
        order.plan.country,
        order.provider.name,
        `$${order.amount}`,
        order.status,
        new Date(order.createdAt).toLocaleDateString()
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `simryo-orders-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success('Orders exported successfully')
  }

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder)
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

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
          <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-gray-600">Manage and track all eSIM orders</p>
        </div>
        <Button onClick={exportOrders} className="bg-emerald-600 hover:bg-emerald-700">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.status === 'completed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.status === 'failed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-emerald-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.amount, 0).toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            <Select value={providerFilter} onValueChange={setProviderFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Providers</SelectItem>
                <SelectItem value="esim-access">eSIM Access</SelectItem>
                <SelectItem value="simify-direct">Simify Direct</SelectItem>
                <SelectItem value="global-connect">GlobalConnect</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentOrders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="font-bold text-lg">{order.id}</span>
                      <Badge className={`${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status}</span>
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="flex items-center text-gray-600 mb-1">
                          <User className="h-4 w-4 mr-1" />
                          Customer
                        </div>
                        <div className="font-medium">{order.customer.name}</div>
                        <div className="text-gray-500">{order.customer.email}</div>
                      </div>
                      
                      <div>
                        <div className="flex items-center text-gray-600 mb-1">
                          <Globe className="h-4 w-4 mr-1" />
                          Plan
                        </div>
                        <div className="font-medium">{order.plan.country}</div>
                        <div className="text-gray-500">{order.plan.country}</div>
                      </div>
                      
                      <div>
                        <div className="flex items-center text-gray-600 mb-1">
                          <DollarSign className="h-4 w-4 mr-1" />
                          Amount
                        </div>
                        <div className="font-bold text-lg">${order.amount}</div>
                        <div className="text-gray-500">{order.provider.name}</div>
                      </div>
                      
                      <div>
                        <div className="flex items-center text-gray-600 mb-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          Date
                        </div>
                        <div className="font-medium">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-gray-500">
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>

                    {order.notes && (
                      <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                        <strong>Note:</strong> {order.notes}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    {order.qrCodeUrl && (
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        QR Code
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-700">
                Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length} orders
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
 
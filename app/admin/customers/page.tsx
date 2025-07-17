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
  User,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  ShoppingCart,
  MapPin,
  Star,
  TrendingUp
} from "lucide-react"
import { toast } from 'sonner'

interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  joinedAt: string
  lastOrderAt: string
  totalOrders: number
  totalSpent: number
  averageOrderValue: number
  status: 'active' | 'inactive' | 'vip'
  preferredCountries: string[]
  orders: Array<{
    id: string
    date: string
    amount: number
    plan: string
    country: string
    status: string
  }>
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("totalSpent")
  const [currentPage, setCurrentPage] = useState(1)
  const [customersPerPage] = useState(10)

  useEffect(() => {
    loadCustomers()
  }, [])

  useEffect(() => {
    filterCustomers()
  }, [customers, searchTerm, statusFilter, sortBy])

  const loadCustomers = async () => {
    try {
      setLoading(true)
      
      // Generate mock customer data
      const mockCustomers: Customer[] = [
        {
          id: "CUST-001",
          name: "John Doe",
          email: "john.doe@email.com",
          phone: "+1-555-0123",
          joinedAt: "2023-06-15T10:30:00Z",
          lastOrderAt: "2024-01-15T10:30:00Z",
          totalOrders: 8,
          totalSpent: 156.92,
          averageOrderValue: 19.62,
          status: "vip",
          preferredCountries: ["US", "GB", "JP"],
          orders: [
            { id: "ORD-2024-001", date: "2024-01-15T10:30:00Z", amount: 12.99, plan: "USA 3GB 15 days", country: "US", status: "completed" },
            { id: "ORD-2023-089", date: "2023-12-20T14:20:00Z", amount: 16.99, plan: "UK 5GB 30 days", country: "GB", status: "completed" }
          ]
        },
        {
          id: "CUST-002",
          name: "Jane Smith",
          email: "jane.smith@email.com",
          joinedAt: "2023-08-22T15:45:00Z",
          lastOrderAt: "2024-01-15T09:15:00Z",
          totalOrders: 5,
          totalSpent: 89.95,
          averageOrderValue: 17.99,
          status: "active",
          preferredCountries: ["GB", "FR", "DE"],
          orders: [
            { id: "ORD-2024-002", date: "2024-01-15T09:15:00Z", amount: 16.99, plan: "UK 5GB 30 days", country: "GB", status: "pending" }
          ]
        },
        {
          id: "CUST-003",
          name: "Mike Wilson",
          email: "mike.wilson@email.com",
          phone: "+1-555-0456",
          joinedAt: "2023-04-10T12:00:00Z",
          lastOrderAt: "2024-01-15T08:45:00Z",
          totalOrders: 12,
          totalSpent: 287.88,
          averageOrderValue: 23.99,
          status: "vip",
          preferredCountries: ["JP", "US", "DE"],
          orders: [
            { id: "ORD-2024-003", date: "2024-01-15T08:45:00Z", amount: 22.99, plan: "Japan 8GB 30 days", country: "JP", status: "completed" }
          ]
        },
        {
          id: "CUST-004",
          name: "Sarah Johnson",
          email: "sarah.johnson@email.com",
          joinedAt: "2023-11-05T09:30:00Z",
          lastOrderAt: "2024-01-15T07:20:00Z",
          totalOrders: 3,
          totalSpent: 45.97,
          averageOrderValue: 15.32,
          status: "active",
          preferredCountries: ["DE", "FR"],
          orders: [
            { id: "ORD-2024-004", date: "2024-01-15T07:20:00Z", amount: 18.99, plan: "Germany 6GB 30 days", country: "DE", status: "failed" }
          ]
        },
        {
          id: "CUST-005",
          name: "Alex Brown",
          email: "alex.brown@email.com",
          joinedAt: "2023-09-18T16:20:00Z",
          lastOrderAt: "2024-01-15T06:10:00Z",
          totalOrders: 6,
          totalSpent: 98.94,
          averageOrderValue: 16.49,
          status: "active",
          preferredCountries: ["FR", "ES", "IT"],
          orders: [
            { id: "ORD-2024-005", date: "2024-01-15T06:10:00Z", amount: 13.99, plan: "France 4GB 21 days", country: "FR", status: "completed" }
          ]
        },
        {
          id: "CUST-006",
          name: "Emma Davis",
          email: "emma.davis@email.com",
          joinedAt: "2023-12-01T11:15:00Z",
          lastOrderAt: "2024-01-14T15:30:00Z",
          totalOrders: 2,
          totalSpent: 23.98,
          averageOrderValue: 11.99,
          status: "inactive",
          preferredCountries: ["ES"],
          orders: [
            { id: "ORD-2024-006", date: "2024-01-14T15:30:00Z", amount: 9.99, plan: "Spain 2GB 14 days", country: "ES", status: "refunded" }
          ]
        }
      ]

      setCustomers(mockCustomers)
      
    } catch (error) {
      console.error('Error loading customers:', error)
      toast.error('Failed to load customer data')
    } finally {
      setLoading(false)
    }
  }

  const filterCustomers = () => {
    let filtered = customers

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(customer => customer.status === statusFilter)
    }

    // Sort customers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'totalSpent':
          return b.totalSpent - a.totalSpent
        case 'totalOrders':
          return b.totalOrders - a.totalOrders
        case 'joinedAt':
          return new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime()
        case 'lastOrderAt':
          return new Date(b.lastOrderAt).getTime() - new Date(a.lastOrderAt).getTime()
        default:
          return 0
      }
    })

    setFilteredCustomers(filtered)
    setCurrentPage(1)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'vip': return 'bg-purple-100 text-purple-800'
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'vip': return <Star className="h-4 w-4" />
      case 'active': return <TrendingUp className="h-4 w-4" />
      case 'inactive': return <User className="h-4 w-4" />
      default: return <User className="h-4 w-4" />
    }
  }

  const exportCustomers = () => {
    const csvContent = [
      ['Customer ID', 'Name', 'Email', 'Phone', 'Status', 'Total Orders', 'Total Spent', 'Joined Date'].join(','),
      ...filteredCustomers.map(customer => [
        customer.id,
        customer.name,
        customer.email,
        customer.phone || '',
        customer.status,
        customer.totalOrders,
        `$${customer.totalSpent}`,
        new Date(customer.joinedAt).toLocaleDateString()
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `simryo-customers-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success('Customer data exported successfully')
  }

  // Pagination
  const indexOfLastCustomer = currentPage * customersPerPage
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer)
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage)

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
          <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600">View and analyze customer data</p>
        </div>
        <Button onClick={exportCustomers} className="bg-emerald-600 hover:bg-emerald-700">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <User className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {customers.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">VIP Customers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {customers.filter(c => c.status === 'vip').length}
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
                <p className="text-sm font-medium text-gray-600">Avg Customer Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length).toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Orders per Customer</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(customers.reduce((sum, c) => sum + c.totalOrders, 0) / customers.length).toFixed(1)}
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
                  placeholder="Search customers..."
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
                <SelectItem value="vip">VIP</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="totalSpent">Total Spent</SelectItem>
                <SelectItem value="totalOrders">Total Orders</SelectItem>
                <SelectItem value="joinedAt">Join Date</SelectItem>
                <SelectItem value="lastOrderAt">Last Order</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customers ({filteredCustomers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentCustomers.map((customer) => (
              <div key={customer.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="font-bold text-lg">{customer.name}</span>
                      <Badge className={`${getStatusColor(customer.status)}`}>
                        {getStatusIcon(customer.status)}
                        <span className="ml-1 capitalize">{customer.status}</span>
                      </Badge>
                      {customer.status === 'vip' && (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <Star className="h-3 w-3 mr-1" />
                          VIP
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="flex items-center text-gray-600 mb-1">
                          <Mail className="h-4 w-4 mr-1" />
                          Contact
                        </div>
                        <div className="font-medium">{customer.email}</div>
                        {customer.phone && (
                          <div className="text-gray-500 flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {customer.phone}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <div className="flex items-center text-gray-600 mb-1">
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Orders & Spending
                        </div>
                        <div className="font-medium">{customer.totalOrders} orders</div>
                        <div className="text-gray-500">${customer.totalSpent.toFixed(2)} total</div>
                      </div>
                      
                      <div>
                        <div className="flex items-center text-gray-600 mb-1">
                          <DollarSign className="h-4 w-4 mr-1" />
                          Average Order
                        </div>
                        <div className="font-bold text-lg">${customer.averageOrderValue.toFixed(2)}</div>
                      </div>
                      
                      <div>
                        <div className="flex items-center text-gray-600 mb-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          Dates
                        </div>
                        <div className="font-medium">
                          Joined: {new Date(customer.joinedAt).toLocaleDateString()}
                        </div>
                        <div className="text-gray-500">
                          Last order: {new Date(customer.lastOrderAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Preferred Countries */}
                    <div className="mt-3">
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        Preferred Countries
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {customer.preferredCountries.map((country) => (
                          <Badge key={country} variant="outline" className="text-xs">
                            {country}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View Profile
                    </Button>
                    <Button variant="outline" size="sm">
                      <Mail className="h-4 w-4 mr-1" />
                      Contact
                    </Button>
                  </div>
                </div>

                {/* Recent Orders */}
                {customer.orders.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <h5 className="font-medium text-gray-900 mb-2">Recent Orders</h5>
                    <div className="space-y-2">
                      {customer.orders.slice(0, 2).map((order) => (
                        <div key={order.id} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                          <div className="flex items-center space-x-3">
                            <span className="font-medium">{order.id}</span>
                            <span>{order.plan}</span>
                            <Badge variant="outline" className="text-xs">
                              {order.country}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="font-medium">${order.amount}</span>
                            <span className="text-gray-500">
                              {new Date(order.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-700">
                Showing {indexOfFirstCustomer + 1} to {Math.min(indexOfLastCustomer, filteredCustomers.length)} of {filteredCustomers.length} customers
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
 
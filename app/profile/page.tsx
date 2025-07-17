"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  User, 
  Smartphone, 
  Download, 
  Calendar, 
  Globe, 
  Settings, 
  LogOut,
  Edit,
  Save,
  X,
  QrCode,
  Wifi,
  WifiOff,
  BarChart3,
  Clock,
  Shield,
  CreditCard,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  ExternalLink
} from "lucide-react"
import { toast } from "sonner"
import { ESIMQRModal } from "@/components/esim-qr-modal"

interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  joinDate: string
  totalEsims: number
  totalSpent: number
}

interface EsimData {
  id: string
  orderId: string
  country: string
  flag: string
  provider: string
  planName: string
  dataAmount: string
  dataUsed: string
  dataRemaining: string
  usagePercentage: number
  status: 'active' | 'inactive' | 'expired' | 'pending'
  activationDate: string
  expiryDate: string
  qrCodeUrl: string
  activationCode: string
  price: number
  currency: string
  autoRenew: boolean
  isRoaming: boolean
  lastUsed: string
  instructions: string[]
}

function ProfileContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [esims, setEsims] = useState<EsimData[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProfile, setEditingProfile] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', email: '' })
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [isQRModalOpen, setIsQRModalOpen] = useState(false)
  const [selectedEsim, setSelectedEsim] = useState<EsimData | null>(null)

  useEffect(() => {
    // Check for tab parameter in URL
    const tab = searchParams.get('tab')
    if (tab && ['overview', 'esims', 'account', 'settings'].includes(tab)) {
      setActiveTab(tab)
    }

    // Load user data and eSIMs (this will check auth)
    loadUserData()
  }, [router, searchParams])

  const loadUserData = async () => {
    try {
      // Check authentication and get user data
      const response = await fetch('/api/auth/me')
      const data = await response.json()
      
      if (data.success && data.user) {
        const profile: UserProfile = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          avatar: data.user.avatar,
          joinDate: data.user.createdAt || new Date().toISOString().split('T')[0],
          totalEsims: 0,
          totalSpent: 0
        }
        
        setUser(profile)
        setEditForm({ name: profile.name, email: profile.email })
        
        // After user is loaded, load their eSIMs
        loadUserEsims()
      } else {
        // User not authenticated, redirect to login
        router.push('/login')
      }
    } catch (error) {
      console.error('Failed to load user data:', error)
      toast.error('Please log in again')
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const loadUserEsims = async () => {
    try {
      setLoading(true)
      
      if (!user?.id) {
        setEsims([])
        return
      }
      
      // Fetch user's eSIMs from the API
      const response = await fetch(`/api/user/purchases?userId=${user.id}`)
      const data = await response.json()
      
      if (data.success) {
        // Transform API data to match our EsimData interface
        const transformedEsims: EsimData[] = data.purchases.map((purchase: any) => ({
          id: purchase.id,
          orderId: purchase.orderId,
          country: purchase.country,
          flag: purchase.flag,
          provider: purchase.provider,
          planName: purchase.planName,
          dataAmount: purchase.dataAmount,
          dataUsed: purchase.dataUsed,
          dataRemaining: purchase.dataRemaining,
          usagePercentage: purchase.usagePercentage,
          status: purchase.status,
          activationDate: purchase.activationDate,
          expiryDate: purchase.expiryDate,
          qrCodeUrl: purchase.qrCodeUrl,
          activationCode: purchase.activationCode,
          price: purchase.price,
          currency: purchase.currency,
          autoRenew: purchase.autoRenew,
          isRoaming: purchase.isRoaming,
          lastUsed: purchase.lastUsed,
          instructions: purchase.instructions
        }))
        
        setEsims(transformedEsims)
      } else {
        console.error('Failed to load purchases:', data.error)
        toast.error('Failed to load your eSIMs')
        setEsims([])
      }
    } catch (error) {
      console.error('Failed to load eSIMs:', error)
      toast.error('Failed to load your eSIMs')
      setEsims([])
    } finally {
      setLoading(false)
    }
  }

  const handleProfileUpdate = async () => {
    try {
      // In a real app, this would be an API call
      const updatedUser = { ...user, ...editForm }
      setUser(updatedUser as UserProfile)
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setEditingProfile(false)
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('Failed to update profile')
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      toast.success('Logged out successfully')
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Logout failed')
    }
  }

  const refreshEsimData = async (esimId: string) => {
    try {
      setRefreshing(true)
      // In a real app, this would call the provider API to get updated usage data
      toast.success('eSIM data refreshed')
    } catch (error) {
      toast.error('Failed to refresh eSIM data')
    } finally {
      setRefreshing(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'expired': return 'bg-red-500'
      case 'pending': return 'bg-yellow-500'
      case 'inactive': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Wifi className="h-4 w-4" />
      case 'expired': return <WifiOff className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      case 'inactive': return <WifiOff className="h-4 w-4" />
      default: return <WifiOff className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 pt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-2xl font-semibold text-gray-600">Loading your profile...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account and eSIMs</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="esims">My eSIMs</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Profile Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Profile Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="text-lg">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-500">Member since {new Date(user.joinDate).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-emerald-50 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-600">{user.totalEsims}</div>
                    <div className="text-sm text-gray-600">Total eSIMs</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">${user.totalSpent.toFixed(2)}</div>
                    <div className="text-sm text-gray-600">Total Spent</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{esims.filter(e => e.status === 'active').length}</div>
                    <div className="text-sm text-gray-600">Active eSIMs</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent eSIMs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Smartphone className="h-5 w-5 mr-2" />
                  Recent eSIMs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {esims.slice(0, 3).map((esim) => (
                    <div key={esim.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <span className="text-2xl">{esim.flag}</span>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{esim.country}</h3>
                          <Badge className={`${getStatusColor(esim.status)} text-white`}>
                            {esim.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{esim.planName}</p>
                        {esim.status === 'active' && (
                          <div className="mt-2">
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                              <span>Data Usage</span>
                              <span>{esim.dataUsed} / {esim.dataAmount}</span>
                            </div>
                            <Progress value={esim.usagePercentage} className="h-2" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="esims" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Smartphone className="h-5 w-5 mr-2" />
                    My eSIMs ({esims.length})
                  </div>
                  <Button onClick={() => loadUserEsims()} disabled={refreshing}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {esims.map((esim) => (
                    <Card key={esim.id} className="border-2">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">{esim.flag}</span>
                            <div>
                              <h3 className="font-semibold">{esim.country}</h3>
                              <p className="text-sm text-gray-600">{esim.provider}</p>
                            </div>
                          </div>
                          <Badge className={`${getStatusColor(esim.status)} text-white`}>
                            {getStatusIcon(esim.status)}
                            <span className="ml-1 capitalize">{esim.status}</span>
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Plan:</span>
                            <span className="font-medium">{esim.planName}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Price:</span>
                            <span className="font-medium">${esim.price}</span>
                          </div>
                          {esim.activationDate && (
                            <div className="flex justify-between text-sm">
                              <span>Activated:</span>
                              <span>{new Date(esim.activationDate).toLocaleDateString()}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-sm">
                            <span>Expires:</span>
                            <span>{new Date(esim.expiryDate).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {esim.status === 'active' && (
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span>Data Usage:</span>
                              <span>{esim.dataUsed} / {esim.dataAmount}</span>
                            </div>
                            <Progress value={esim.usagePercentage} className="h-2 mb-2" />
                            <div className="text-xs text-gray-500">
                              {esim.dataRemaining} remaining
                            </div>
                          </div>
                        )}

                        <Separator />

                        <div className="space-y-2">
                          <Button 
                            variant="outline" 
                            className="w-full" 
                            size="sm"
                            onClick={() => {
                              setSelectedEsim(esim)
                              setIsQRModalOpen(true)
                            }}
                          >
                            <QrCode className="h-4 w-4 mr-2" />
                            View QR Code
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full" 
                            size="sm"
                            onClick={() => {
                              setSelectedEsim(esim)
                              setIsQRModalOpen(true)
                            }}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Setup Instructions
                          </Button>
                          {esim.status === 'active' && (
                            <Button 
                              variant="outline" 
                              className="w-full" 
                              size="sm"
                              onClick={() => refreshEsimData(esim.id)}
                            >
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Refresh Data
                            </Button>
                          )}
                        </div>

                        <div className="text-xs text-gray-500">
                          Order ID: {esim.orderId}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Account Information
                  </div>
                  {!editingProfile ? (
                    <Button onClick={() => setEditingProfile(true)} variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="space-x-2">
                      <Button onClick={handleProfileUpdate} size="sm">
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button onClick={() => setEditingProfile(false)} variant="outline" size="sm">
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    {editingProfile ? (
                      <Input
                        id="name"
                        value={editForm.name}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      />
                    ) : (
                      <div className="p-2 border rounded-md bg-gray-50">{user.name}</div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    {editingProfile ? (
                      <Input
                        id="email"
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                      />
                    ) : (
                      <div className="p-2 border rounded-md bg-gray-50">{user.email}</div>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-semibold mb-2">Account Statistics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="font-bold text-lg">{user.totalEsims}</div>
                      <div className="text-sm text-gray-600">Total eSIMs</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="font-bold text-lg">${user.totalSpent.toFixed(2)}</div>
                      <div className="text-sm text-gray-600">Total Spent</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="font-bold text-lg">{esims.filter(e => e.status === 'active').length}</div>
                      <div className="text-sm text-gray-600">Active eSIMs</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="font-bold text-lg">{new Date(user.joinDate).getFullYear()}</div>
                      <div className="text-sm text-gray-600">Member Since</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-gray-600">Receive updates about your eSIMs</p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Auto-Renewal</h3>
                      <p className="text-sm text-gray-600">Automatically renew expiring eSIMs</p>
                    </div>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Data Usage Alerts</h3>
                      <p className="text-sm text-gray-600">Get notified when approaching data limits</p>
                    </div>
                    <Button variant="outline" size="sm">Set Alerts</Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Privacy Settings</h3>
                      <p className="text-sm text-gray-600">Control your data and privacy preferences</p>
                    </div>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="pt-4">
                  <Button onClick={handleLogout} variant="destructive" className="w-full">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* eSIM QR Modal */}
      <ESIMQRModal
        isOpen={isQRModalOpen}
        onClose={() => {
          setIsQRModalOpen(false)
          setSelectedEsim(null)
        }}
        esimData={selectedEsim ? {
          iccid: selectedEsim.id,
          qrCodeUrl: selectedEsim.qrCodeUrl,
          activationCode: selectedEsim.activationCode,
          planName: selectedEsim.planName,
          country: selectedEsim.country,
          dataAmount: selectedEsim.dataAmount,
          days: Math.ceil((new Date(selectedEsim.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
          price: selectedEsim.price,
          currency: selectedEsim.currency,
          expiresAt: selectedEsim.expiryDate
        } : null}
      />
    </div>
  )
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="p-8"><div className="flex items-center justify-center h-64"><RefreshCw className="h-8 w-8 animate-spin text-emerald-600" /></div></div>}>
      <ProfileContent />
    </Suspense>
  )
} 
 
 
 
 
 
 
 
 
 
 
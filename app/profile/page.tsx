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
  RefreshCw,
  ExternalLink
} from "lucide-react"
import { toast } from "sonner"
import { ESIMQRModal } from "@/components/esim-qr-modal"
import { useAuth } from "@/lib/serverless-auth"

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
  const { user: authUser, loading: authLoading, signOut } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [esims, setEsims] = useState<EsimData[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProfile, setEditingProfile] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', email: '' })
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [isQRModalOpen, setIsQRModalOpen] = useState(false)
  const [selectedEsim, setSelectedEsim] = useState<EsimData | null>(null)

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && ['overview', 'esims', 'account', 'settings'].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  useEffect(() => {
    if (authLoading) return
    if (!authUser) {
      router.push('/login')
      return
    }
    loadProfile()
  }, [authUser, authLoading])

  const loadProfile = async () => {
    try {
      setLoading(true)
      const [profileRes, esimRes] = await Promise.all([
        fetch('/api/user/profile'),
        fetch('/api/user/purchases')
      ])

      if (!profileRes.ok) {
        router.push('/login')
        return
      }

      const profileData = await profileRes.json()
      if (profileData.success) {
        setProfile(profileData.data)
        setEditForm({ name: profileData.data.name, email: profileData.data.email })
      }

      if (esimRes.ok) {
        const esimData = await esimRes.json()
        if (esimData.success) setEsims(esimData.purchases)
      }
    } catch (error) {
      console.error('Failed to load profile:', error)
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleProfileUpdate = async () => {
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      })
      const data = await res.json()
      if (data.success) {
        setProfile(prev => prev ? { ...prev, ...data.data } : prev)
        setEditingProfile(false)
        toast.success('Profile updated!')
      } else {
        toast.error(data.error || 'Update failed')
      }
    } catch {
      toast.error('Failed to update profile')
    }
  }

  const handleLogout = async () => {
    await signOut()
    router.push('/')
  }

  const refreshEsims = async () => {
    setRefreshing(true)
    try {
      const res = await fetch('/api/user/purchases')
      const data = await res.json()
      if (data.success) setEsims(data.purchases)
    } catch {
      toast.error('Failed to refresh')
    } finally {
      setRefreshing(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'expired': return 'bg-red-500'
      case 'pending': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Wifi className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      default: return <WifiOff className="h-4 w-4" />
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
            <p className="mt-4 text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Dashboard</h1>
          <p className="text-gray-600 mt-2">View your eSIM plans, profile details, and account preferences.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Dashboard</TabsTrigger>
            <TabsTrigger value="esims">eSIMs</TabsTrigger>
            <TabsTrigger value="account">Profile</TabsTrigger>
            <TabsTrigger value="settings">Preferences</TabsTrigger>
          </TabsList>

          {/* OVERVIEW */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Ready for Your Next Trip?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Get connected worldwide with our eSIM plans. No roaming fees, instant activation!</p>
                <Button asChild className="bg-white text-blue-600 hover:bg-gray-100">
                  <a href="/plans">
                    <Smartphone className="h-4 w-4 mr-2" />
                    Browse eSIM Plans
                  </a>
                </Button>
              </CardContent>
            </Card>

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
                    <AvatarImage src={profile.avatar} />
                    <AvatarFallback className="text-lg bg-blue-100 text-blue-700">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold">{profile.name}</h2>
                    <p className="text-gray-600">{profile.email}</p>
                    <p className="text-sm text-gray-500">Member since {new Date(profile.joinDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-emerald-50 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-600">{profile.totalEsims}</div>
                    <div className="text-sm text-gray-600">Total eSIMs</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">€{profile.totalSpent.toFixed(2)}</div>
                    <div className="text-sm text-gray-600">Total Spent</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{esims.filter(e => e.status === 'active').length}</div>
                    <div className="text-sm text-gray-600">Active eSIMs</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {esims.length === 0 && (
              <Card className="border-dashed border-2 border-gray-200">
                <CardContent className="text-center py-12">
                  <div className="text-5xl mb-4">📱</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No eSIMs yet</h3>
                  <p className="text-sm text-gray-500 mb-6">Pick a plan for your next destination and get connected instantly.</p>
                  <Button asChild className="bg-gray-900 hover:bg-gray-800 text-white rounded-xl px-6">
                    <a href="/plans">Buy eSIM</a>
                  </Button>
                </CardContent>
              </Card>
            )}

            {esims.length > 0 && (
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
                            <Badge className={`${getStatusColor(esim.status)} text-white`}>{esim.status}</Badge>
                          </div>
                          <p className="text-sm text-gray-600">{esim.planName}</p>
                          {esim.status === 'active' && (
                            <div className="mt-2">
                              <div className="flex justify-between text-sm text-gray-600 mb-1">
                                <span>Data</span>
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
            )}
          </TabsContent>

          {/* MY ESIMS */}
          <TabsContent value="esims" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Smartphone className="h-5 w-5 mr-2" />
                    My eSIMs ({esims.length})
                  </div>
                  <Button onClick={refreshEsims} disabled={refreshing} variant="outline" size="sm">
                    <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {esims.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🌍</div>
                    <h3 className="text-xl font-semibold mb-2">No eSIMs Yet</h3>
                    <p className="text-gray-600 mb-6">Start exploring the world with our global eSIM plans!</p>
                    <Button asChild className="bg-blue-600 hover:bg-blue-700">
                      <a href="/plans">
                        <Smartphone className="h-4 w-4 mr-2" />
                        Buy Your First eSIM
                      </a>
                    </Button>
                  </div>
                ) : (
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
                            <Badge className={`${getStatusColor(esim.status)} text-white flex items-center gap-1`}>
                              {getStatusIcon(esim.status)}
                              <span className="capitalize">{esim.status}</span>
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between"><span className="text-gray-500">Plan</span><span className="font-medium">{esim.planName}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Price</span><span className="font-medium">€{esim.price}</span></div>
                            {esim.activationDate && (
                              <div className="flex justify-between"><span className="text-gray-500">Activated</span><span>{new Date(esim.activationDate).toLocaleDateString()}</span></div>
                            )}
                            <div className="flex justify-between"><span className="text-gray-500">Expires</span><span>{new Date(esim.expiryDate).toLocaleDateString()}</span></div>
                          </div>

                          {esim.status === 'active' && (
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-500">Data</span>
                                <span>{esim.dataUsed} / {esim.dataAmount}</span>
                              </div>
                              <Progress value={esim.usagePercentage} className="h-2 mb-1" />
                              <p className="text-xs text-gray-500">{esim.dataRemaining} remaining</p>
                            </div>
                          )}

                          <Separator />

                          <div className="space-y-2">
                            <Button variant="outline" className="w-full" size="sm" onClick={() => { setSelectedEsim(esim); setIsQRModalOpen(true) }}>
                              <QrCode className="h-4 w-4 mr-2" />View QR Code
                            </Button>
                            <Button variant="outline" className="w-full" size="sm" onClick={() => { setSelectedEsim(esim); setIsQRModalOpen(true) }}>
                              <ExternalLink className="h-4 w-4 mr-2" />Setup Instructions
                            </Button>
                          </div>

                          <p className="text-xs text-gray-400">Order: {esim.orderId}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ACCOUNT */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Account Information
                  </div>
                  {!editingProfile ? (
                    <Button onClick={() => setEditingProfile(true)} variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />Edit
                    </Button>
                  ) : (
                    <div className="space-x-2">
                      <Button onClick={handleProfileUpdate} size="sm">
                        <Save className="h-4 w-4 mr-2" />Save
                      </Button>
                      <Button onClick={() => setEditingProfile(false)} variant="outline" size="sm">
                        <X className="h-4 w-4 mr-2" />Cancel
                      </Button>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name</Label>
                    {editingProfile ? (
                      <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="mt-1" />
                    ) : (
                      <div className="p-2 border rounded-md bg-gray-50 mt-1">{profile.name}</div>
                    )}
                  </div>
                  <div>
                    <Label>Email Address</Label>
                    {editingProfile ? (
                      <Input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="mt-1" />
                    ) : (
                      <div className="p-2 border rounded-md bg-gray-50 mt-1">{profile.email}</div>
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-3">Statistics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="font-bold text-lg">{profile.totalEsims}</div>
                      <div className="text-sm text-gray-600">Total eSIMs</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="font-bold text-lg">€{profile.totalSpent.toFixed(2)}</div>
                      <div className="text-sm text-gray-600">Total Spent</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="font-bold text-lg">{esims.filter(e => e.status === 'active').length}</div>
                      <div className="text-sm text-gray-600">Active eSIMs</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="font-bold text-lg">{new Date(profile.joinDate).getFullYear()}</div>
                      <div className="text-sm text-gray-600">Member Since</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SETTINGS */}
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
                </div>

                <Separator />

                <Button onClick={handleLogout} variant="destructive" className="w-full">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <ESIMQRModal
        isOpen={isQRModalOpen}
        onClose={() => { setIsQRModalOpen(false); setSelectedEsim(null) }}
        esimData={selectedEsim ? {
          iccid: selectedEsim.id,
          qrCodeUrl: selectedEsim.qrCodeUrl,
          activationCode: selectedEsim.activationCode,
          planName: selectedEsim.planName,
          country: selectedEsim.country,
          dataAmount: selectedEsim.dataAmount,
          days: Math.ceil((new Date(selectedEsim.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
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
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    }>
      <ProfileContent />
    </Suspense>
  )
}

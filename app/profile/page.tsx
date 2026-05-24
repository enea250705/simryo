"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import {
  User,
  Smartphone,
  Settings,
  LogOut,
  Edit,
  Save,
  X,
  QrCode,
  Wifi,
  WifiOff,
  Clock,
  RefreshCw,
  ExternalLink,
  LayoutDashboard,
  Bell,
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
  status: "active" | "inactive" | "expired" | "pending"
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

type TabId = "overview" | "esims" | "account" | "settings"

const navItems: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "esims", label: "My eSIMs", icon: Smartphone },
  { id: "account", label: "Account", icon: User },
  { id: "settings", label: "Settings", icon: Settings },
]

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-50 pt-20 flex">
      <aside className="hidden md:flex w-64 shrink-0 flex-col bg-zinc-900 sticky top-20 h-[calc(100vh-5rem)]">
        <div className="p-6 border-b border-zinc-800 space-y-3">
          <Skeleton className="h-14 w-14 rounded-full bg-zinc-700" />
          <Skeleton className="h-4 w-32 bg-zinc-700" />
          <Skeleton className="h-3 w-44 bg-zinc-800" />
        </div>
        <div className="p-3 space-y-1">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg bg-zinc-800" />
          ))}
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-10 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 bg-zinc-200" />
          <Skeleton className="h-4 w-64 bg-zinc-100" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl bg-zinc-200" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl bg-zinc-100" />
      </main>
    </div>
  )
}

function ProfileContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user: authUser, loading: authLoading, signOut } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [esims, setEsims] = useState<EsimData[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProfile, setEditingProfile] = useState(false)
  const [editForm, setEditForm] = useState({ name: "", email: "" })
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState<TabId>("overview")
  const [isQRModalOpen, setIsQRModalOpen] = useState(false)
  const [selectedEsim, setSelectedEsim] = useState<EsimData | null>(null)

  // Settings local state
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [dataAlerts, setDataAlerts] = useState(true)

  useEffect(() => {
    const tab = searchParams.get("tab") as TabId | null
    if (tab && ["overview", "esims", "account", "settings"].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  useEffect(() => {
    if (authLoading) return
    if (!authUser) {
      router.push("/login")
      return
    }
    loadProfile()
  }, [authUser, authLoading])

  const loadProfile = async () => {
    try {
      setLoading(true)
      const [profileRes, esimRes] = await Promise.all([
        fetch("/api/user/profile"),
        fetch("/api/user/purchases"),
      ])

      if (!profileRes.ok) {
        router.push("/login")
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
      console.error("Failed to load profile:", error)
      toast.error("Failed to load profile")
    } finally {
      setLoading(false)
    }
  }

  const handleProfileUpdate = async () => {
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      })
      const data = await res.json()
      if (data.success) {
        setProfile((prev) => (prev ? { ...prev, ...data.data } : prev))
        setEditingProfile(false)
        toast.success("Profile updated!")
      } else {
        toast.error(data.error || "Update failed")
      }
    } catch {
      toast.error("Failed to update profile")
    }
  }

  const handleLogout = async () => {
    await signOut()
    router.push("/")
  }

  const refreshEsims = async () => {
    setRefreshing(true)
    try {
      const res = await fetch("/api/user/purchases")
      const data = await res.json()
      if (data.success) setEsims(data.purchases)
    } catch {
      toast.error("Failed to refresh")
    } finally {
      setRefreshing(false)
    }
  }

  const statusStyles: Record<string, string> = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    expired: "bg-red-50 text-red-700 border-red-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    inactive: "bg-zinc-100 text-zinc-600 border-zinc-200",
  }

  const statusDot: Record<string, string> = {
    active: "bg-emerald-500",
    expired: "bg-red-500",
    pending: "bg-amber-500",
    inactive: "bg-zinc-400",
  }

  if (authLoading || loading) return <LoadingSkeleton />
  if (!profile) return null

  const activeEsims = esims.filter((e) => e.status === "active").length
  const initials = profile.name.split(" ").map((n) => n[0]).join("").toUpperCase()

  return (
    <div className="min-h-screen bg-zinc-50 pt-20">
      <div className="flex min-h-[calc(100vh-5rem)]">
        {/* ── Sidebar ── */}
        <aside className="hidden md:flex w-64 shrink-0 flex-col bg-gradient-to-b from-zinc-900 to-zinc-950 sticky top-20 h-[calc(100vh-5rem)] border-r border-zinc-800">
          {/* User info */}
          <div className="px-5 py-6">
            <Avatar className="h-12 w-12 mb-4 ring-2 ring-zinc-700">
              <AvatarImage src={profile.avatar} />
              <AvatarFallback className="bg-zinc-700 text-zinc-100 text-sm font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm font-semibold text-zinc-100 leading-tight truncate">{profile.name}</div>
            <div className="text-xs text-zinc-400 truncate mt-0.5">{profile.email}</div>
            <div className="text-xs text-zinc-600 mt-2">
              Since {new Date(profile.joinDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            </div>
          </div>

          <Separator className="bg-zinc-800" />

          {/* Nav */}
          <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
            {navItems.map((item) => {
              const active = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    active
                      ? "bg-white/10 text-white"
                      : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5"
                  }`}
                >
                  {active && (
                    <span className="absolute left-3 w-0.5 h-5 bg-sky-400 rounded-full" />
                  )}
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                  {item.id === "esims" && esims.length > 0 && (
                    <span className="ml-auto text-xs bg-zinc-700 text-zinc-300 px-1.5 py-0.5 rounded-full">
                      {esims.length}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>

          {/* Sign out */}
          <div className="p-3 border-t border-zinc-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-500 hover:text-red-400 hover:bg-white/5 transition-all duration-150"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* ── Mobile bottom nav ── */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-zinc-200 flex safe-bottom">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors ${
                activeTab === item.id ? "text-sky-600" : "text-zinc-400"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* ── Main content ── */}
        <main className="flex-1 min-w-0 px-5 py-8 md:px-10 md:py-10 pb-24 md:pb-10">

          {/* ── OVERVIEW ── */}
          {activeTab === "overview" && (
            <div className="space-y-8 max-w-3xl">
              <div>
                <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Dashboard</h1>
                <p className="text-sm text-zinc-500 mt-1">Welcome back, {profile.name.split(" ")[0]}</p>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Total eSIMs", value: profile.totalEsims },
                  { label: "Active", value: activeEsims },
                  { label: "Total Spent", value: `€${profile.totalSpent.toFixed(2)}` },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white rounded-xl border border-zinc-200 p-5 shadow-sm">
                    <div className="text-2xl font-bold text-zinc-900 tabular-nums">{stat.value}</div>
                    <div className="text-xs font-medium text-zinc-400 uppercase tracking-widest mt-1.5">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent eSIMs */}
              <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
                  <h2 className="text-sm font-semibold text-zinc-900">Recent eSIMs</h2>
                  {esims.length > 0 && (
                    <button
                      onClick={() => setActiveTab("esims")}
                      className="text-xs text-sky-600 hover:text-sky-700 font-medium"
                    >
                      View all
                    </button>
                  )}
                </div>

                {esims.length === 0 ? (
                  <div className="text-center py-14 px-6">
                    <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Smartphone className="h-5 w-5 text-zinc-400" />
                    </div>
                    <p className="text-sm font-medium text-zinc-900 mb-1">No eSIMs yet</p>
                    <p className="text-xs text-zinc-500 mb-5">Pick a plan and get connected instantly.</p>
                    <Button asChild size="sm" className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg">
                      <a href="/plans">Browse Plans</a>
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y divide-zinc-100">
                    {esims.slice(0, 4).map((esim) => (
                      <div key={esim.id} className="flex items-center justify-between px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className="text-xl leading-none">{esim.flag}</span>
                          <div>
                            <div className="text-sm font-medium text-zinc-900">{esim.country}</div>
                            <div className="text-xs text-zinc-500">{esim.planName}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {esim.status === "active" && (
                            <div className="hidden sm:block w-24">
                              <Progress value={esim.usagePercentage} className="h-1.5" />
                              <div className="text-[10px] text-zinc-400 mt-0.5 text-right">{esim.dataRemaining} left</div>
                            </div>
                          )}
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border ${
                              statusStyles[esim.status] ?? statusStyles.inactive
                            }`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${statusDot[esim.status] ?? statusDot.inactive}`} />
                            {esim.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── MY ESIMS ── */}
          {activeTab === "esims" && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">My eSIMs</h1>
                  <p className="text-sm text-zinc-500 mt-1">{esims.length} plan{esims.length !== 1 ? "s" : ""} in your account</p>
                </div>
                <Button
                  onClick={refreshEsims}
                  disabled={refreshing}
                  variant="outline"
                  size="sm"
                  className="border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                >
                  <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${refreshing ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>

              {esims.length === 0 ? (
                <div className="bg-white rounded-xl border border-zinc-200 shadow-sm text-center py-20 px-6">
                  <div className="w-14 h-14 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Smartphone className="h-6 w-6 text-zinc-400" />
                  </div>
                  <p className="text-base font-semibold text-zinc-900 mb-1">No eSIMs yet</p>
                  <p className="text-sm text-zinc-500 mb-6">Browse our global plans and get connected in minutes.</p>
                  <Button asChild className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg">
                    <a href="/plans">
                      <Smartphone className="h-4 w-4 mr-2" />
                      Browse Plans
                    </a>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {esims.map((esim) => (
                    <div
                      key={esim.id}
                      className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col"
                    >
                      {/* Card header */}
                      <div className="px-4 pt-4 pb-3 flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl leading-none">{esim.flag}</span>
                          <div>
                            <div className="text-sm font-semibold text-zinc-900">{esim.country}</div>
                            <div className="text-xs text-zinc-500">{esim.provider}</div>
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border ${
                            statusStyles[esim.status] ?? statusStyles.inactive
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${statusDot[esim.status] ?? statusDot.inactive}`} />
                          <span className="capitalize">{esim.status}</span>
                        </span>
                      </div>

                      <Separator className="bg-zinc-100" />

                      {/* Card body */}
                      <div className="px-4 py-3 space-y-1.5 text-xs flex-1">
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Plan</span>
                          <span className="font-medium text-zinc-800 text-right max-w-[120px] truncate">{esim.planName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Price</span>
                          <span className="font-medium text-zinc-800">€{esim.price}</span>
                        </div>
                        {esim.activationDate && (
                          <div className="flex justify-between">
                            <span className="text-zinc-500">Activated</span>
                            <span className="text-zinc-700">{new Date(esim.activationDate).toLocaleDateString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Expires</span>
                          <span className="text-zinc-700">{new Date(esim.expiryDate).toLocaleDateString()}</span>
                        </div>

                        {esim.status === "active" && (
                          <div className="pt-1">
                            <div className="flex justify-between mb-1">
                              <span className="text-zinc-500">Data</span>
                              <span className="text-zinc-700">{esim.dataUsed} / {esim.dataAmount}</span>
                            </div>
                            <Progress value={esim.usagePercentage} className="h-1.5" />
                            <div className="text-zinc-400 mt-1">{esim.dataRemaining} remaining</div>
                          </div>
                        )}
                      </div>

                      {/* Card footer */}
                      <div className="px-4 pb-4 pt-2 grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                          onClick={() => { setSelectedEsim(esim); setIsQRModalOpen(true) }}
                        >
                          <QrCode className="h-3.5 w-3.5 mr-1.5" />
                          QR Code
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                          onClick={() => { setSelectedEsim(esim); setIsQRModalOpen(true) }}
                        >
                          <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                          Setup
                        </Button>
                      </div>

                      <div className="px-4 pb-3">
                        <p className="text-[10px] text-zinc-300 truncate">#{esim.orderId}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── ACCOUNT ── */}
          {activeTab === "account" && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Account</h1>
                <p className="text-sm text-zinc-500 mt-1">Manage your personal information</p>
              </div>

              <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
                  <h2 className="text-sm font-semibold text-zinc-900">Personal Details</h2>
                  {!editingProfile ? (
                    <button
                      onClick={() => setEditingProfile(true)}
                      className="flex items-center gap-1.5 text-xs font-medium text-sky-600 hover:text-sky-700"
                    >
                      <Edit className="h-3.5 w-3.5" />
                      Edit
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleProfileUpdate}
                        className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700"
                      >
                        <Save className="h-3.5 w-3.5" />
                        Save
                      </button>
                      <span className="text-zinc-200">|</span>
                      <button
                        onClick={() => {
                          setEditingProfile(false)
                          setEditForm({ name: profile.name, email: profile.email })
                        }}
                        className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-700"
                      >
                        <X className="h-3.5 w-3.5" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className="px-6 py-5 space-y-5">
                  {/* Avatar */}
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 ring-2 ring-zinc-100">
                      <AvatarImage src={profile.avatar} />
                      <AvatarFallback className="bg-zinc-100 text-zinc-700 text-lg font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-semibold text-zinc-900">{profile.name}</div>
                      <div className="text-xs text-zinc-500 mt-0.5">
                        Member since {new Date(profile.joinDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-zinc-100" />

                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Full Name</Label>
                      {editingProfile ? (
                        <Input
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="mt-1.5 border-zinc-200 focus-visible:ring-sky-500"
                        />
                      ) : (
                        <div className="mt-1.5 text-sm text-zinc-900 px-3 py-2 bg-zinc-50 rounded-lg border border-zinc-100">
                          {profile.name}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Email Address</Label>
                      {editingProfile ? (
                        <Input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="mt-1.5 border-zinc-200 focus-visible:ring-sky-500"
                        />
                      ) : (
                        <div className="mt-1.5 text-sm text-zinc-900 px-3 py-2 bg-zinc-50 rounded-lg border border-zinc-100">
                          {profile.email}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── SETTINGS ── */}
          {activeTab === "settings" && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Settings</h1>
                <p className="text-sm text-zinc-500 mt-1">Manage your preferences</p>
              </div>

              <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-zinc-100">
                  <h2 className="text-sm font-semibold text-zinc-900">Notifications &amp; Renewals</h2>
                </div>

                <div className="divide-y divide-zinc-100">
                  {[
                    {
                      label: "Email Notifications",
                      description: "Receive updates about your eSIMs via email",
                      icon: Bell,
                      checked: emailNotifs,
                      onChange: setEmailNotifs,
                    },
                    {
                      label: "Data Usage Alerts",
                      description: "Get notified when approaching your data limit",
                      icon: Wifi,
                      checked: dataAlerts,
                      onChange: setDataAlerts,
                    },
                  ].map((setting) => (
                    <div key={setting.label} className="flex items-center justify-between px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 p-1.5 bg-zinc-100 rounded-md">
                          <setting.icon className="h-3.5 w-3.5 text-zinc-500" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-zinc-900">{setting.label}</div>
                          <div className="text-xs text-zinc-500 mt-0.5">{setting.description}</div>
                        </div>
                      </div>
                      <Switch
                        checked={setting.checked}
                        onCheckedChange={setting.onChange}
                        className="shrink-0 ml-4 data-[state=checked]:bg-sky-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Sign out on mobile (no sidebar) */}
              <div className="md:hidden">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      <ESIMQRModal
        isOpen={isQRModalOpen}
        onClose={() => { setIsQRModalOpen(false); setSelectedEsim(null) }}
        esimData={
          selectedEsim
            ? {
                iccid: selectedEsim.id,
                qrCodeUrl: selectedEsim.qrCodeUrl,
                activationCode: selectedEsim.activationCode,
                planName: selectedEsim.planName,
                country: selectedEsim.country,
                dataAmount: selectedEsim.dataAmount,
                days: Math.ceil(
                  (new Date(selectedEsim.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                ),
                price: selectedEsim.price,
                currency: selectedEsim.currency,
                expiresAt: selectedEsim.expiryDate,
              }
            : null
        }
      />
    </div>
  )
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-50 pt-20 flex">
          <aside className="hidden md:flex w-64 shrink-0 bg-zinc-900" />
          <main className="flex-1 p-10">
            <Skeleton className="h-8 w-40 bg-zinc-200 mb-6" />
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-28 rounded-xl bg-zinc-200" />)}
            </div>
            <Skeleton className="h-64 rounded-xl bg-zinc-100" />
          </main>
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  )
}

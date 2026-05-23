"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { GoogleIcon } from "@/components/icons/google-icon"
import { toast } from "sonner"
import { useAuth } from "@/lib/serverless-auth"

export default function LoginPage() {
  const router = useRouter()
  const { signIn } = useAuth()
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.email || !formData.password) { toast.error("Please fill in all fields"); return }
    setIsLoading(true)
    try {
      await signIn(formData.email, formData.password)
      router.push('/profile')
    } catch (err: any) {
      toast.error(err.message || "Invalid email or password.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }))
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 pt-16">
      <div className="w-full max-w-sm">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Sign in</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your eSIMs and stay connected.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm text-gray-700">Email</Label>
            <Input id="email" type="email" placeholder="name@example.com" required value={formData.email} onChange={handleChange} disabled={isLoading} className="border-gray-200 rounded-xl" />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm text-gray-700">Password</Label>
              <Link href="/forgot-password" className="text-xs text-gray-500 hover:text-gray-900 transition-colors">Forgot password?</Link>
            </div>
            <Input id="password" type="password" required value={formData.password} onChange={handleChange} disabled={isLoading} className="border-gray-200 rounded-xl" />
          </div>

          <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors">
            {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" />Signing in...</> : "Sign in"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <a href="/api/auth/google" className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:border-gray-300 bg-white text-gray-700 rounded-xl py-2.5 text-sm font-medium transition-colors">
          <GoogleIcon className="h-4 w-4" />Sign in with Google
        </a>

        <p className="text-sm text-gray-500 text-center mt-6">
          No account?{" "}
          <Link href="/signup" className="font-semibold text-gray-900 hover:underline">Sign up</Link>
        </p>

        <p className="text-xs text-gray-400 text-center mt-3">
          By signing in you agree to our{" "}
          <Link href="/terms" className="underline hover:text-gray-700">Terms</Link>{" "}and{" "}
          <Link href="/privacy" className="underline hover:text-gray-700">Privacy Policy</Link>
        </p>

      </div>
    </div>
  )
}

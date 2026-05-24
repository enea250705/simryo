"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { GoogleIcon } from "@/components/icons/google-icon"
import { toast } from "sonner"

function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    name: "",
    email: searchParams.get('email') ? decodeURIComponent(searchParams.get('email')!) : "",
    password: ""
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.password) { toast.error("Please fill in all fields"); return }
    if (formData.password.length < 6) { toast.error("Password must be at least 6 characters"); return }
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password })
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Failed to create account'); setIsLoading(false); return }
      toast.success("Account created! Signing you in...")
      const callbackUrl = searchParams.get('callbackUrl')
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false
      })
      if (result?.error) {
        window.location.href = callbackUrl ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : '/login'
      } else {
        window.location.href = callbackUrl ? decodeURIComponent(callbackUrl) : '/checkout'
      }
    } catch {
      toast.error("Signup failed")
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
          <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
          <p className="text-sm text-gray-500 mt-1">Get connected with eSIM plans worldwide.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm text-gray-700">Full name</Label>
            <Input id="name" type="text" placeholder="John Doe" required value={formData.name} onChange={handleChange} disabled={isLoading} className="border-gray-200 rounded-xl" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm text-gray-700">Email</Label>
            <Input id="email" type="email" placeholder="name@example.com" required value={formData.email} onChange={handleChange} disabled={isLoading} className="border-gray-200 rounded-xl" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-sm text-gray-700">Password</Label>
            <Input id="password" type="password" placeholder="At least 6 characters" required value={formData.password} onChange={handleChange} disabled={isLoading} className="border-gray-200 rounded-xl" />
          </div>

          <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors mt-2">
            {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" />Creating account...</> : "Create account"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <a href="/api/auth/google" className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:border-gray-300 bg-white text-gray-700 rounded-xl py-2.5 text-sm font-medium transition-colors">
          <GoogleIcon className="h-4 w-4" />Continue with Google
        </a>

        <p className="text-sm text-gray-500 text-center mt-6">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-gray-900 hover:underline">Sign in</Link>
        </p>

        <p className="text-xs text-gray-400 text-center mt-3">
          By signing up you agree to our{" "}
          <Link href="/terms" className="underline hover:text-gray-700">Terms</Link>{" "}and{" "}
          <Link href="/privacy" className="underline hover:text-gray-700">Privacy Policy</Link>
        </p>

      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    }>
      <SignupForm />
    </Suspense>
  )
}

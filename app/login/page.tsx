"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { signIn } from "next-auth/react"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted before rendering
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields")
      return
    }

    setIsLoading(true)

    try {
      // Get callback URL for redirect after successful login
      const callbackUrl = searchParams.get('callbackUrl')
      const redirectUrl = callbackUrl ? decodeURIComponent(callbackUrl) : '/checkout'

      // Use NextAuth signIn method
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      // Successful login - redirect to the desired page
      toast.success("Logged in successfully!")
      window.location.href = redirectUrl
      
    } catch (error) {
      console.error('Login error:', error)
      toast.error(error instanceof Error ? error.message : "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }))
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4 py-4 sm:py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-4 sm:space-y-6">
        {/* Logo/Brand section */}
        <div className="text-center">
          <div className="flex justify-center items-center space-x-2 mb-4 sm:mb-6">
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg sm:text-xl">S</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-gray-900">SIMRYO</span>
          </div>
        </div>

        <Card className="shadow-xl border border-gray-200 bg-white">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Sign in to manage your eSIMs and stay connected worldwide
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  required 
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-700">Password</Label>
                  <Link href="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg disabled:scale-100 disabled:opacity-50 mt-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </CardContent>
          </form>
          <CardFooter className="flex flex-col space-y-4 text-center pt-6">
            <div className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/signup" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                Sign up
              </Link>
            </div>
            <div className="text-xs text-gray-500">
              By signing in, you agree to our{" "}
              <Link href="/terms" className="underline hover:text-blue-600 transition-colors">Terms of Service</Link>
              {" "}and{" "}
              <Link href="/privacy" className="underline hover:text-blue-600 transition-colors">Privacy Policy</Link>
            </div>
          </CardFooter>
        </Card>
        
        {/* Additional branding footer */}
        <div className="text-center text-sm text-gray-500">
          <p>Trusted by travelers worldwide</p>
          <div className="flex justify-center items-center space-x-4 mt-2">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Secure</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Instant</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>Reliable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
 
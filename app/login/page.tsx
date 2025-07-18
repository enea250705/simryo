"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Globe, Loader2 } from "lucide-react"
import { GoogleIcon } from "@/components/icons/google-icon"
import { toast } from "sonner"
import { signIn } from "next-auth/react"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields")
      return
    }

    setIsLoading(true)
    
    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false
      })
      
      if (result?.error) {
        toast.error("Invalid email or password. Please try again.")
      } else {
        toast.success("Logged in successfully!")
        router.push('/checkout')
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error("Invalid email or password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    
    try {
      const result = await signIn('google', {
        redirect: false
      })
      
      if (result?.error) {
        toast.error("Google login failed. Please try again.")
      } else {
        toast.success("Logged in with Google successfully!")
        router.push('/checkout')
      }
    } catch (error) {
      console.error('Google login error:', error)
      toast.error("An error occurred with Google login. Please try again.")
    } finally {
      setIsGoogleLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }))
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] justify-center bg-gray-50 px-4 pt-24 pb-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
              Welcome Back
            </CardTitle>
            <CardDescription>
              Sign in to manage your eSIMs and stay connected
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
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-sm font-medium text-primary hover:text-primary/80">
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
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading || isLoading}
              >
                {isGoogleLoading ? (
                  <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                  <GoogleIcon className="mr-2 h-4 w-4" />
                    Sign in with Google
                  </>
                )}
              </Button>
            </CardContent>
          </form>
          <CardFooter className="flex flex-col space-y-4 text-center">
            <div className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/signup" className="font-semibold text-primary hover:text-primary/80">
                Sign up
              </Link>
            </div>
            <div className="text-xs text-gray-500">
              By signing in, you agree to our{" "}
              <Link href="/terms" className="underline hover:text-gray-800">Terms of Service</Link>
              {" "}and{" "}
              <Link href="/privacy" className="underline hover:text-gray-800">Privacy Policy</Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
 
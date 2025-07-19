"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Menu, 
  X, 
  Globe, 
  ShoppingCart, 
  Settings, 
  MessageCircle,
  HelpCircle,
  Smartphone,
  MapPin,
  CreditCard,
  Home,
  Phone,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { analytics } from "@/lib/analytics"

interface CartItem {
  quantity: number
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle cart count
  const updateCartCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      const count = cart.reduce((acc: number, item: CartItem) => acc + item.quantity, 0)
      setCartCount(count)
    } catch (error) {
      console.error('Error reading cart:', error)
      setCartCount(0)
    }
  }
  
  useEffect(() => {
    updateCartCount()
    window.addEventListener('cart-updated', updateCartCount)
    return () => window.removeEventListener('cart-updated', updateCartCount)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const navbarClasses = cn(
    "sticky top-0 w-full z-50 transition-all duration-300 border-0",
    isScrolled 
      ? "bg-white/95 backdrop-blur-lg shadow-lg" 
      : "bg-white"
  )

  const isActive = (path: string) => pathname === path

  return (
    <>
      <nav className={navbarClasses}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Desktop Navigation */}
          <div className="hidden lg:flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Image
                    src="/simryologo.png"
                    alt="SIMRYO Logo"
                    width={32}
                    height={32}
                    className="h-8 w-8 object-contain group-hover:scale-105 transition-transform"
                    unoptimized={true}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SIMRYO
                </span>
              </div>
            </Link>

            {/* Main Navigation */}
            <div className="flex items-center space-x-8">
              <Link 
                href="/" 
                className={cn(
                  "text-sm font-medium transition-colors hover:text-blue-600",
                  isActive("/") ? "text-blue-600" : "text-gray-700"
                )}
              >
                Home
              </Link>
              <Link 
                href="/plans" 
                className={cn(
                  "text-sm font-medium transition-colors hover:text-blue-600",
                  isActive("/plans") ? "text-blue-600" : "text-gray-700"
                )}
              >
                Plans
              </Link>
              <Link 
                href="/coverage" 
                className={cn(
                  "text-sm font-medium transition-colors hover:text-blue-600",
                  isActive("/coverage") ? "text-blue-600" : "text-gray-700"
                )}
              >
                Coverage
              </Link>
              <Link 
                href="/support" 
                className={cn(
                  "text-sm font-medium transition-colors hover:text-blue-600",
                  isActive("/support") ? "text-blue-600" : "text-gray-700"
                )}
              >
                Support
              </Link>
              <Link 
                href="/pricing" 
                className={cn(
                  "text-sm font-medium transition-colors hover:text-blue-600",
                  isActive("/pricing") ? "text-blue-600" : "text-gray-700"
                )}
              >
                Pricing
              </Link>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <Link href="/cart" className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 hover:bg-red-600 text-white text-xs">
                    {cartCount}
                  </Badge>
                )}
              </Link>

              {/* Buy Now Button */}
              <Link href="/plans">
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-6"
                  onClick={() => analytics.clickCTA('Buy eSIM Now', 'navbar')}
                >
                  Buy eSIM Now
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden">
            <div className="flex items-center justify-between h-16">
              {/* Mobile Logo */}
              <Link href="/" className="flex items-center">
                <div className="flex items-center space-x-2">
                  <Image
                    src="/simryologo.png"
                    alt="SIMRYO Logo"
                    width={28}
                    height={28}
                    className="h-7 w-7 object-contain"
                    unoptimized={true}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    SIMRYO
                  </span>
                </div>
              </Link>

              {/* Mobile Right Actions */}
              <div className="flex items-center space-x-2">
                {/* Cart */}
                <Link href="/cart" className="relative p-2 text-gray-700 hover:text-blue-600">
                  <ShoppingCart className="h-6 w-6" />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                      {cartCount}
                    </Badge>
                  )}
                </Link>

                {/* Mobile Menu Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 p-2 h-10 w-10"
                  aria-label={isOpen ? "Close menu" : "Open menu"}
                >
                  {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden">
          {/* Background overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu panel */}
          <div className="fixed top-0 left-0 right-0 bg-white z-50 shadow-xl">
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <Image
                  src="/simryologo.png"
                  alt="SIMRYO Logo"
                  width={24}
                  height={24}
                  className="h-6 w-6 object-contain"
                  unoptimized={true}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SIMRYO
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:text-blue-600 p-2 h-10 w-10"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Menu Content */}
            <div className="px-4 py-6 space-y-6 max-h-[calc(100vh-80px)] overflow-y-auto">
              {/* Quick Action */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <Globe className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">Ready to Connect?</h3>
                    <p className="text-xs text-gray-600">190+ countries worldwide</p>
                  </div>
                </div>
                <Link href="/plans" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium h-10 rounded-lg text-sm">
                    🌍 Browse Plans
                  </Button>
                </Link>
              </div>

              {/* Main Navigation */}
              <div className="space-y-1">
                <Link
                  href="/"
                  className={cn(
                    "flex items-center justify-between p-4 rounded-lg transition-all duration-200",
                    isActive("/") 
                      ? "bg-blue-50 text-blue-700 border border-blue-200" 
                      : "hover:bg-gray-50 text-gray-700"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    <Home className="h-5 w-5" />
                    <span className="font-medium">Home</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </Link>

                <Link
                  href="/plans"
                  className={cn(
                    "flex items-center justify-between p-4 rounded-lg transition-all duration-200",
                    isActive("/plans") 
                      ? "bg-blue-50 text-blue-700 border border-blue-200" 
                      : "hover:bg-gray-50 text-gray-700"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    <Smartphone className="h-5 w-5" />
                    <span className="font-medium">Browse Plans</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </Link>

                <Link
                  href="/coverage"
                  className={cn(
                    "flex items-center justify-between p-4 rounded-lg transition-all duration-200",
                    isActive("/coverage") 
                      ? "bg-blue-50 text-blue-700 border border-blue-200" 
                      : "hover:bg-gray-50 text-gray-700"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5" />
                    <span className="font-medium">Coverage</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </Link>

                <Link
                  href="/pricing"
                  className={cn(
                    "flex items-center justify-between p-4 rounded-lg transition-all duration-200",
                    isActive("/pricing") 
                      ? "bg-blue-50 text-blue-700 border border-blue-200" 
                      : "hover:bg-gray-50 text-gray-700"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5" />
                    <span className="font-medium">Pricing</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </Link>
              </div>

              {/* Support Section */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2">Support</h3>
                
                <div className="space-y-1">
                  <Link
                    href="/support"
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg transition-colors",
                      isActive("/support") 
                        ? "bg-gray-50 text-gray-900" 
                        : "hover:bg-gray-50 text-gray-600"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                      <HelpCircle className="h-4 w-4" />
                      <span className="text-sm">Help Center</span>
                    </div>
                    <ChevronRight className="h-3 w-3 text-gray-400" />
                  </Link>

                  <Link
                    href="/setup"
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                      <Settings className="h-4 w-4" />
                      <span className="text-sm">Setup Guide</span>
                    </div>
                    <ChevronRight className="h-3 w-3 text-gray-400" />
                  </Link>

                  <Link
                    href="/contact"
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">Contact Us</span>
                    </div>
                    <ChevronRight className="h-3 w-3 text-gray-400" />
                  </Link>
                </div>
              </div>

              {/* Cart Link */}
              <Link href="/cart" onClick={() => setIsOpen(false)}>
                <div className="flex items-center justify-between p-4 rounded-lg border-2 border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200">
                  <div className="flex items-center space-x-3">
                    <ShoppingCart className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-800">Cart</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {cartCount > 0 && (
                      <Badge className="bg-red-500 text-white px-2 py-1 text-xs">
                        {cartCount}
                      </Badge>
                    )}
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </Link>

              {/* Company Links */}
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 mb-3">Company</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/about"
                    className="text-center p-3 rounded-lg hover:bg-gray-50 text-gray-600 hover:text-gray-800 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-sm">About</span>
                  </Link>
                  <Link
                    href="/blog"
                    className="text-center p-3 rounded-lg hover:bg-gray-50 text-gray-600 hover:text-gray-800 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-sm">Blog</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
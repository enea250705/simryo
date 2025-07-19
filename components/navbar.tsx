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
  Phone
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
    "fixed w-full top-0 z-50 transition-all duration-300",
    isScrolled 
      ? "bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-lg" 
      : "bg-white/90 backdrop-blur-md border-b border-gray-100"
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
                  className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 p-2"
                  aria-label={isOpen ? "Close menu" : "Open menu"}
                >
                  {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Background overlay */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu panel */}
          <div className="fixed top-16 left-0 right-0 bottom-0 bg-white shadow-xl">
            <div className="h-full overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Quick Buy Section */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <Globe className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Ready to Connect?</h3>
                      <p className="text-sm text-gray-600">190+ countries worldwide</p>
                    </div>
                  </div>
                  <Link href="/plans" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium h-12 rounded-xl">
                      🌍 Browse eSIM Plans
                    </Button>
                  </Link>
                </div>

                {/* Main Navigation */}
                <div className="space-y-2">
                  <Link
                    href="/"
                    className={cn(
                      "flex items-center space-x-4 p-4 rounded-xl transition-all duration-200",
                      isActive("/") 
                        ? "bg-blue-50 text-blue-700 border border-blue-200" 
                        : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <Home className="h-5 w-5" />
                    <span className="font-medium">Home</span>
                  </Link>

                  <Link
                    href="/plans"
                    className={cn(
                      "flex items-center space-x-4 p-4 rounded-xl transition-all duration-200",
                      isActive("/plans") 
                        ? "bg-blue-50 text-blue-700 border border-blue-200" 
                        : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <Smartphone className="h-5 w-5" />
                    <span className="font-medium">Browse Plans</span>
                  </Link>

                  <Link
                    href="/coverage"
                    className={cn(
                      "flex items-center space-x-4 p-4 rounded-xl transition-all duration-200",
                      isActive("/coverage") 
                        ? "bg-blue-50 text-blue-700 border border-blue-200" 
                        : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <MapPin className="h-5 w-5" />
                    <span className="font-medium">Coverage</span>
                  </Link>

                  <Link
                    href="/pricing"
                    className={cn(
                      "flex items-center space-x-4 p-4 rounded-xl transition-all duration-200",
                      isActive("/pricing") 
                        ? "bg-blue-50 text-blue-700 border border-blue-200" 
                        : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <CreditCard className="h-5 w-5" />
                    <span className="font-medium">Pricing</span>
                  </Link>
                </div>

                {/* Support Section */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 px-2">
                    <MessageCircle className="h-4 w-4 text-gray-400" />
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Support</h3>
                  </div>
                  
                  <div className="space-y-1">
                    <Link
                      href="/support"
                      className={cn(
                        "flex items-center space-x-4 p-3 rounded-lg transition-colors",
                        isActive("/support") 
                          ? "bg-gray-100 text-gray-900" 
                          : "hover:bg-gray-50 text-gray-600 hover:text-gray-800"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      <HelpCircle className="h-4 w-4" />
                      <span className="text-sm">Help Center</span>
                    </Link>

                    <Link
                      href="/setup"
                      className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 text-gray-600 hover:text-gray-800 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      <span className="text-sm">Setup Guide</span>
                    </Link>

                    <Link
                      href="/contact"
                      className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 text-gray-600 hover:text-gray-800 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">Contact Us</span>
                    </Link>
                  </div>
                </div>

                {/* Company Section */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-2">Company</h3>
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
        </div>
      )}

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-16" />
    </>
  )
}
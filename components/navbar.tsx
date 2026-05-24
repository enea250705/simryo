"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/serverless-auth"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { 
  Menu, 
  X, 
  Globe, 
  ShoppingCart, 
  Settings, 
  MessageCircle,
  HelpCircle,
  ChevronDown,
  Star,
  MapPin,
  CreditCard,
  Gift,
  Sparkles,
  User,
  Mail,
  LogIn
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { analytics } from "@/lib/analytics"
import { CurrencySelector } from "@/components/currency-selector"


const navigationItems = [
  {
    title: "Travel Plans",
    href: "/plans",
    description: "Find data for your destination",
    icon: Globe,
    featured: true,
  },
  {
    title: "How it Works",
    href: "/setup",
    description: "3 simple steps to get connected",
    icon: Settings,
  },
  {
    title: "Help & Support",
    href: "/support",
    description: "Get help with your eSIM",
    icon: MessageCircle,
  },
]

const supportItems = [
  {
    title: "Setup Guide",
    href: "/setup",
    description: "How to install your eSIM",
    icon: Settings,
  },
  {
    title: "FAQ",
    href: "/faq",
    description: "Common questions answered",
    icon: HelpCircle,
  },
  {
    title: "Contact Us",
    href: "/contact",
    description: "24/7 customer support",
    icon: MessageCircle,
  },
]

const companyItems = [
  {
    title: "About Us",
    href: "/about",
    description: "Our mission and story",
  },
  {
    title: "Blog",
    href: "/blog", 
    description: "Travel tips and guides",
  },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { user: session } = useAuth()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const updateCartCount = () => {
    try {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      const count = cart.reduce((acc: number, item: any) => acc + (item.quantity || 0), 0)
    setCartCount(count)
    } catch (error) {
      console.warn('Error updating cart count:', error)
      setCartCount(0)
    }
  }
  
  useEffect(() => {
    updateCartCount()
    window.addEventListener('cart-updated', updateCartCount)
    
    // Debug: log cart count
    console.log('Cart count:', cartCount)
    
    return () => {
      window.removeEventListener('cart-updated', updateCartCount)
    }
  }, [cartCount])


  // Close menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Escape key + body scroll lock
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const navbarClasses = cn(
    "fixed w-full z-50 transition-all duration-300 top-9",
    isScrolled
      ? "bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm"
      : "bg-white/80 backdrop-blur-md border-b border-gray-100"
  )

  const isActive = (path: string) => pathname === path

  return (
    <nav className={navbarClasses}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Desktop Navigation */}
        <div className="hidden lg:flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
              <div className="relative">
                <Image
                  src="/simryologo.png"
                  alt="SIMRYO Logo"
                  width={80}
                  height={80}
                  className="h-20 w-20 object-contain group-hover:scale-105 transition-transform"
                  priority={true}
                  fetchPriority="high"
                  onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                  }}
                />
            </div>
          </Link>

          {/* Main Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="space-x-1">
              {/* Home Link */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/"
                  className={cn(navigationMenuTriggerStyle(), "text-gray-700 hover:text-blue-600 font-medium")}
                >
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Plans Menu */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-gray-700 hover:text-blue-600 font-medium">
                  Plans
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 w-[500px] lg:w-[600px] lg:grid-cols-[.75fr_1fr]">
                    <div className="row-span-3">
                      <NavigationMenuLink
                        href="/plans"
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-blue-50 to-blue-100 p-6 no-underline outline-none focus:shadow-md group"
                      >
                        <Globe className="h-6 w-6 text-blue-600 mb-2" />
                        <div className="mb-2 mt-4 text-lg font-medium text-gray-900">
                          Global Coverage
                        </div>
                        <p className="text-sm leading-tight text-gray-600">
                          Stay connected in 190+ countries with our premium eSIM data plans.
                        </p>
                      </NavigationMenuLink>
                    </div>
                    <div className="grid gap-3">
                      {navigationItems.map((item) => (
                        <NavigationMenuLink
                          key={item.href}
                          href={item.href}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-50 hover:text-blue-600 focus:bg-gray-50 focus:text-blue-600 group"
                        >
                          <div className="flex items-center space-x-2">
                            <item.icon className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                            <div className="text-sm font-medium leading-none">
                              {item.title}
                            </div>
                            {item.featured && (
                              <Badge variant="secondary" className="text-xs">
                                Popular
                              </Badge>
                            )}
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-gray-600">
                            {item.description}
                          </p>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Support Menu */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-gray-700 hover:text-blue-600 font-medium">
                  Support
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 w-[400px] lg:w-[500px] lg:grid-cols-2">
                    {supportItems.map((item) => (
                      <NavigationMenuLink
                        key={item.href}
                        href={item.href}
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-50 hover:text-blue-600 focus:bg-gray-50 focus:text-blue-600 group"
                      >
                        <div className="flex items-center space-x-2">
                          <item.icon className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                          <div className="text-sm font-medium leading-none">
                            {item.title}
                          </div>
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-gray-600">
                          {item.description}
                        </p>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Company Menu */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-gray-700 hover:text-blue-600 font-medium">
                  Company
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 w-[400px] lg:w-[500px] lg:grid-cols-2">
                    {companyItems.map((item) => (
                      <NavigationMenuLink
                        key={item.href}
                        href={item.href}
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-50 hover:text-blue-600 focus:bg-gray-50 focus:text-blue-600"
                      >
                        <div className="text-sm font-medium leading-none">
                          {item.title}
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-gray-600">
                          {item.description}
                        </p>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Direct Links */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/pricing"
                  className={cn(navigationMenuTriggerStyle(), "text-gray-700 hover:text-blue-600 font-medium")}
                >
                  Pricing
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>


          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 ? (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 hover:bg-red-600 text-white text-xs">
                  {cartCount}
                </Badge>
              ) : null}
            </Link>

            {/* Auth: login/register or account link */}
            {!session ? (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-gray-700 hover:text-blue-600 font-medium">
                    <LogIn className="h-4 w-4 mr-1.5" />
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="outline" className="border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600 font-medium">
                    Register
                  </Button>
                </Link>
              </>
            ) : (
              <Link href="/profile">
                <Button variant="ghost" className="text-gray-700 hover:text-blue-600 font-medium">
                  <User className="h-4 w-4 mr-1.5" />
                  Account
                </Button>
              </Link>
            )}

            {/* Buy Now Button */}
            <Link href="/plans">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  try {
                    analytics.clickCTA('Buy eSIM Now', 'navbar')
                  } catch (error) {
                    console.warn('Analytics error:', error)
                  }
                }}
              >
                Buy eSIM Now
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 min-h-[44px] min-w-[44px] bg-transparent border-none shadow-none"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>

            {/* Mobile Logo */}
            <Link href="/" className="flex items-center">
              <div className="relative">
                <Image
                  src="/simryologo.png"
                  alt="SIMRYO Logo"
                  width={60}
                  height={60}
                  className="h-16 w-16 object-contain"
                  onError={(e) => {
                    console.error('Mobile logo failed to load:', e);
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            </Link>

            {/* Mobile Right Actions */}
            <div className="flex items-center space-x-2">
              <Link href="/cart" className="relative p-2 text-gray-700 hover:text-blue-600">
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 ? (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                    {cartCount}
                  </Badge>
                ) : null}
              </Link>

              <Link href="/plans">
                <Button 
                  size="sm" 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => {
                    try {
                      analytics.clickCTA('Buy eSIM', 'mobile-navbar')
                    } catch (error) {
                      console.warn('Analytics error:', error)
                    }
                  }}
                >
                  Buy eSIM
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu — fixed full-screen panel */}
          <div
            id="mobile-menu"
            className={cn(
              "fixed inset-0 top-[100px] z-40 transition-all duration-300",
              isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/30"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <div
              className={cn(
                "absolute top-0 left-0 right-0 bg-white shadow-xl transition-transform duration-300 ease-out overflow-y-auto max-h-[calc(100vh-4rem)]",
                isOpen ? "translate-y-0" : "-translate-y-4"
              )}
            >
              <nav className="px-4 py-6 space-y-1">
                {[
                  { href: "/", label: "Home" },
                  { href: "/plans", label: "eSIM Plans" },
                  { href: "/pricing", label: "Pricing" },
                  { href: "/setup", label: "How it Works" },
                  { href: "/support", label: "Support" },
                  { href: "/faq", label: "FAQ" },
                  { href: "/contact", label: "Contact" },
                  ...(session ? [{ href: "/profile", label: "My Account" }] : []),
                ].map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center px-4 py-3.5 rounded-xl text-base font-medium transition-colors",
                      pathname === href
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    {label}
                  </Link>
                ))}
              </nav>

              <div className="px-4 pb-6 pt-2 border-t border-gray-100">
                {!session && (
                  <>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full border-gray-300 text-gray-700 font-medium">
                          <LogIn className="h-4 w-4 mr-1.5" />
                          Login
                        </Button>
                      </Link>
                      <Link href="/signup" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full border-gray-300 text-gray-700 font-medium">
                          Register
                        </Button>
                      </Link>
                    </div>
                    <Separator className="mb-4" />
                  </>
                )}
                <Link href="/plans" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-semibold rounded-xl">
                    Browse Plans
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
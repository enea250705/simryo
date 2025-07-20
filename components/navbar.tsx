"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
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
  User
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
  {
    title: "Careers",
    href: "/careers",
    description: "Join our team",
  },
  {
    title: "Press",
    href: "/press",
    description: "Media resources",
  },
]

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

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0', 10) * -1)
      }
    }

    // Cleanup on unmount
    return () => {
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
    }
  }, [isOpen])

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const navbarClasses = cn(
    "fixed w-full z-50 transition-all duration-300 top-0",
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
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "text-gray-700 hover:text-blue-600 font-medium")}>
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              {/* Plans Menu */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-gray-700 hover:text-blue-600 font-medium">
                  Plans
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 w-[500px] lg:w-[600px] lg:grid-cols-[.75fr_1fr]">
                    <div className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-blue-50 to-blue-100 p-6 no-underline outline-none focus:shadow-md group"
                          href="/plans"
                        >
                          <Globe className="h-6 w-6 text-blue-600 mb-2" />
                          <div className="mb-2 mt-4 text-lg font-medium text-gray-900">
                            Global Coverage
                          </div>
                          <p className="text-sm leading-tight text-gray-600">
                            Stay connected in 190+ countries with our premium eSIM data plans.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                    <div className="grid gap-3">
                      {navigationItems.map((item) => (
                        <NavigationMenuLink key={item.href} asChild>
                          <Link
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
                          </Link>
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
                      <NavigationMenuLink key={item.href} asChild>
                        <Link
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
                        </Link>
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
                      <NavigationMenuLink key={item.href} asChild>
                        <Link
                          href={item.href}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-50 hover:text-blue-600 focus:bg-gray-50 focus:text-blue-600"
                        >
                          <div className="text-sm font-medium leading-none">
                            {item.title}
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-gray-600">
                            {item.description}
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Direct Links */}
              <NavigationMenuItem>
                <Link href="/pricing" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "text-gray-700 hover:text-blue-600 font-medium")}>
                    Pricing
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>


          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 ? (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 hover:bg-red-600 text-white text-xs">
                  {cartCount}
                </Badge>
              ) : null}
            </Link>


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

          {/* Mobile Menu */}
          <div className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${
            isOpen ? 'visible opacity-100' : 'invisible opacity-0'
          }`}>
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu Panel */}
            <div className={`absolute top-0 left-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-out ${
              isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
              {/* Close Button */}
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              {/* Menu Content */}
              <div className="h-full flex flex-col">
                {/* Logo Section */}
                <div className="px-6 pt-8 pb-6">
                  <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center space-x-3">
                    <Image
                      src="/simryologo.png"
                      alt="SIMRYO"
                      width={40}
                      height={40}
                      className="rounded-lg"
                    />
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">SIMRYO</h2>
                      <p className="text-sm text-gray-500">Global eSIM</p>
                    </div>
                  </Link>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 px-6 overflow-y-auto">
                  <nav className="space-y-2">
                    {/* Main Links */}
                    <Link
                      href="/"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <Globe className="h-5 w-5" />
                      <span className="font-medium">Home</span>
                    </Link>

                    <Link
                      href="/plans"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <MapPin className="h-5 w-5" />
                      <span className="font-medium">Travel Plans</span>
                      <Badge className="ml-auto bg-blue-100 text-blue-700 text-xs">Popular</Badge>
                    </Link>

                    <Link
                      href="/pricing"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <CreditCard className="h-5 w-5" />
                      <span className="font-medium">Pricing</span>
                    </Link>

                    <Link
                      href="/setup"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <Settings className="h-5 w-5" />
                      <span className="font-medium">How it Works</span>
                    </Link>

                    {/* Divider */}
                    <div className="my-4 border-t border-gray-200"></div>

                    {/* Support Section */}
                    <div className="space-y-1">
                      <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Support</p>
                      
                      <Link
                        href="/support"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>Help Center</span>
                      </Link>

                      <Link
                        href="/faq"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors"
                      >
                        <HelpCircle className="h-4 w-4" />
                        <span>FAQ</span>
                      </Link>

                      <Link
                        href="/contact"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>Contact</span>
                      </Link>
                    </div>

                    {/* Divider */}
                    <div className="my-4 border-t border-gray-200"></div>

                    {/* Account Section */}
                    <div className="space-y-1">
                      <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Account</p>
                      
                      <Link
                        href="/profile"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors"
                      >
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </div>
                  </nav>
                </div>

                {/* Bottom CTA */}
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <Link href="/plans" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-sm transition-colors">
                      Get Your eSIM
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
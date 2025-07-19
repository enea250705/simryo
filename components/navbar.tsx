"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Menu, 
  X, 
  Globe, 
  User, 
  ShoppingCart, 
  Settings, 
  LogOut, 
  UserCircle, 
  Smartphone,
  Zap,
  Shield,
  MessageCircle,
  HelpCircle,
  ChevronDown,
  Star,
  MapPin,
  CreditCard,
  Gift
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { analytics } from "@/lib/analytics"

interface CartItem {
  quantity: number
}

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
    icon: Zap,
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
    icon: Smartphone,
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
  const router = useRouter()
  const isHomePage = pathname === "/"

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Handle scroll effect with throttling for better performance
  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 10)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const count = cart.reduce((acc: number, item: CartItem) => acc + item.quantity, 0)
    setCartCount(count)
  }
  
  useEffect(() => {
    updateCartCount()
    window.addEventListener('cart-updated', updateCartCount)
    
    return () => {
      window.removeEventListener('cart-updated', updateCartCount)
    }
  }, [])


  const navbarClasses = cn(
    "fixed w-full z-50 transition-all duration-300 top-0",
    isScrolled 
      ? "bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm" 
      : "bg-white/80 backdrop-blur-md border-b border-gray-100"
  )

  return (
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
                    console.warn('Desktop logo failed to load, using fallback');
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
              </div>
              <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                SIMRYO
              </span>
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
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 hover:bg-red-600 text-white text-xs">
                  {cartCount}
                </Badge>
              )}
            </Link>


            {/* Buy Now Button */}
            <Link href="/plans">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
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
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              id="mobile-menu-button"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 min-h-[44px] min-w-[44px]"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>

            {/* Mobile Logo */}
            <Link href="/" className="flex items-center">
              <div className="flex items-center space-x-2">
                <Image
                  src="/simryologo.png"
                  alt="SIMRYO Logo"
                  width={28}
                  height={28}
                  className="h-7 w-7 object-contain"
                  onError={(e) => {
                    console.warn('Logo failed to load, using fallback');
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <span className="text-lg font-bold text-gray-900">SIMRYO</span>
              </div>
            </Link>

            {/* Mobile Right Actions */}
            <div className="flex items-center space-x-2">
              <Link href="/cart" className="relative p-2 text-gray-700 hover:text-blue-600">
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                    {cartCount}
                  </Badge>
                )}
              </Link>

              <Link href="/plans">
                <Button 
                  size="sm" 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => analytics.clickCTA('Buy eSIM', 'mobile-navbar')}
                >
                  Buy eSIM
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div 
              id="mobile-menu"
              className="fixed top-16 left-0 right-0 bottom-0 bg-white shadow-xl z-50 animate-in slide-in-from-top-2 duration-300"
              role="menu"
              aria-labelledby="mobile-menu-button"
            >
              <div className="h-full overflow-y-auto">
                <div className="px-6 py-8 space-y-8">
                  {/* Main Navigation */}
                  <div className="space-y-4">
                    <Link
                      href="/"
                      className="flex items-center space-x-4 p-4 rounded-xl hover:bg-blue-50 text-gray-800 hover:text-blue-600 transition-all duration-200 min-h-[60px] border border-gray-100"
                      onClick={() => setIsOpen(false)}
                      role="menuitem"
                    >
                      <Globe className="h-6 w-6 text-blue-600" />
                      <span className="text-lg font-medium">Home</span>
                    </Link>

                    <Link
                      href="/plans"
                      className="flex items-center space-x-4 p-4 rounded-xl hover:bg-blue-50 text-gray-800 hover:text-blue-600 transition-all duration-200 min-h-[60px] border border-gray-100"
                      onClick={() => setIsOpen(false)}
                      role="menuitem"
                    >
                      <Smartphone className="h-6 w-6 text-blue-600" />
                      <span className="text-lg font-medium">Browse Plans</span>
                    </Link>

                    <Link
                      href="/coverage"
                      className="flex items-center space-x-4 p-4 rounded-xl hover:bg-blue-50 text-gray-800 hover:text-blue-600 transition-all duration-200 min-h-[60px] border border-gray-100"
                      onClick={() => setIsOpen(false)}
                      role="menuitem"
                    >
                      <MapPin className="h-6 w-6 text-blue-600" />
                      <span className="text-lg font-medium">Coverage</span>
                    </Link>

                    <Link
                      href="/pricing"
                      className="flex items-center space-x-4 p-4 rounded-xl hover:bg-blue-50 text-gray-800 hover:text-blue-600 transition-all duration-200 min-h-[60px] border border-gray-100"
                      onClick={() => setIsOpen(false)}
                      role="menuitem"
                    >
                      <CreditCard className="h-6 w-6 text-blue-600" />
                      <span className="text-lg font-medium">Pricing</span>
                    </Link>
                  </div>

                  {/* Support Section */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-2">Support</h3>
                    
                    <Link
                      href="/support"
                      className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-all duration-200 min-h-[56px]"
                      onClick={() => setIsOpen(false)}
                    >
                      <HelpCircle className="h-5 w-5 text-gray-500" />
                      <span className="text-base">Help Center</span>
                    </Link>

                    <Link
                      href="/setup"
                      className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-all duration-200 min-h-[56px]"
                      onClick={() => setIsOpen(false)}
                    >
                      <Settings className="h-5 w-5 text-gray-500" />
                      <span className="text-base">Setup Guide</span>
                    </Link>

                    <Link
                      href="/contact"
                      className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-all duration-200 min-h-[56px]"
                      onClick={() => setIsOpen(false)}
                    >
                      <MessageCircle className="h-5 w-5 text-gray-500" />
                      <span className="text-base">Contact Us</span>
                    </Link>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <Link href="/cart" onClick={() => setIsOpen(false)} className="block">
                      <div className="flex items-center justify-between p-4 rounded-xl border-2 border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200">
                        <div className="flex items-center space-x-3">
                          <ShoppingCart className="h-6 w-6 text-gray-600" />
                          <span className="text-lg font-medium text-gray-800">Cart</span>
                        </div>
                        {cartCount > 0 && (
                          <Badge className="bg-red-500 text-white px-3 py-1">
                            {cartCount}
                          </Badge>
                        )}
                      </div>
                    </Link>

                    <Link href="/plans" onClick={() => setIsOpen(false)} className="block">
                      <Button className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-lg font-semibold rounded-xl shadow-lg">
                        🌍 Buy eSIM Now
                      </Button>
                    </Link>
                  </div>

                  {/* Company Links */}
                  <div className="space-y-3 pt-6 border-t border-gray-100">
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

              {/* Close overlay when clicking outside */}
              <div 
                className="absolute inset-0 -z-10" 
                onClick={() => setIsOpen(false)}
                aria-hidden="true"
              />
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
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
  Phone,
  MessageCircle,
  HelpCircle,
  ChevronDown,
  Star,
  MapPin,
  CreditCard,
  Gift
} from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth"
import { cn } from "@/lib/utils"

interface CartItem {
  quantity: number
}

// Extend the User type from auth.ts
interface AuthUser {
  name?: string
  email?: string
  avatar?: string
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
    description: "Step-by-step eSIM installation",
    icon: Smartphone,
  },
  {
    title: "Contact Us",
    href: "/contact",
    description: "24/7 customer support",
    icon: MessageCircle,
  },
  {
    title: "FAQ",
    href: "/faq",
    description: "Frequently asked questions",
    icon: Phone,
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
  const { user, signOut } = useAuth()
  const isHomePage = pathname === "/"

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
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

  const handleLogout = async () => {
    try {
      await signOut()
      toast.success('Logged out successfully')
      router.push('/')
    } catch (error) {
      toast.error('Failed to log out')
    }
  }

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
                <Globe className="h-8 w-8 text-blue-600 group-hover:text-blue-700 transition-colors" />
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

            {/* Admin Link */}
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="text-gray-700 hover:text-blue-600">
                <Settings className="h-4 w-4 mr-2" />
                Admin
              </Button>
            </Link>

            {/* User Menu or Sign In */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={(user as AuthUser).avatar} alt={(user as AuthUser).name || ''} />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {(user as AuthUser).name?.split(' ').map(n => n[0]).join('') || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{(user as AuthUser).name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {(user as AuthUser).email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <UserCircle className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile?tab=esims" className="cursor-pointer">
                      <Smartphone className="mr-2 h-4 w-4" />
                      <span>My eSIMs</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile?tab=orders" className="cursor-pointer">
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>Orders</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile?tab=rewards" className="cursor-pointer">
                      <Gift className="mr-2 h-4 w-4" />
                      <span>Rewards</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login">
                  <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
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
              className="text-gray-700 hover:text-blue-600"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>

            {/* Mobile Logo */}
            <Link href="/" className="flex items-center">
              <div className="flex items-center space-x-2">
                <Globe className="h-7 w-7 text-blue-600" />
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

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={(user as AuthUser).avatar} alt={(user as AuthUser).name || ''} />
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {(user as AuthUser).name?.split(' ').map(n => n[0]).join('') || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{(user as AuthUser).name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {(user as AuthUser).email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <UserCircle className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile?tab=esims" className="cursor-pointer">
                        <Smartphone className="mr-2 h-4 w-4" />
                        <span>My eSIMs</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto">
              <div className="px-4 py-6 space-y-6">
                {/* Plans Section */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Plans</h3>
                  <div className="space-y-2">
                    {navigationItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 text-gray-700 hover:text-blue-600"
                        onClick={() => setIsOpen(false)}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="text-sm font-medium">{item.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Support Section */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Support</h3>
                  <div className="space-y-2">
                    {supportItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 text-gray-700 hover:text-blue-600"
                        onClick={() => setIsOpen(false)}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="text-sm font-medium">{item.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {!user && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full">
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/signup" onClick={() => setIsOpen(false)}>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                          Get Started
                        </Button>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

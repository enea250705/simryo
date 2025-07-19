"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Globe, Search, ArrowRight } from "lucide-react"
import Link from "next/link"

interface MobileOptimizedHeroProps {
  isMobile: boolean
}

export default function MobileOptimizedHero({ isMobile }: MobileOptimizedHeroProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/plans?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <section className={`relative overflow-hidden ${isMobile ? 'pt-8 pb-12' : 'pt-12 pb-20'} hero-section`}>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200">
            Global eSIM Marketplace
          </Badge>
          
          <h1 className={`font-bold tracking-tight text-gray-900 mb-4 ${
            isMobile ? 'text-3xl' : 'text-4xl sm:text-5xl lg:text-6xl'
          }`}>
            Stay Connected
            <span className="block gradient-text">
              Anywhere
            </span>
          </h1>
          
          <p className={`text-gray-600 mb-6 max-w-3xl mx-auto leading-relaxed ${
            isMobile ? 'text-base' : 'text-xl sm:text-2xl'
          }`}>
            {isMobile 
              ? "Premium eSIM plans for global travelers. Instant activation, no contracts."
              : "Premium eSIM data plans for travelers worldwide. Instant activation, transparent pricing, no contracts."
            }
          </p>

          {/* Mobile-optimized search */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="search"
                placeholder={isMobile ? "Search destinations..." : "Search destinations, countries, or regions..."}
                className={`w-full pl-12 pr-4 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl ${
                  isMobile ? 'py-3 text-base' : 'py-4 text-lg'
                }`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          {/* Mobile-optimized CTA */}
          <div className={`flex ${isMobile ? 'flex-col' : 'flex-col sm:flex-row'} items-center justify-center gap-4 mb-6`}>
            <Link href="/plans">
              <Button 
                size="lg" 
                className={`${isMobile ? 'w-full' : 'w-full sm:w-auto'} bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 ${
                  isMobile ? 'py-3 px-6 text-base' : 'px-8 py-4 text-lg'
                } rounded-xl`}
              >
                <Globe className="mr-2 h-5 w-5" />
                {isMobile ? "Browse Plans" : "Browse All Plans"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Trust indicators - simplified for mobile */}
          <div className={`flex ${isMobile ? 'flex-col' : 'flex-wrap'} items-center justify-center gap-4 text-sm text-gray-600`}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>190+ Countries</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Instant Activation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
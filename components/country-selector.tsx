"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin } from "lucide-react"
import Link from "next/link"

const countries = [
  { id: 1, name: "United States", flag: "🇺🇸", region: "North America", popular: true },
  { id: 2, name: "United Kingdom", flag: "🇬🇧", region: "Europe", popular: true },
  { id: 3, name: "Japan", flag: "🇯🇵", region: "Asia", popular: true },
  { id: 4, name: "Australia", flag: "🇦🇺", region: "Oceania", popular: true },
  { id: 5, name: "Germany", flag: "🇩🇪", region: "Europe", popular: true },
  { id: 6, name: "France", flag: "🇫🇷", region: "Europe", popular: true },
  { id: 7, name: "Canada", flag: "🇨🇦", region: "North America", popular: false },
  { id: 8, name: "Italy", flag: "🇮🇹", region: "Europe", popular: false },
  { id: 9, name: "Spain", flag: "🇪🇸", region: "Europe", popular: false },
  { id: 10, name: "South Korea", flag: "🇰🇷", region: "Asia", popular: false },
]

interface CountrySelectorProps {
  onSelect?: (country: (typeof countries)[0]) => void
  showPopularOnly?: boolean
}

export function CountrySelector({ onSelect, showPopularOnly = false }: CountrySelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCountries = countries.filter((country) => {
    const matchesSearch = country.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPopular = !showPopularOnly || country.popular
    return matchesSearch && matchesPopular
  })

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search countries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Popular Countries */}
      {!searchTerm && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Destinations</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {countries
              .filter((c) => c.popular)
              .map((country) => (
                <Card
                  key={country.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onSelect?.(country)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">{country.flag}</div>
                    <div className="text-sm font-medium text-gray-900">{country.name}</div>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {country.region}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* All Countries */}
      <div>
        {searchTerm && (
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Results ({filteredCountries.length})</h3>
        )}
        <div className="space-y-2">
          {filteredCountries.map((country) => (
            <Card
              key={country.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onSelect?.(country)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{country.flag}</span>
                    <div>
                      <div className="font-medium text-gray-900">{country.name}</div>
                      <div className="text-sm text-gray-500">{country.region}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {country.popular && <Badge>Popular</Badge>}
                    <Link href={`/plans/${country.id}`}>
                      <Button size="sm">View Plans</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {filteredCountries.length === 0 && (
        <div className="text-center py-8">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No countries found</h3>
          <p className="text-gray-600">Try adjusting your search term</p>
        </div>
      )}
    </div>
  )
}

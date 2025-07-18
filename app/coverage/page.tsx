import { Metadata } from "next"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Globe, 
  Wifi, 
  Smartphone, 
  Shield,
  CheckCircle,
  Star,
  MapPin,
  Signal,
  Zap,
  Clock,
  Users,
  TrendingUp,
  Award,
  Network,
  Satellite,
  Radio
} from "lucide-react"

export const metadata: Metadata = {
  title: "Global Network Coverage - SIMRYO eSIM Plans",
  description: "Explore SIMRYO's extensive global network coverage across 190+ countries. Check 4G/5G availability, carrier partnerships, and network quality worldwide.",
  keywords: "global network coverage, esim coverage, 4g 5g networks, carrier partnerships, network quality, international roaming"
}

const coverageStats = [
  {
    icon: Globe,
    value: "190+",
    label: "Countries",
    description: "Comprehensive global coverage"
  },
  {
    icon: Network,
    value: "500+",
    label: "Carrier Partners",
    description: "Premium network providers"
  },
  {
    icon: Signal,
    value: "99.9%",
    label: "Network Uptime",
    description: "Reliable connectivity"
  },
  {
    icon: Zap,
    value: "5G",
    label: "Speed Available",
    description: "Latest network technology"
  }
]

const regions = [
  {
    name: "Europe",
    countries: 48,
    coverage: "Excellent",
    speed: "5G",
    icon: "🇪🇺",
    description: "Complete coverage across EU with premium carriers",
    highlights: ["27 EU countries", "5G in major cities", "No roaming fees within EU"]
  },
  {
    name: "Asia Pacific",
    countries: 42,
    coverage: "Excellent",
    speed: "4G/5G",
    icon: "🌏",
    description: "Comprehensive coverage from Japan to Australia",
    highlights: ["5G in major cities", "High-speed networks", "Business-friendly"]
  },
  {
    name: "Americas",
    countries: 35,
    coverage: "Very Good",
    speed: "4G/5G",
    icon: "🌎",
    description: "North and South America coverage",
    highlights: ["USA & Canada 5G", "Latin America 4G", "Wide rural coverage"]
  },
  {
    name: "Africa",
    countries: 54,
    coverage: "Good",
    speed: "4G",
    icon: "🌍",
    description: "Growing coverage across the continent",
    highlights: ["Major cities covered", "Expanding rural areas", "Affordable rates"]
  },
  {
    name: "Middle East",
    countries: 16,
    coverage: "Very Good",
    speed: "4G/5G",
    icon: "🕌",
    description: "Premium coverage in key business hubs",
    highlights: ["UAE 5G coverage", "Business centers", "High-speed networks"]
  }
]

const popularDestinations = [
  {
    country: "United States",
    flag: "🇺🇸",
    networks: ["Verizon", "T-Mobile", "AT&T"],
    speed: "5G",
    coverage: "98%",
    quality: "Excellent"
  },
  {
    country: "United Kingdom",
    flag: "🇬🇧",
    networks: ["EE", "O2", "Vodafone"],
    speed: "5G",
    coverage: "99%",
    quality: "Excellent"
  },
  {
    country: "Germany",
    flag: "🇩🇪",
    networks: ["Deutsche Telekom", "Vodafone", "O2"],
    speed: "5G",
    coverage: "97%",
    quality: "Excellent"
  },
  {
    country: "Japan",
    flag: "🇯🇵",
    networks: ["NTT DoCoMo", "SoftBank", "KDDI"],
    speed: "5G",
    coverage: "99%",
    quality: "Excellent"
  },
  {
    country: "France",
    flag: "🇫🇷",
    networks: ["Orange", "SFR", "Bouygues"],
    speed: "5G",
    coverage: "98%",
    quality: "Excellent"
  },
  {
    country: "Australia",
    flag: "🇦🇺",
    networks: ["Telstra", "Optus", "Vodafone"],
    speed: "5G",
    coverage: "96%",
    quality: "Excellent"
  },
  {
    country: "Canada",
    flag: "🇨🇦",
    networks: ["Rogers", "Bell", "Telus"],
    speed: "5G",
    coverage: "95%",
    quality: "Very Good"
  },
  {
    country: "South Korea",
    flag: "🇰🇷",
    networks: ["SK Telecom", "KT", "LG U+"],
    speed: "5G",
    coverage: "99%",
    quality: "Excellent"
  }
]

const networkFeatures = [
  {
    icon: Wifi,
    title: "High-Speed Connectivity",
    description: "4G/5G networks with speeds up to 1 Gbps in supported areas"
  },
  {
    icon: Shield,
    title: "Network Security",
    description: "Enterprise-grade security with encrypted connections"
  },
  {
    icon: Clock,
    title: "Instant Activation",
    description: "Connect to local networks within seconds of arrival"
  },
  {
    icon: Globe,
    title: "Seamless Roaming",
    description: "Automatic network switching for optimal coverage"
  }
]

export default function CoveragePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="pt-32 pb-20 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200">
              Global Network Coverage
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
              Connected Everywhere
              <span className="block text-blue-600">
                You Travel
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Experience seamless connectivity across 190+ countries with our premium 
              carrier partnerships and cutting-edge network technology.
            </p>
          </div>
        </div>
      </section>

      {/* Coverage Stats */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {coverageStats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4 group-hover:bg-blue-200 transition-colors">
                  <stat.icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-lg font-semibold text-gray-700 mb-1">{stat.label}</div>
                <div className="text-sm text-gray-500">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Regional Coverage */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Regional Coverage
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive coverage across all continents with local carrier partnerships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regions.map((region, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="text-4xl mb-4">{region.icon}</div>
                  <CardTitle className="text-xl font-bold text-gray-900">{region.name}</CardTitle>
                  <div className="text-sm text-gray-600">{region.countries} countries</div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Coverage:</span>
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      {region.coverage}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Speed:</span>
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                      {region.speed}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm">{region.description}</p>
                  <div className="space-y-2">
                    {region.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-start text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Popular Destinations
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Top travel destinations with premium network coverage and speeds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDestinations.map((destination, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="text-3xl mb-2">{destination.flag}</div>
                  <CardTitle className="text-lg font-bold text-gray-900">{destination.country}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Coverage:</span>
                    <span className="font-semibold text-gray-900">{destination.coverage}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Speed:</span>
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                      {destination.speed}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Quality:</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-gray-900">{destination.quality}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-xs text-gray-500 mb-2">Networks:</p>
                    <div className="flex flex-wrap gap-1">
                      {destination.networks.map((network, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {network}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Network Features */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Network Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced features that ensure optimal connectivity wherever you travel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {networkFeatures.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4 mx-auto">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage Map CTA */}
      <section className="py-16 sm:py-20 bg-blue-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Check Coverage for Your Destination
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Verify network coverage and speeds for your specific travel destination.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/plans"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-white text-blue-600 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <MapPin className="mr-2 h-5 w-5" />
                View Coverage Map
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold border-2 border-white text-white rounded-xl hover:bg-white hover:text-blue-600 transition-colors"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
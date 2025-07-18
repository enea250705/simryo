import { Metadata } from "next"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Check, 
  X, 
  Globe, 
  Wifi, 
  Shield,
  Zap,
  Clock,
  DollarSign,
  Users,
  Star,
  ArrowRight,
  Smartphone,
  MapPin,
  Calendar,
  Database,
  Info
} from "lucide-react"

export const metadata: Metadata = {
  title: "eSIM Pricing Plans - Transparent & Affordable | SIMRYO",
  description: "Compare SIMRYO's transparent eSIM pricing plans. No hidden fees, flexible data options, and competitive rates for 190+ countries worldwide.",
  keywords: "esim pricing, data plans, international roaming costs, transparent pricing, no hidden fees, travel data rates"
}

const pricingPlans = [
  {
    name: "Starter",
    description: "Perfect for short trips",
    price: "$9.99",
    duration: "7 days",
    data: "1GB",
    features: [
      "1GB high-speed data",
      "7 days validity",
      "50+ countries",
      "3G/4G speeds",
      "Basic support"
    ],
    limitations: [
      "Limited to 50 countries",
      "No 5G access",
      "Basic support only"
    ],
    popular: false,
    color: "gray"
  },
  {
    name: "Explorer",
    description: "Most popular choice",
    price: "$24.99",
    duration: "14 days",
    data: "5GB",
    features: [
      "5GB high-speed data",
      "14 days validity",
      "100+ countries",
      "4G/5G speeds",
      "Priority support",
      "Hotspot sharing",
      "Multiple profiles"
    ],
    limitations: [
      "No unlimited data",
      "Regional restrictions"
    ],
    popular: true,
    color: "blue"
  },
  {
    name: "Nomad",
    description: "For extended travel",
    price: "$49.99",
    duration: "30 days",
    data: "15GB",
    features: [
      "15GB high-speed data",
      "30 days validity",
      "190+ countries",
      "5G speeds",
      "24/7 premium support",
      "Unlimited hotspot",
      "Multiple profiles",
      "Data rollover"
    ],
    limitations: [
      "Fair usage policy applies"
    ],
    popular: false,
    color: "purple"
  },
  {
    name: "Unlimited",
    description: "Maximum flexibility",
    price: "$89.99",
    duration: "30 days",
    data: "Unlimited",
    features: [
      "Unlimited high-speed data",
      "30 days validity",
      "190+ countries",
      "5G speeds",
      "24/7 VIP support",
      "Unlimited hotspot",
      "Multiple profiles",
      "Data rollover",
      "Priority network access"
    ],
    limitations: [
      "Fair usage policy: 50GB/day"
    ],
    popular: false,
    color: "green"
  }
]

const regionalPricing = [
  {
    region: "Europe",
    flag: "🇪🇺",
    countries: "48 countries",
    priceRange: "$4.99 - $39.99",
    popular: "5GB/14 days - $19.99",
    features: ["5G coverage", "No roaming fees", "28 EU countries"]
  },
  {
    region: "Asia Pacific",
    flag: "🌏",
    countries: "42 countries",
    priceRange: "$6.99 - $44.99",
    popular: "3GB/7 days - $14.99",
    features: ["High-speed networks", "Business hubs", "Tourist friendly"]
  },
  {
    region: "Americas",
    flag: "🌎",
    countries: "35 countries",
    priceRange: "$7.99 - $49.99",
    popular: "5GB/14 days - $24.99",
    features: ["USA & Canada 5G", "Latin America 4G", "Wide coverage"]
  },
  {
    region: "Middle East & Africa",
    flag: "🌍",
    countries: "70 countries",
    priceRange: "$5.99 - $34.99",
    popular: "2GB/7 days - $12.99",
    features: ["Major cities", "Business centers", "Growing coverage"]
  }
]

const comparisonFeatures = [
  {
    feature: "Data Allowance",
    starter: "1GB",
    explorer: "5GB",
    nomad: "15GB",
    unlimited: "Unlimited"
  },
  {
    feature: "Validity Period",
    starter: "7 days",
    explorer: "14 days",
    nomad: "30 days",
    unlimited: "30 days"
  },
  {
    feature: "Country Coverage",
    starter: "50+ countries",
    explorer: "100+ countries",
    nomad: "190+ countries",
    unlimited: "190+ countries"
  },
  {
    feature: "Network Speed",
    starter: "3G/4G",
    explorer: "4G/5G",
    nomad: "5G",
    unlimited: "5G"
  },
  {
    feature: "Hotspot Sharing",
    starter: false,
    explorer: true,
    nomad: true,
    unlimited: true
  },
  {
    feature: "Multiple Profiles",
    starter: false,
    explorer: true,
    nomad: true,
    unlimited: true
  },
  {
    feature: "Data Rollover",
    starter: false,
    explorer: false,
    nomad: true,
    unlimited: true
  },
  {
    feature: "Priority Support",
    starter: false,
    explorer: true,
    nomad: true,
    unlimited: true
  }
]

const pricingFeatures = [
  {
    icon: DollarSign,
    title: "Transparent Pricing",
    description: "No hidden fees or surprise charges. What you see is what you pay."
  },
  {
    icon: Globe,
    title: "Global Coverage",
    description: "One plan works across multiple countries without additional charges."
  },
  {
    icon: Clock,
    title: "Flexible Duration",
    description: "Choose from 7, 14, or 30-day plans that fit your travel schedule."
  },
  {
    icon: Shield,
    title: "No Contracts",
    description: "Pay-as-you-go with no long-term commitments or contracts."
  }
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="pt-32 pb-20 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200">
              Transparent Pricing
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
              Simple, Honest
              <span className="block text-blue-600">
                eSIM Pricing
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Choose the perfect plan for your travel needs. No hidden fees, 
              no contracts, just transparent pricing you can trust.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Flexible plans designed for every type of traveler.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${plan.popular ? 'ring-2 ring-blue-500 transform scale-105' : ''}`}>
                <CardHeader className="text-center pb-4">
                  {plan.popular && (
                    <Badge className="mb-4 bg-blue-600 text-white">
                      Most Popular
                    </Badge>
                  )}
                  <CardTitle className="text-2xl font-bold text-gray-900">{plan.name}</CardTitle>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="mb-4">
                    <div className="text-4xl font-bold text-gray-900">{plan.price}</div>
                    <div className="text-sm text-gray-600">{plan.data} • {plan.duration}</div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start text-sm">
                        <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  {plan.limitations.length > 0 && (
                    <div className="space-y-3 border-t pt-4">
                      <p className="text-xs text-gray-500 font-medium">Limitations:</p>
                      {plan.limitations.map((limitation, idx) => (
                        <div key={idx} className="flex items-start text-sm">
                          <X className="h-4 w-4 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button 
                    className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-900 hover:bg-gray-800'} text-white`}
                    asChild
                  >
                    <Link href="/plans">
                      Choose Plan
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Regional Pricing */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Regional Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Competitive rates tailored to each region's market and infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {regionalPricing.map((region, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="text-4xl mb-4">{region.flag}</div>
                  <CardTitle className="text-xl font-bold text-gray-900">{region.region}</CardTitle>
                  <p className="text-sm text-gray-600">{region.countries}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900 mb-2">Price Range</div>
                    <div className="text-2xl font-bold text-blue-600">{region.priceRange}</div>
                  </div>
                  
                  <div className="text-center border-t pt-4">
                    <div className="text-sm text-gray-600 mb-2">Most Popular</div>
                    <div className="text-lg font-semibold text-gray-900">{region.popular}</div>
                  </div>

                  <div className="space-y-2">
                    {region.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start text-sm">
                        <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Compare Plans
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Detailed comparison of all features across our plans.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg shadow-lg">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-4 font-semibold text-gray-900">Features</th>
                  <th className="text-center p-4 font-semibold text-gray-900">Starter</th>
                  <th className="text-center p-4 font-semibold text-blue-600">Explorer</th>
                  <th className="text-center p-4 font-semibold text-gray-900">Nomad</th>
                  <th className="text-center p-4 font-semibold text-gray-900">Unlimited</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((item, index) => (
                  <tr key={index} className="border-t border-gray-200">
                    <td className="p-4 font-medium text-gray-900">{item.feature}</td>
                    <td className="p-4 text-center">
                      {typeof item.starter === 'boolean' ? (
                        item.starter ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-red-400 mx-auto" />
                        )
                      ) : (
                        <span className="text-gray-700">{item.starter}</span>
                      )}
                    </td>
                    <td className="p-4 text-center bg-blue-50">
                      {typeof item.explorer === 'boolean' ? (
                        item.explorer ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-red-400 mx-auto" />
                        )
                      ) : (
                        <span className="text-gray-700 font-medium">{item.explorer}</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {typeof item.nomad === 'boolean' ? (
                        item.nomad ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-red-400 mx-auto" />
                        )
                      ) : (
                        <span className="text-gray-700">{item.nomad}</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {typeof item.unlimited === 'boolean' ? (
                        item.unlimited ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-red-400 mx-auto" />
                        )
                      ) : (
                        <span className="text-gray-700">{item.unlimited}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing Features */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Why Choose SIMRYO?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transparent pricing with no hidden surprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pricingFeatures.map((feature, index) => (
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

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-blue-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Ready to Get Connected?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Choose your plan and start your journey with seamless global connectivity.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-xl"
                asChild
              >
                <Link href="/plans">
                  <Globe className="mr-2 h-5 w-5" />
                  Browse Plans
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg rounded-xl"
                asChild
              >
                <Link href="/contact">
                  Get Help Choosing
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
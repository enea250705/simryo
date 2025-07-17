import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Zap,
  DollarSign,
  Globe,
  Shield,
  Clock,
  Wifi,
  Smartphone,
  HeadphonesIcon,
  CheckCircle,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

export default function BenefitsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Why Choose SIMRYO?</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl">
            Experience the future of mobile connectivity with our premium eSIM technology. No more physical SIM cards,
            no more roaming surprises.
          </p>
        </div>

        {/* Main Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <Zap className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant Activation</h3>
              <p className="text-gray-600">
                Get connected in seconds with QR code activation. No waiting, no physical SIM cards.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <DollarSign className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Roaming Fees</h3>
              <p className="text-gray-600">Transparent pricing with no hidden charges. Pay only for what you use.</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <Globe className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Worldwide Coverage</h3>
              <p className="text-gray-600">Stay connected in 190+ countries with premium network partnerships.</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <Wifi className="h-12 w-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">High-Speed Data</h3>
              <p className="text-gray-600">4G/5G speeds with unlimited data options in most destinations.</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Advanced Features</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Clock className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Flexible Validity</h3>
                  <p className="text-gray-600">
                    Choose from 7, 15, or 30-day plans that fit your travel schedule perfectly.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Smartphone className="h-6 w-6 text-green-600 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Multi-Device Support</h3>
                  <p className="text-gray-600">
                    Use your eSIM on smartphones, tablets, and compatible devices seamlessly.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Shield className="h-6 w-6 text-purple-600 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Enterprise Security</h3>
                  <p className="text-gray-600">
                    Bank-level encryption and security protocols protect your data and privacy.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <HeadphonesIcon className="h-6 w-6 text-orange-600 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">24/7 Support</h3>
                  <p className="text-gray-600">
                    Get help whenever you need it with our round-the-clock customer support.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h3>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Choose Your Plan</h4>
                  <p className="text-gray-600 text-sm">Select the perfect data plan for your destination</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Instant Purchase</h4>
                  <p className="text-gray-600 text-sm">Complete your purchase and receive QR code instantly</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Scan & Connect</h4>
                  <p className="text-gray-600 text-sm">Scan the QR code and get connected immediately</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">SIMRYO vs Traditional Roaming</h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Feature</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">SIMRYO eSIM</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Traditional Roaming</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-900">Setup Time</td>
                      <td className="px-6 py-4">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm text-gray-600">Instant</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">Hours/Days</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-900">Cost Transparency</td>
                      <td className="px-6 py-4">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm text-gray-600">Fixed Price</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">Variable/Hidden Fees</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-900">Physical SIM Required</td>
                      <td className="px-6 py-4 text-sm text-gray-600">No</td>
                      <td className="px-6 py-4">
                        <CheckCircle className="h-5 w-5 text-red-600" />
                        <span className="text-sm text-gray-600">Yes</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-900">Network Quality</td>
                      <td className="px-6 py-4">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm text-gray-600">Premium Partners</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">Variable</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-8 sm:p-12">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
              <div>
                <h2 className="text-3xl font-bold mb-2">Ready to Get Started?</h2>
                <p className="max-w-xl mb-6 lg:mb-0">
                  Browse our plans and get your eSIM in minutes. Instant connectivity is just a few clicks away.
                </p>
              </div>
            <Link href="/plans">
                <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-gray-100 flex-shrink-0">
                  Browse All Plans
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

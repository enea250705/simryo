import { Metadata } from "next"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Globe, 
  Users, 
  TrendingUp, 
  Shield, 
  Zap,
  Award,
  Heart,
  CheckCircle,
  Target,
  Smartphone,
  Wifi,
  Lock
} from "lucide-react"

export const metadata: Metadata = {
  title: "About SIMRYO - Global eSIM Solutions for Modern Travelers",
  description: "Learn about SIMRYO's mission to provide seamless global connectivity through innovative eSIM technology. Discover our story, values, and commitment to travelers worldwide.",
  keywords: "about simryo, esim company, global connectivity, travel technology, our mission, our story"
}

const stats = [
  {
    icon: Users,
    value: "2M+",
    label: "Happy Customers",
    description: "Travelers worldwide trust SIMRYO"
  },
  {
    icon: Globe,
    value: "190+",
    label: "Countries",
    description: "Global coverage everywhere you go"
  },
  {
    icon: TrendingUp,
    value: "99.9%",
    label: "Uptime",
    description: "Reliable connection you can count on"
  },
  {
    icon: Award,
    value: "4.8★",
    label: "Customer Rating",
    description: "Rated excellent by our users"
  }
]

const values = [
  {
    icon: Globe,
    title: "Global Accessibility",
    description: "Making connectivity accessible to travelers in 190+ countries worldwide."
  },
  {
    icon: Shield,
    title: "Security First",
    description: "Enterprise-grade security protecting your data and privacy at all times."
  },
  {
    icon: Zap,
    title: "Instant Connectivity",
    description: "Get connected in seconds with our instant eSIM activation technology."
  },
  {
    icon: Heart,
    title: "Customer Focused",
    description: "Your travel experience matters. We're here to support you 24/7."
  },
  {
    icon: CheckCircle,
    title: "Transparent Pricing",
    description: "No hidden fees, no surprises. Just honest, upfront pricing."
  },
  {
    icon: Target,
    title: "Innovation Driven",
    description: "Continuously improving our technology to serve you better."
  }
]

const timeline = [
  {
    year: "2024",
    title: "Global Expansion",
    description: "Reached 190+ countries with premium eSIM coverage and launched 24/7 customer support."
  },
  {
    year: "2023", 
    title: "Technology Innovation",
    description: "Introduced instant eSIM activation and multi-profile support for seamless travel experiences."
  },
  {
    year: "2022",
    title: "Market Leadership",
    description: "Became a leading eSIM provider with over 1 million satisfied customers worldwide."
  },
  {
    year: "2021",
    title: "Company Founded",
    description: "SIMRYO was founded with a mission to revolutionize global connectivity for travelers."
  }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="pt-32 pb-20 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200">
              About SIMRYO
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
              Connecting Travelers
              <span className="block text-blue-600">
                Around the World
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              SIMRYO is revolutionizing global connectivity with innovative eSIM technology, 
              making it easier than ever for travelers to stay connected wherever they go.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
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

      {/* Mission Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Our Mission
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              To eliminate connectivity barriers and empower travelers with seamless, 
              affordable global communication solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
                    <value.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">{value.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Our Story
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From startup to global leader, discover how SIMRYO is transforming 
              the way people connect while traveling.
            </p>
          </div>

          <div className="space-y-12">
            {timeline.map((item, index) => (
              <div key={index} className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {item.year}
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-lg">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Cutting-Edge Technology
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powered by advanced eSIM technology and partnerships with global carriers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg text-center">
              <CardHeader>
                <Smartphone className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-xl font-bold">eSIM Technology</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Advanced embedded SIM technology that eliminates the need for physical SIM cards.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center">
              <CardHeader>
                <Wifi className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-xl font-bold">Global Networks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Partnerships with premium carriers worldwide for the best coverage and speeds.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center">
              <CardHeader>
                <Lock className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                <CardTitle className="text-xl font-bold">Secure Platform</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Enterprise-grade security protecting your data and ensuring safe transactions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 sm:py-20 bg-blue-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Ready to Get Connected?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join millions of travelers who trust SIMRYO for their global connectivity needs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/plans"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-white text-blue-600 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Explore Plans
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold border-2 border-white text-white rounded-xl hover:bg-white hover:text-blue-600 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
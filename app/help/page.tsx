import { Metadata } from "next"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  Smartphone, 
  Wifi, 
  CreditCard,
  Settings,
  Shield,
  Globe,
  MessageCircle,
  BookOpen,
  Video,
  Mail,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  Info,
  ArrowRight,
  Headphones,
  FileText,
  Download,
  Star,
  ThumbsUp
} from "lucide-react"

export const metadata: Metadata = {
  title: "Help Center - SIMRYO Support & Guides",
  description: "Get help with your SIMRYO eSIM. Find setup guides, troubleshooting tips, FAQs, and contact support for international travel connectivity.",
  keywords: "help center, esim support, setup guides, troubleshooting, faq, customer support, esim activation"
}

const helpCategories = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "New to eSIM? Learn the basics",
    icon: BookOpen,
    color: "bg-blue-100 text-blue-600",
    articles: [
      "What is an eSIM and how does it work?",
      "How to check if my device supports eSIM",
      "First-time setup guide",
      "Choosing the right plan for your trip"
    ]
  },
  {
    id: "device-compatibility",
    title: "Device Compatibility",
    description: "Check if your device works with eSIM",
    icon: Smartphone,
    color: "bg-green-100 text-green-600",
    articles: [
      "Supported iPhone models",
      "Supported Android devices",
      "iPad and tablet compatibility",
      "Unlocking your device for eSIM"
    ]
  },
  {
    id: "activation-setup",
    title: "Activation & Setup",
    description: "Step-by-step activation guides",
    icon: Settings,
    color: "bg-purple-100 text-purple-600",
    articles: [
      "How to scan QR code and activate",
      "Manual eSIM installation",
      "Setting up data and roaming",
      "Switching between eSIM profiles"
    ]
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting",
    description: "Solve common issues quickly",
    icon: AlertCircle,
    color: "bg-orange-100 text-orange-600",
    articles: [
      "eSIM not connecting to network",
      "Slow internet speeds",
      "Can't receive QR code",
      "Data not working abroad"
    ]
  },
  {
    id: "billing-payments",
    title: "Billing & Payments",
    description: "Payment and billing questions",
    icon: CreditCard,
    color: "bg-yellow-100 text-yellow-600",
    articles: [
      "How to pay for eSIM plans",
      "Understanding your invoice",
      "Refund policy and process",
      "Payment methods accepted"
    ]
  },
  {
    id: "coverage-networks",
    title: "Coverage & Networks",
    description: "Network coverage information",
    icon: Globe,
    color: "bg-teal-100 text-teal-600",
    articles: [
      "Check coverage in your destination",
      "Network partners and carriers",
      "5G vs 4G availability",
      "Rural coverage limitations"
    ]
  }
]

const popularArticles = [
  {
    title: "How to activate your eSIM",
    views: "25,432",
    category: "Setup",
    icon: Smartphone,
    helpful: "98%"
  },
  {
    title: "Troubleshooting connection issues",
    views: "18,967",
    category: "Troubleshooting",
    icon: Wifi,
    helpful: "94%"
  },
  {
    title: "Supported devices list",
    views: "15,234",
    category: "Compatibility",
    icon: CheckCircle,
    helpful: "96%"
  },
  {
    title: "Understanding data usage",
    views: "12,876",
    category: "Usage",
    icon: FileText,
    helpful: "92%"
  }
]

const supportOptions = [
  {
    title: "Live Chat",
    description: "Get instant help from our support team",
    icon: MessageCircle,
    color: "bg-blue-600",
    availability: "24/7 available",
    responseTime: "< 2 minutes"
  },
  {
    title: "Email Support",
    description: "Send us detailed questions",
    icon: Mail,
    color: "bg-green-600",
    availability: "info@simryo.com",
    responseTime: "< 4 hours"
  },
  {
    title: "Video Guides",
    description: "Watch step-by-step tutorials",
    icon: Video,
    color: "bg-purple-600",
    availability: "Available 24/7",
    responseTime: "Instant access"
  },
  {
    title: "Community Forum",
    description: "Connect with other travelers",
    icon: Users,
    color: "bg-orange-600",
    availability: "Community driven",
    responseTime: "Varies"
  }
]

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="pt-32 pb-20 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200">
              Help Center
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
              How Can We
              <span className="block text-blue-600">
                Help You?
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Find answers to common questions, step-by-step guides, 
              and get support for your SIMRYO eSIM.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
                <Input
                  placeholder="Search for help articles, guides, or topics..."
                  className="w-full pl-12 pr-4 py-6 text-lg rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Get Support
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Multiple ways to get the help you need, when you need it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportOptions.map((option, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="text-center pb-4">
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${option.color} rounded-2xl mb-4 mx-auto`}>
                    <option.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900">{option.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-2">
                  <p className="text-gray-600 mb-4">{option.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {option.availability}
                    </div>
                    <div className="text-sm font-medium text-blue-600">
                      {option.responseTime}
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-gray-900 hover:bg-gray-800 text-white">
                    {option.title === "Email Support" ? "Send Email" : 
                     option.title === "Live Chat" ? "Start Chat" :
                     option.title === "Video Guides" ? "Watch Videos" : "Join Community"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Browse Help Topics
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find detailed guides and articles organized by category.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {helpCategories.map((category) => (
              <Card key={category.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full ${category.color}`}>
                      <category.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-900">{category.title}</CardTitle>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {category.articles.map((article, idx) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <ArrowRight className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700 hover:text-blue-600 cursor-pointer">
                        {article}
                      </span>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full mt-4">
                    View All Articles
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Popular Articles
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Most viewed and helpful articles from our community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {popularArticles.map((article, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <article.icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold text-gray-900">{article.title}</CardTitle>
                        <Badge variant="secondary" className="mt-1">
                          {article.category}
                        </Badge>
                      </div>
                    </div>
                    <Star className="h-5 w-5 text-yellow-500" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{article.views} views</span>
                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="h-4 w-4 text-green-500" />
                      <span className="text-green-600">{article.helpful} helpful</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Read Article
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Quick Links
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Common tasks and important information.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center pb-4">
                <Download className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-lg font-bold text-gray-900">Setup Guide</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">Download our comprehensive setup guide</p>
                <Button variant="outline" className="w-full">
                  Download PDF
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center pb-4">
                <Smartphone className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-lg font-bold text-gray-900">Device Check</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">Check if your device supports eSIM</p>
                <Button variant="outline" className="w-full">
                  Check Device
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center pb-4">
                <Globe className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle className="text-lg font-bold text-gray-900">Coverage Map</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">Check network coverage worldwide</p>
                <Button variant="outline" className="w-full">
                  View Coverage
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center pb-4">
                <MessageCircle className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle className="text-lg font-bold text-gray-900">Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">Get personalized help from our team</p>
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Still Need Help */}
      <section className="py-16 sm:py-20 bg-blue-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Still Need Help?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Our support team is here to help you get connected. 
              Contact us anytime for personalized assistance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-xl"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Start Live Chat
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg rounded-xl"
              >
                <Mail className="mr-2 h-5 w-5" />
                Email Support
              </Button>
            </div>
            <p className="mt-6 text-sm text-blue-100">
              Email: <a href="mailto:info@simryo.com" className="underline hover:text-white">info@simryo.com</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
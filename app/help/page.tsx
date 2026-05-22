import { Metadata } from "next"
import Link from "next/link"
import { Smartphone, CreditCard, Settings, Globe, MessageCircle, BookOpen, Mail, AlertCircle, ArrowRight } from "lucide-react"
import { HelpSearch } from "@/components/help-search"

export const metadata: Metadata = {
  title: "Help Center - SIMRYO Support & Guides",
  description: "Get help with your SIMRYO eSIM. Find setup guides, troubleshooting tips, FAQs, and contact support.",
}

const helpCategories = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "New to eSIM? Learn the basics",
    icon: BookOpen,
    articles: [
      "What is an eSIM and how does it work?",
      "How to check if my device supports eSIM",
      "First-time setup guide",
      "Choosing the right plan for your trip",
    ]
  },
  {
    id: "device-compatibility",
    title: "Device Compatibility",
    description: "Check if your device works with eSIM",
    icon: Smartphone,
    articles: [
      "Supported iPhone models",
      "Supported Android devices",
      "iPad and tablet compatibility",
      "Unlocking your device for eSIM",
    ]
  },
  {
    id: "activation-setup",
    title: "Activation & Setup",
    description: "Step-by-step activation guides",
    icon: Settings,
    articles: [
      "How to scan QR code and activate",
      "Manual eSIM installation",
      "Setting up data and roaming",
      "Switching between eSIM profiles",
    ]
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting",
    description: "Solve common issues quickly",
    icon: AlertCircle,
    articles: [
      "eSIM not connecting to network",
      "Slow internet speeds",
      "Can't receive QR code",
      "Data not working abroad",
    ]
  },
  {
    id: "billing-payments",
    title: "Billing & Payments",
    description: "Payment and billing questions",
    icon: CreditCard,
    articles: [
      "How to pay for eSIM plans",
      "Understanding your invoice",
      "Refund policy and process",
      "Payment methods accepted",
    ]
  },
  {
    id: "coverage-networks",
    title: "Coverage & Networks",
    description: "Network coverage information",
    icon: Globe,
    articles: [
      "Check coverage in your destination",
      "Network partners and carriers",
      "5G vs 4G availability",
      "Rural coverage limitations",
    ]
  }
]

const popularArticles = [
  { title: "How to activate your eSIM", category: "Setup", href: "/setup" },
  { title: "Troubleshooting connection issues", category: "Troubleshooting", href: "/faq" },
  { title: "Supported devices list", category: "Compatibility", href: "/setup" },
  { title: "Understanding data usage", category: "Usage", href: "/faq" },
]

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">Help center</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">How can we help?</h1>
          <p className="text-gray-500 mb-6">Guides, troubleshooting, and support for your SIMRYO eSIM.</p>

          <HelpSearch />
        </div>

        {/* Support options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          <a href="mailto:info@simryo.com" className="flex items-start gap-4 border border-gray-200 hover:border-gray-300 rounded-xl p-5 transition-colors">
            <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
              <Mail className="h-4 w-4 text-gray-600" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">Email support</div>
              <div className="text-sm text-gray-500 mt-0.5">info@simryo.com · reply within 4 hours</div>
            </div>
          </a>
          <Link href="/support" className="flex items-start gap-4 border border-gray-200 hover:border-gray-300 rounded-xl p-5 transition-colors">
            <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
              <MessageCircle className="h-4 w-4 text-gray-600" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">Live chat</div>
              <div className="text-sm text-gray-500 mt-0.5">Available 24/7 · under 2 minutes</div>
            </div>
          </Link>
        </div>

        {/* Popular articles */}
        <div className="mb-12">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Popular articles</h2>
          <div className="border border-gray-200 rounded-xl divide-y divide-gray-100">
            {popularArticles.map((article, i) => (
              <Link key={i} href={article.href} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors">
                <div>
                  <span className="text-sm font-medium text-gray-900">{article.title}</span>
                  <span className="ml-2 text-xs text-gray-400">{article.category}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-300 shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Browse by topic</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {helpCategories.map((cat) => (
              <div key={cat.id} className="border border-gray-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                    <cat.icon className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{cat.title}</div>
                    <div className="text-xs text-gray-400">{cat.description}</div>
                  </div>
                </div>
                <ul className="space-y-2">
                  {cat.articles.map((article, i) => (
                    <li key={i}>
                      <Link href={cat.id === 'activation-setup' || cat.id === 'device-compatibility' ? '/setup' : cat.id === 'billing-payments' ? '/refund' : '/faq'} className="flex items-start gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                        <ArrowRight className="h-3.5 w-3.5 text-gray-300 mt-0.5 shrink-0" />
                        {article}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="border border-gray-200 rounded-xl p-6 bg-gray-50 text-center">
          <p className="text-sm font-semibold text-gray-900 mb-1">Still need help?</p>
          <p className="text-sm text-gray-500 mb-5">Our support team is available 24/7.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <a href="mailto:info@simryo.com">
              <button className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                <Mail className="h-4 w-4" />
                Email us
              </button>
            </a>
            <Link href="/faq">
              <button className="inline-flex items-center gap-2 border border-gray-200 hover:border-gray-300 bg-white text-gray-700 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                View FAQs
              </button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}

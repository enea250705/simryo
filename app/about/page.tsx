import { Metadata } from "next"
import Link from "next/link"
import { Globe, Shield, Zap, Users, TrendingUp, Award } from "lucide-react"

export const metadata: Metadata = {
  title: "About SIMRYO - Global eSIM Solutions for Modern Travelers",
  description: "Learn about SIMRYO's mission to provide seamless global connectivity through eSIM technology.",
}

const stats = [
  { value: "2M+", label: "Customers", description: "Travelers worldwide" },
  { value: "190+", label: "Countries", description: "Global coverage" },
  { value: "99.9%", label: "Uptime", description: "Reliable connection" },
  { value: "4.8★", label: "Rating", description: "Average customer score" },
]

const values = [
  { icon: Globe, title: "Global coverage", description: "Connectivity in 190+ countries with premium local carriers." },
  { icon: Shield, title: "Security first", description: "Enterprise-grade security protecting your data at all times." },
  { icon: Zap, title: "Instant activation", description: "Get connected in seconds — no physical SIM needed." },
]

const timeline = [
  { year: "2024", title: "Global expansion", description: "Reached 190+ countries and launched 24/7 customer support." },
  { year: "2023", title: "Instant activation", description: "Introduced QR-code eSIM activation and multi-profile support." },
  { year: "2022", title: "1M customers", description: "Crossed 1 million satisfied customers worldwide." },
  { year: "2021", title: "Founded", description: "SIMRYO launched with a mission to simplify travel connectivity." },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div className="mb-12">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">About</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Connecting travelers worldwide</h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            SIMRYO provides instant eSIM plans for 190+ countries — no physical SIM, no roaming surprises, no contracts.
            We exist to make international connectivity simple and affordable.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-14">
          {stats.map((s, i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-gray-900">{s.value}</div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div className="mb-14">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">Our mission</h2>
          <p className="text-gray-500 mb-6">
            Eliminate connectivity barriers for travelers. No complex setup, no roaming bills, no physical SIM swaps.
            Just scan a QR code and go.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {values.map((v, i) => (
              <div key={i} className="flex items-start gap-3 border border-gray-200 rounded-xl p-4">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                  <v.icon className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{v.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{v.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-14">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Our story</h2>
          <div className="space-y-0">
            {timeline.map((item, i) => (
              <div key={i} className="flex gap-5 pb-8 last:pb-0">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {item.year}
                  </div>
                  {i < timeline.length - 1 && <div className="w-px flex-1 bg-gray-200 mt-2" />}
                </div>
                <div className="pt-1.5">
                  <div className="text-sm font-semibold text-gray-900 mb-1">{item.title}</div>
                  <div className="text-sm text-gray-500">{item.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="border border-gray-200 rounded-xl p-6 bg-gray-50 text-center">
          <p className="text-sm font-semibold text-gray-900 mb-1">Ready to get connected?</p>
          <p className="text-sm text-gray-500 mb-5">Browse plans for 190+ countries.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/plans">
              <button className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                Browse plans
              </button>
            </Link>
            <Link href="/contact">
              <button className="inline-flex items-center gap-2 border border-gray-200 hover:border-gray-300 bg-white text-gray-700 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                Contact us
              </button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}

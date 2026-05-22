import { Zap, DollarSign, Globe, Shield, Clock, Wifi, Smartphone, HeadphonesIcon, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

const benefits = [
  { icon: Zap, title: "Instant activation", description: "Get connected in seconds with QR code setup. No waiting, no physical SIM cards." },
  { icon: DollarSign, title: "No roaming fees", description: "Transparent pricing, no hidden charges. Pay only for what you use." },
  { icon: Globe, title: "190+ countries", description: "Stay connected worldwide with premium network partnerships." },
  { icon: Wifi, title: "4G/5G speeds", description: "High-speed data with unlimited options in most destinations." },
]

const features = [
  { icon: Clock, title: "Flexible validity", description: "Choose from 7, 15, or 30-day plans that fit your travel schedule." },
  { icon: Smartphone, title: "Multi-device support", description: "Use your eSIM on smartphones, tablets, and compatible devices." },
  { icon: Shield, title: "Secure connection", description: "Bank-level encryption and security protocols protect your data and privacy." },
  { icon: HeadphonesIcon, title: "24/7 support", description: "Get help whenever you need it with round-the-clock customer support." },
]

const steps = [
  { n: "1", title: "Choose your plan", desc: "Select the right data plan for your destination" },
  { n: "2", title: "Purchase instantly", desc: "Complete checkout and receive your QR code immediately" },
  { n: "3", title: "Scan and connect", desc: "Scan the QR code and you're online" },
]

const comparison = [
  { feature: "Setup time", simryo: "Instant", roaming: "Hours or days" },
  { feature: "Pricing", simryo: "Fixed, upfront", roaming: "Variable with hidden fees" },
  { feature: "Physical SIM required", simryo: "No", roaming: "Yes" },
  { feature: "Network quality", simryo: "Premium carriers", roaming: "Variable" },
]

export default function BenefitsPage() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div className="mb-12">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">Benefits</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Why choose SIMRYO?</h1>
          <p className="text-gray-500 max-w-2xl">No physical SIM cards, no roaming surprises. Just instant connectivity wherever you travel.</p>
        </div>

        {/* Main benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {benefits.map((b, i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-5">
              <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <b.icon className="h-4 w-4 text-gray-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{b.title}</h3>
              <p className="text-sm text-gray-500">{b.description}</p>
            </div>
          ))}
        </div>

        {/* Features + how it works */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Features</h2>
            <div className="space-y-5">
              {features.map((f, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                    <f.icon className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{f.title}</div>
                    <div className="text-sm text-gray-500 mt-0.5">{f.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">How it works</h2>
            <div className="space-y-0">
              {steps.map((s, i) => (
                <div key={i} className="flex gap-4 pb-6 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-900 text-white text-sm font-bold flex items-center justify-center shrink-0">
                      {s.n}
                    </div>
                    {i < steps.length - 1 && <div className="w-px flex-1 bg-gray-200 mt-2" />}
                  </div>
                  <div className="pt-1">
                    <div className="text-sm font-semibold text-gray-900">{s.title}</div>
                    <div className="text-sm text-gray-500 mt-0.5">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Comparison table */}
        <div className="mb-14">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">SIMRYO vs traditional roaming</h2>
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3 text-left font-semibold text-gray-700">Feature</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-700">SIMRYO eSIM</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-700">Traditional roaming</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {comparison.map((row, i) => (
                  <tr key={i}>
                    <td className="px-5 py-3 text-gray-700 font-medium">{row.feature}</td>
                    <td className="px-5 py-3 text-gray-900 font-semibold">{row.simryo}</td>
                    <td className="px-5 py-3 text-gray-400">{row.roaming}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="border border-gray-200 rounded-xl p-6 bg-gray-50 text-center">
          <p className="text-sm font-semibold text-gray-900 mb-1">Ready to get started?</p>
          <p className="text-sm text-gray-500 mb-5">Browse plans for 190+ countries. Instant setup, no contracts.</p>
          <Link href="/plans">
            <button className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
              Browse Plans
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </div>

      </div>
    </div>
  )
}

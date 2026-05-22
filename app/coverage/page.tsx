import { Metadata } from "next"
import Link from "next/link"
import { Wifi, Shield, Clock, Globe, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Global Network Coverage - SIMRYO eSIM Plans",
  description: "Explore SIMRYO's global network coverage across 190+ countries. Check 4G/5G availability and carrier partnerships.",
}

const regions = [
  { name: "Europe", countries: 48, speed: "4G/5G", highlights: ["27 EU countries", "5G in major cities", "No roaming fees within EU"] },
  { name: "Asia Pacific", countries: 42, speed: "4G/5G", highlights: ["5G in major cities", "High-speed networks", "Japan, Korea, Australia covered"] },
  { name: "Americas", countries: 35, speed: "4G/5G", highlights: ["USA & Canada 5G", "Latin America 4G", "Wide rural coverage"] },
  { name: "Africa", countries: 54, speed: "4G", highlights: ["Major cities covered", "Expanding rural areas", "Affordable rates"] },
  { name: "Middle East", countries: 16, speed: "4G/5G", highlights: ["UAE 5G coverage", "Business centers", "High-speed networks"] },
]

const popularDestinations = [
  { country: "United States", code: "us", networks: ["Verizon", "T-Mobile", "AT&T"], speed: "5G", coverage: "98%" },
  { country: "United Kingdom", code: "gb", networks: ["EE", "O2", "Vodafone"], speed: "5G", coverage: "99%" },
  { country: "Germany", code: "de", networks: ["Deutsche Telekom", "Vodafone", "O2"], speed: "5G", coverage: "97%" },
  { country: "Japan", code: "jp", networks: ["NTT DoCoMo", "SoftBank", "KDDI"], speed: "5G", coverage: "99%" },
  { country: "France", code: "fr", networks: ["Orange", "SFR", "Bouygues"], speed: "5G", coverage: "98%" },
  { country: "Australia", code: "au", networks: ["Telstra", "Optus", "Vodafone"], speed: "5G", coverage: "96%" },
  { country: "Canada", code: "ca", networks: ["Rogers", "Bell", "Telus"], speed: "5G", coverage: "95%" },
  { country: "South Korea", code: "kr", networks: ["SK Telecom", "KT", "LG U+"], speed: "5G", coverage: "99%" },
]

const features = [
  { icon: Wifi, title: "High-speed connectivity", description: "4G/5G networks with speeds up to 1 Gbps in supported areas." },
  { icon: Shield, title: "Network security", description: "Enterprise-grade security with encrypted connections." },
  { icon: Clock, title: "Instant activation", description: "Connect to local networks within seconds of arrival." },
  { icon: Globe, title: "Seamless roaming", description: "Automatic network switching for optimal coverage." },
]

export default function CoveragePage() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div className="mb-12">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">Coverage</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Connected everywhere you travel</h1>
          <p className="text-gray-500 max-w-2xl">190+ countries, 500+ carrier partners, 4G/5G where available.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
          {[
            { value: "190+", label: "Countries" },
            { value: "500+", label: "Carrier partners" },
            { value: "99.9%", label: "Network uptime" },
            { value: "5G", label: "Speed available" },
          ].map((s, i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-gray-900">{s.value}</div>
              <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Regional coverage */}
        <div className="mb-14">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">Regional coverage</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {regions.map((r, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-gray-900">{r.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{r.countries} countries</span>
                    <span className="text-xs font-semibold bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">{r.speed}</span>
                  </div>
                </div>
                <ul className="space-y-1">
                  {r.highlights.map((h, j) => (
                    <li key={j} className="text-xs text-gray-500 flex items-start gap-1.5">
                      <span className="text-gray-300 mt-0.5">·</span>{h}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Popular destinations */}
        <div className="mb-14">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">Popular destinations</h2>
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Country</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Speed</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Coverage</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Networks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {popularDestinations.map((d, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <img src={`https://flagcdn.com/w40/${d.code}.png`} alt={d.country} className="w-6 h-4 rounded-sm object-cover border border-gray-100" />
                        <span className="font-medium text-gray-900">{d.country}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs font-semibold bg-gray-100 text-gray-700 rounded-full px-2 py-0.5">{d.speed}</span>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{d.coverage}</td>
                    <td className="px-5 py-3 hidden sm:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {d.networks.map((n, j) => (
                          <span key={j} className="text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5">{n}</span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Features */}
        <div className="mb-14">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">Network features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <div key={i} className="flex items-start gap-4 border border-gray-200 rounded-xl p-5">
                <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
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

        {/* CTA */}
        <div className="border border-gray-200 rounded-xl p-6 bg-gray-50 text-center">
          <p className="text-sm font-semibold text-gray-900 mb-1">Ready to get connected?</p>
          <p className="text-sm text-gray-500 mb-5">Browse plans for any destination.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/plans">
              <button className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                Browse Plans <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
            <Link href="/contact">
              <button className="inline-flex items-center gap-2 border border-gray-200 hover:border-gray-300 bg-white text-gray-700 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                Contact support
              </button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}

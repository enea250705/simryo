"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, ArrowRight } from "lucide-react"

const allArticles = [
  { title: "What is an eSIM?", category: "Getting Started", href: "/faq" },
  { title: "How to check if my device supports eSIM", category: "Getting Started", href: "/faq" },
  { title: "First-time setup guide", category: "Getting Started", href: "/setup" },
  { title: "Choosing the right plan for your trip", category: "Getting Started", href: "/plans" },
  { title: "Supported iPhone models", category: "Device Compatibility", href: "/setup" },
  { title: "Supported Android devices", category: "Device Compatibility", href: "/setup" },
  { title: "Unlocking your device for eSIM", category: "Device Compatibility", href: "/faq" },
  { title: "How to scan QR code and activate", category: "Activation & Setup", href: "/setup" },
  { title: "Manual eSIM installation", category: "Activation & Setup", href: "/setup" },
  { title: "Setting up data and roaming", category: "Activation & Setup", href: "/setup" },
  { title: "Switching between eSIM profiles", category: "Activation & Setup", href: "/setup" },
  { title: "eSIM not connecting to network", category: "Troubleshooting", href: "/faq" },
  { title: "Slow internet speeds", category: "Troubleshooting", href: "/faq" },
  { title: "Data not working abroad", category: "Troubleshooting", href: "/faq" },
  { title: "How to pay for eSIM plans", category: "Billing & Payments", href: "/faq" },
  { title: "Refund policy and process", category: "Billing & Payments", href: "/refund" },
  { title: "Payment methods accepted", category: "Billing & Payments", href: "/faq" },
  { title: "Check coverage in your destination", category: "Coverage & Networks", href: "/coverage" },
  { title: "5G vs 4G availability", category: "Coverage & Networks", href: "/faq" },
]

export function HelpSearch() {
  const [query, setQuery] = useState("")

  const results = query.trim().length > 1
    ? allArticles.filter(a =>
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : []

  return (
    <div className="relative max-w-xl mb-10">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search help articles..."
        className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 focus:border-gray-400 focus:outline-none text-sm bg-white"
        autoComplete="off"
      />

      {results.length > 0 && (
        <div className="absolute z-50 top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {results.map((a, i) => (
            <Link
              key={i}
              href={a.href}
              onClick={() => setQuery("")}
              className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <div>
                <div className="text-sm font-medium text-gray-900">{a.title}</div>
                <div className="text-xs text-gray-400">{a.category}</div>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-gray-300 shrink-0" />
            </Link>
          ))}
        </div>
      )}

      {query.trim().length > 1 && results.length === 0 && (
        <div className="absolute z-50 top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3">
          <p className="text-sm text-gray-500">No results for "{query}"</p>
        </div>
      )}
    </div>
  )
}

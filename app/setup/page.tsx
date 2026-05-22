"use client"

import { useState } from "react"
import { CheckCircle, AlertCircle, Apple, Phone } from "lucide-react"
import Link from "next/link"

const deviceSteps = {
  ios: [
    { title: "Check your iPhone", description: "iPhone XS/XR or newer with iOS 12.1+ required." },
    { title: "Connect to Wi-Fi", description: "Use a stable Wi-Fi network for the installation." },
    { title: "Open Settings", description: "Go to Settings → Cellular → Add Cellular Plan." },
    { title: "Scan the QR code", description: "Point your camera at the QR code from your confirmation email." },
    { title: "Done", description: "Name your plan and you're ready to go." },
  ],
  android: [
    { title: "Check your phone", description: "Google Pixel 3+, Samsung Galaxy S20+, or any eSIM-compatible device." },
    { title: "Connect to Wi-Fi", description: "Use a stable Wi-Fi network for the installation." },
    { title: "Open Settings", description: "Go to Settings → Network & Internet → Mobile Network." },
    { title: "Add a carrier", description: "Tap 'Add Carrier' or 'Add Mobile Plan'." },
    { title: "Scan the QR code", description: "Scan the code from your confirmation email and you're ready." },
  ]
}

const troubleshootingTips = [
  {
    issue: "QR code won't scan",
    solution: "Use manual entry with the activation code included in your confirmation email."
  },
  {
    issue: "No network connection",
    solution: "Enable data roaming and confirm the eSIM line is selected for cellular data."
  },
  {
    issue: "Installation failed",
    solution: "Restart your device and retry. Make sure you have a stable Wi-Fi connection."
  },
  {
    issue: "eSIM not showing",
    solution: "Verify your device is carrier-unlocked and eSIM compatible."
  }
]

export default function SetupPage() {
  const [platform, setPlatform] = useState<'ios' | 'android'>('ios')

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">Setup guide</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Install your eSIM</h1>
          <p className="text-gray-500">Step-by-step instructions for iPhone and Android devices.</p>
        </div>

        {/* Prerequisites */}
        <div className="border border-gray-200 rounded-xl p-5 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-semibold text-gray-700">Before you start</span>
          </div>
          <ul className="space-y-2">
            {[
              "Your device is eSIM compatible and carrier-unlocked",
              "You're connected to a stable Wi-Fi network",
              "You have your SIMRYO confirmation email with the QR code",
              "Your primary SIM (if any) has an active plan",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Steps */}
        <div className="mb-12">
          {/* Platform toggle */}
          <div className="inline-flex border border-gray-200 rounded-xl p-1 mb-8 bg-gray-50">
            {([['ios', Apple, 'iPhone'], ['android', Phone, 'Android']] as const).map(([key, Icon, label]) => (
              <button
                key={key}
                onClick={() => setPlatform(key)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  platform === key
                    ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Steps list */}
          <div>
            {deviceSteps[platform].map((step, index) => (
              <div key={index} className="flex gap-5 pb-8 last:pb-0">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-900 text-white text-sm font-bold flex items-center justify-center shrink-0">
                    {index + 1}
                  </div>
                  {index < deviceSteps[platform].length - 1 && (
                    <div className="w-px flex-1 bg-gray-200 mt-2" />
                  )}
                </div>
                <div className="pt-1 pb-2">
                  <div className="text-sm font-semibold text-gray-900 mb-1">{step.title}</div>
                  <div className="text-sm text-gray-500">{step.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">Common issues</h2>
          <div className="space-y-4">
            {troubleshootingTips.map((tip, i) => (
              <div key={i} className="border-l-2 border-gray-200 pl-4">
                <div className="text-sm font-semibold text-gray-900">{tip.issue}</div>
                <div className="text-sm text-gray-500 mt-0.5">{tip.solution}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="border border-gray-200 rounded-xl p-6 text-center bg-gray-50">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Still need help?</h2>
          <p className="text-sm text-gray-500 mb-5">Our support team is available 24/7.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/support">
              <button className="inline-flex items-center justify-center bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                Contact support
              </button>
            </Link>
            <Link href="/faq">
              <button className="inline-flex items-center justify-center border border-gray-200 hover:border-gray-300 bg-white text-gray-700 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                View FAQs
              </button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}

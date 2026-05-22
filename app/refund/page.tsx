import { Metadata } from "next"
import Link from "next/link"
import { Mail } from "lucide-react"

export const metadata: Metadata = {
  title: "Refund Policy - SIMRYO eSIM Plans",
  description: "Learn about SIMRYO's refund policy for eSIM plans. Understand eligibility, processing times, and how to request refunds.",
}

const faqItems = [
  {
    question: "How long do I have to request a refund?",
    answer: "7 days from the date of purchase."
  },
  {
    question: "Can I get a refund if I've already used the eSIM?",
    answer: "No. Once activated and used for data, the eSIM is not eligible for a refund."
  },
  {
    question: "How long does it take to process a refund?",
    answer: "3–5 business days after approval. Time for funds to appear depends on your bank."
  },
  {
    question: "Can I get a partial refund if I only used part of my data?",
    answer: "No. Refunds apply to completely unused eSIMs only."
  },
  {
    question: "What if I bought the wrong plan?",
    answer: "If you haven't activated it yet, request a refund within 7 days and purchase the correct plan."
  },
  {
    question: "Do you offer refunds for technical issues?",
    answer: "Contact support first — we'll resolve the issue. Refunds may be considered on a case-by-case basis."
  }
]

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">Refund Policy</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Fair & transparent refunds</h1>
          <p className="text-gray-500">We stand behind our service with a clear refund policy. Last updated July 18, 2025.</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {[
            { value: "7 days", label: "Request window" },
            { value: "Unused only", label: "Eligibility" },
            { value: "100%", label: "Refund amount" },
            { value: "3–5 days", label: "Processing time" },
          ].map((s, i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-4 text-center">
              <div className="text-base font-bold text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Eligibility */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">Eligibility</h2>
          <div className="border border-gray-200 rounded-xl divide-y divide-gray-100">
            {[
              { label: "Request submitted within 7 days of purchase", eligible: true },
              { label: "eSIM has not been activated or used", eligible: true },
              { label: "Refund processed to original payment method only", eligible: true },
              { label: "Partially or fully used eSIMs", eligible: false },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3.5 text-sm">
                <span className="text-gray-700">{item.label}</span>
                <span className={`text-xs font-semibold ${item.eligible ? 'text-gray-900' : 'text-gray-400'}`}>
                  {item.eligible ? '✓ Eligible' : '✗ Not eligible'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Process */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">How to request a refund</h2>
          <div className="space-y-0">
            {[
              { n: "1", title: "Email us", desc: "Send a request to info@simryo.com within 7 days of purchase", time: "Within 7 days" },
              { n: "2", title: "Review", desc: "Our team reviews your request", time: "1–2 business days" },
              { n: "3", title: "Approved", desc: "Refund processed to original payment method", time: "3–5 business days" },
              { n: "4", title: "Funds returned", desc: "Refund appears in your account", time: "Up to 10 business days" },
            ].map((step, i, arr) => (
              <div key={i} className="flex gap-5 pb-7 last:pb-0">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {step.n}
                  </div>
                  {i < arr.length - 1 && <div className="w-px flex-1 bg-gray-200 mt-2" />}
                </div>
                <div className="pt-1">
                  <div className="flex items-center gap-3 mb-0.5">
                    <span className="text-sm font-semibold text-gray-900">{step.title}</span>
                    <span className="text-xs text-gray-400">{step.time}</span>
                  </div>
                  <div className="text-sm text-gray-500">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">Common questions</h2>
          <div className="border border-gray-200 rounded-xl divide-y divide-gray-100">
            {faqItems.map((item, i) => (
              <div key={i} className="px-5 py-4">
                <div className="text-sm font-semibold text-gray-900 mb-1">{item.question}</div>
                <div className="text-sm text-gray-500">{item.answer}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="border border-gray-200 rounded-xl p-5 bg-gray-50 mb-10 text-sm text-gray-500 space-y-1">
          <div className="font-semibold text-gray-700 mb-2">Important notes</div>
          <p>· Refunds are processed to the original payment method only.</p>
          <p>· No refunds for activated or partially used eSIMs.</p>
          <p>· Technical issues may qualify for exceptions — contact support first.</p>
          <p>· Disputed charges are handled separately via your payment provider.</p>
        </div>

        {/* CTA */}
        <div className="border border-gray-200 rounded-xl p-6 bg-gray-50 text-center">
          <p className="text-sm font-semibold text-gray-900 mb-1">Need to request a refund?</p>
          <p className="text-sm text-gray-500 mb-5">Email us and we'll guide you through the process.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <a href="mailto:info@simryo.com?subject=Refund Request">
              <button className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                <Mail className="h-4 w-4" />
                Email us
              </button>
            </a>
            <Link href="/contact">
              <button className="inline-flex items-center gap-2 border border-gray-200 hover:border-gray-300 bg-white text-gray-700 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                Contact form
              </button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}

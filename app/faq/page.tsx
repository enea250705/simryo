import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { MessageCircle, Mail } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "FAQ - SIMRYO | Frequently Asked Questions",
  description: "Find answers to common questions about SIMRYO eSIM services, setup, troubleshooting, and more.",
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "What is an eSIM?", "acceptedAnswer": { "@type": "Answer", "text": "An eSIM (embedded SIM) is a digital SIM card built into your device. Instead of a physical card, you download and activate a plan directly." } },
    { "@type": "Question", "name": "How do I know if my device supports eSIM?", "acceptedAnswer": { "@type": "Answer", "text": "iPhone XS and newer, Google Pixel 3 and newer, Samsung Galaxy S20 and newer all support eSIM. Check Settings for 'eSIM' or 'Digital SIM'." } },
  ]
}

const faqCategories = [
  {
    title: "Getting Started",
    items: [
      { question: "What is an eSIM?", answer: "An eSIM (embedded SIM) is a digital SIM card built into your device. Instead of a physical card, you download and activate a mobile plan directly onto your compatible device." },
      { question: "How do I know if my device supports eSIM?", answer: "Most modern smartphones support eSIM — iPhone XS and newer, Google Pixel 3 and newer, Samsung Galaxy S20 and newer. Check your device settings for 'eSIM' or 'Digital SIM'." },
      { question: "How do I install my eSIM?", answer: "After purchase you'll receive a QR code by email. Scan it in your device's eSIM settings, or manually enter the activation details provided." },
    ]
  },
  {
    title: "Plans & Pricing",
    items: [
      { question: "What countries do you cover?", answer: "We provide eSIM coverage in 190+ countries, including all major destinations in Europe, Asia, Americas, and Oceania." },
      { question: "Can I use my eSIM in multiple countries?", answer: "Many plans offer regional coverage. Our Europe plan, for example, works across 30+ European countries." },
      { question: "What happens when my data runs out?", answer: "Your connection stops when you hit your limit. You can purchase another plan any time from our website." },
      { question: "Do you offer unlimited data plans?", answer: "We offer plans up to 50GB in most destinations. While not technically unlimited, they cover most users' needs." },
    ]
  },
  {
    title: "Technical Support",
    items: [
      { question: "My eSIM isn't connecting to the network", answer: "Ensure your device is eSIM compatible and unlocked. Check that the eSIM line is enabled in settings and data roaming is on. Contact support if issues continue." },
      { question: "Why is my data speed slow?", answer: "Speeds depend on local network conditions. Try moving to a different location or restarting your device. Our eSIMs provide 4G/5G speeds where available." },
      { question: "Can I use my eSIM on multiple devices?", answer: "Each eSIM installs on one device at a time. For multiple devices, purchase separate plans." },
      { question: "How do I remove an eSIM?", answer: "Go to Settings → Cellular/Mobile Data → select your eSIM plan → Remove Cellular Plan." },
    ]
  },
  {
    title: "Billing & Refunds",
    items: [
      { question: "What payment methods do you accept?", answer: "We accept Visa, Mastercard, American Express, PayPal, and Apple Pay." },
      { question: "Can I get a refund?", answer: "We offer refunds for unused plans within 7 days of purchase, provided the eSIM hasn't been activated. Activated plans are non-refundable." },
      { question: "Will I be charged automatically?", answer: "No. Every plan is a one-time purchase. There's no recurring billing." },
    ]
  }
]

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="min-h-screen bg-white pt-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">

          {/* Header */}
          <div className="mb-10">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">FAQ</p>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Frequently asked questions</h1>
            <p className="text-gray-500">Quick answers to common questions about SIMRYO eSIM.</p>
          </div>

          {/* FAQ */}
          <div className="space-y-8 mb-12">
            {faqCategories.map((category, ci) => (
              <div key={ci}>
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">{category.title}</h2>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <Accordion type="single" collapsible>
                    {category.items.map((item, ii) => (
                      <AccordionItem
                        key={ii}
                        value={`${ci}-${ii}`}
                        className="border-b border-gray-100 last:border-0"
                      >
                        <AccordionTrigger className="px-5 py-4 text-sm font-medium text-gray-900 hover:no-underline hover:bg-gray-50 transition-colors text-left">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="px-5 pb-4 text-sm text-gray-500 leading-relaxed">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="border border-gray-200 rounded-xl p-6 bg-gray-50 text-center">
            <p className="text-sm font-semibold text-gray-900 mb-1">Still have questions?</p>
            <p className="text-sm text-gray-500 mb-5">Our support team is available 24/7.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <a href="mailto:info@simryo.com">
                <button className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                  <Mail className="h-4 w-4" />
                  Email us
                </button>
              </a>
              <Link href="/setup">
                <button className="inline-flex items-center gap-2 border border-gray-200 hover:border-gray-300 bg-white text-gray-700 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                  Setup guide
                </button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

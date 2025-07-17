import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, MessageCircle, HelpCircle } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "FAQ - SIMRYO | Frequently Asked Questions",
  description: "Find answers to common questions about SIMRYO eSIM services, setup, troubleshooting, and more.",
  keywords: "FAQ, eSIM questions, help, support, troubleshooting",
}

// FAQ Schema for SEO
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is an eSIM?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "An eSIM (embedded SIM) is a digital SIM card that's built into your device. Instead of a physical card, you can download and activate a mobile plan directly onto your compatible device."
      }
    },
    {
      "@type": "Question", 
      "name": "How do I know if my device supports eSIM?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most modern smartphones support eSIM, including iPhone XS and newer, Google Pixel 3 and newer, Samsung Galaxy S20 and newer, and many other models. Check your device settings for 'eSIM' or 'Digital SIM' options."
      }
    },
    {
      "@type": "Question",
      "name": "How do I install my eSIM?",
      "acceptedAnswer": {
        "@type": "Answer", 
        "text": "After purchase, you'll receive a QR code via email. Simply scan this code in your device's eSIM settings, or manually enter the activation details provided."
      }
    },
    {
      "@type": "Question",
      "name": "What countries do you cover?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We provide eSIM coverage in 190+ countries worldwide, including all major destinations in Europe, Asia, Americas, and Oceania."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use my eSIM in multiple countries?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! Many of our plans offer regional coverage. For example, our Europe plan works across 30+ European countries."
      }
    }
  ]
}

const faqCategories = [
  {
    title: "Getting Started",
    items: [
      {
        question: "What is an eSIM?",
        answer: "An eSIM (embedded SIM) is a digital SIM card that's built into your device. Instead of a physical card, you can download and activate a mobile plan directly onto your compatible device."
      },
      {
        question: "How do I know if my device supports eSIM?",
        answer: "Most modern smartphones support eSIM, including iPhone XS and newer, Google Pixel 3 and newer, Samsung Galaxy S20 and newer, and many other models. Check your device settings for 'eSIM' or 'Digital SIM' options."
      },
      {
        question: "How do I install my eSIM?",
        answer: "After purchase, you'll receive a QR code via email. Simply scan this code in your device's eSIM settings, or manually enter the activation details provided."
      }
    ]
  },
  {
    title: "Plans & Pricing",
    items: [
      {
        question: "What countries do you cover?",
        answer: "We provide eSIM coverage in 190+ countries worldwide, including all major destinations in Europe, Asia, Americas, and Oceania."
      },
      {
        question: "Can I use my eSIM in multiple countries?",
        answer: "Yes! Many of our plans offer regional coverage. For example, our Europe plan works across 30+ European countries."
      },
      {
        question: "What happens when my data runs out?",
        answer: "When you reach your data limit, your connection will stop. You can purchase additional data or a new plan at any time through our website."
      },
      {
        question: "Do you offer unlimited data plans?",
        answer: "We offer high-data plans up to 50GB in most destinations. While not technically unlimited, these plans are suitable for most users' needs."
      }
    ]
  },
  {
    title: "Technical Support",
    items: [
      {
        question: "My eSIM isn't connecting to the network",
        answer: "First, ensure your device is eSIM compatible and unlocked. Check that you've enabled the eSIM line in your settings and that data roaming is turned on. If issues persist, contact our support team."
      },
      {
        question: "Why is my data speed slow?",
        answer: "Data speeds depend on local network conditions and coverage. Try moving to a different location or restarting your device. Our eSIMs typically provide 4G/5G speeds where available."
      },
      {
        question: "Can I use my eSIM on multiple devices?",
        answer: "Each eSIM can only be installed on one device at a time. If you need connectivity for multiple devices, you'll need to purchase separate plans."
      },
      {
        question: "How do I remove or delete an eSIM?",
        answer: "You can remove an eSIM from your device settings. Go to Settings > Cellular/Mobile Data > select your eSIM plan > Remove Cellular Plan."
      }
    ]
  },
  {
    title: "Billing & Refunds",
    items: [
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and Apple Pay for secure payments."
      },
      {
        question: "Can I get a refund?",
        answer: "We offer refunds for unused eSIM plans within 7 days of purchase, provided the eSIM hasn't been activated. Once activated, plans are non-refundable."
      },
      {
        question: "Will I be charged automatically?",
        answer: "No, we don't have recurring billing. Each eSIM plan is a one-time purchase. You'll need to manually purchase additional plans when needed."
      }
    ]
  }
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl">
            Find quick answers to common questions about SIMRYO eSIM services
          </p>
        </div>

        {/* Search Bar Placeholder */}
        <Card className="mb-12">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search for answers..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              />
            </div>
          </CardContent>
        </Card>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqCategories.map((category, categoryIndex) => (
            <Card key={categoryIndex}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <HelpCircle className="h-5 w-5 text-accent-500" />
                  <span>{category.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.items.map((item, itemIndex) => (
                    <AccordionItem key={itemIndex} value={`item-${categoryIndex}-${itemIndex}`}>
                      <AccordionTrigger className="text-left">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Support */}
        <Card className="mt-12 bg-gradient-to-r from-primary-950 to-primary-800 text-white">
          <CardContent className="p-8">
            <MessageCircle className="h-12 w-12 mb-4 text-accent-400" />
            <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
            <p className="text-gray-100 mb-6 max-w-2xl">
              Can't find the answer you're looking for? Our support team is here to help you with any questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/support">
                <Button variant="secondary" size="lg" className="bg-white text-primary-950 hover:bg-gray-100">
                  Contact Support
                </Button>
              </Link>
              <Link href="/setup">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-950 bg-transparent">
                  Setup Guide
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
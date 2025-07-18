"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

const faqs = [
  {
    question: "What is an eSIM and how does it work?",
    answer: "An eSIM (embedded SIM) is a digital SIM card that's built into your device. Instead of inserting a physical SIM card, you can activate cellular service by scanning a QR code or entering activation details. It works just like a regular SIM card but is more convenient and environmentally friendly."
  },
  {
    question: "Which devices support eSIM?",
    answer: "Most modern smartphones support eSIM, including iPhone XS/XR and newer, Google Pixel 3 and newer, Samsung Galaxy S20 and newer, and many other Android devices. iPads and some laptops also support eSIM. Check your device settings to see if eSIM is available."
  },
  {
    question: "How do I activate my eSIM?",
    answer: "After purchase, you'll receive a QR code via email. Simply scan this code with your device's camera in the cellular settings, and your eSIM will be activated instantly. Detailed step-by-step instructions are provided for each device type."
  },
  {
    question: "Can I use my regular SIM and eSIM at the same time?",
    answer: "Yes! Most devices support dual SIM functionality, allowing you to use your regular SIM for calls and texts while using the eSIM for data. This is perfect for avoiding roaming charges while staying reachable on your home number."
  },
  {
    question: "What happens if I run out of data?",
    answer: "You can easily purchase additional data through our website or app. Top-up options are available in various sizes, and activation is instant. You'll also receive notifications when you're approaching your data limit."
  },
  {
    question: "Do you offer refunds?",
    answer: "Yes, we offer a 7-day money-back guarantee for unused eSIM plans. If you haven't activated your eSIM or used any data, you can request a full refund within 7 days of purchase."
  },
  {
    question: "How fast are the data speeds?",
    answer: "Our eSIM plans provide access to premium local networks, typically offering 4G/LTE speeds and 5G where available. Speeds vary by location and network congestion, but you can expect reliable performance for all your connectivity needs."
  },
  {
    question: "Is customer support available?",
    answer: "Yes! We provide 24/7 customer support via live chat, email, and phone. Our support team can help with activation, troubleshooting, and any questions about your eSIM plan."
  }
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about eSIM and our services
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
              >
                <span className="font-semibold text-gray-900">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
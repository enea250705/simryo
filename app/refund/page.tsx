import { Metadata } from "next"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  Shield, 
  Clock, 
  DollarSign, 
  CheckCircle,
  AlertCircle,
  Info,
  Mail,
  Calendar,
  CreditCard,
  RefreshCw,
  FileText,
  Users,
  MessageCircle
} from "lucide-react"

export const metadata: Metadata = {
  title: "Refund Policy - SIMRYO eSIM Plans",
  description: "Learn about SIMRYO's refund policy for eSIM plans. Understand eligibility, processing times, and how to request refunds for unused eSIM services.",
  keywords: "refund policy, esim refund, money back guarantee, return policy, unused esim, refund eligibility"
}

const refundTimeline = [
  {
    step: "1",
    title: "Submit Request",
    description: "Contact us within 7 days of purchase",
    icon: Mail,
    timeframe: "Within 7 days"
  },
  {
    step: "2",
    title: "Review Process",
    description: "Our team reviews your refund request",
    icon: FileText,
    timeframe: "1-2 business days"
  },
  {
    step: "3",
    title: "Refund Approved",
    description: "Refund is processed to original payment method",
    icon: CheckCircle,
    timeframe: "3-5 business days"
  },
  {
    step: "4",
    title: "Funds Returned",
    description: "Refund appears in your account",
    icon: CreditCard,
    timeframe: "5-10 business days"
  }
]

const eligibilityCriteria = [
  {
    icon: Clock,
    title: "Timing Requirements",
    description: "Request must be submitted within 7 days of purchase",
    eligible: true
  },
  {
    icon: Shield,
    title: "Unused eSIM",
    description: "eSIM has not been activated or used for data consumption",
    eligible: true
  },
  {
    icon: DollarSign,
    title: "Original Payment",
    description: "Refund processed to original payment method only",
    eligible: true
  },
  {
    icon: AlertCircle,
    title: "Partial Usage",
    description: "Used eSIMs are not eligible for refunds",
    eligible: false
  }
]

const faqItems = [
  {
    question: "How long do I have to request a refund?",
    answer: "You have 7 days from the date of purchase to request a refund. This gives you time to test the eSIM and ensure it meets your needs."
  },
  {
    question: "Can I get a refund if I've already used the eSIM?",
    answer: "No, once an eSIM has been activated and used for data consumption, it is no longer eligible for a refund. We consider this as the service being delivered."
  },
  {
    question: "How long does it take to process a refund?",
    answer: "Refunds are typically processed within 3-5 business days after approval. The time for funds to appear in your account depends on your payment method and bank."
  },
  {
    question: "Can I get a partial refund if I only used part of my data?",
    answer: "No, we do not offer partial refunds. The refund policy applies to completely unused eSIMs only."
  },
  {
    question: "What if I bought the wrong plan?",
    answer: "If you purchased the wrong plan and haven't activated it yet, you can request a refund within 7 days and purchase the correct plan."
  },
  {
    question: "Do you offer refunds for technical issues?",
    answer: "If you experience technical issues preventing eSIM activation, contact our support team. We'll work to resolve the issue first, and refunds may be considered on a case-by-case basis."
  }
]

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="pt-32 pb-20 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200">
              Refund Policy
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
              Fair & Transparent
              <span className="block text-blue-600">
                Refund Policy
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              We stand behind our service with a clear, fair refund policy. 
              Your satisfaction is our priority.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Summary */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Refund Policy Summary
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Quick overview of our refund terms and conditions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-0 shadow-lg text-center">
              <CardHeader className="pb-4">
                <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-lg font-bold text-gray-900">7-Day Window</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Request refunds within 7 days of purchase</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center">
              <CardHeader className="pb-4">
                <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-lg font-bold text-gray-900">Unused Only</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">eSIM must be completely unused and unactivated</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center">
              <CardHeader className="pb-4">
                <RefreshCw className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle className="text-lg font-bold text-gray-900">Full Refund</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">100% refund to original payment method</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center">
              <CardHeader className="pb-4">
                <MessageCircle className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle className="text-lg font-bold text-gray-900">Easy Process</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Simple email request to start the process</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Eligibility Criteria */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Refund Eligibility
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Check if your purchase qualifies for a refund.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {eligibilityCriteria.map((criteria, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full ${criteria.eligible ? 'bg-green-100' : 'bg-red-100'}`}>
                      <criteria.icon className={`h-6 w-6 ${criteria.eligible ? 'text-green-600' : 'text-red-600'}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-900">{criteria.title}</CardTitle>
                      <div className="flex items-center mt-1">
                        {criteria.eligible ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                        )}
                        <span className={`text-sm ${criteria.eligible ? 'text-green-600' : 'text-red-600'}`}>
                          {criteria.eligible ? 'Eligible' : 'Not Eligible'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{criteria.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Refund Process */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Refund Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple steps to request and receive your refund.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {refundTimeline.map((step, index) => (
              <Card key={index} className="border-0 shadow-lg text-center">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {step.step}
                    </div>
                  </div>
                  <step.icon className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                  <CardTitle className="text-lg font-bold text-gray-900">{step.title}</CardTitle>
                  <Badge variant="secondary" className="mt-2">
                    {step.timeframe}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Common questions about our refund policy.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {faqItems.map((item, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-bold text-gray-900">{item.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 sm:py-20 bg-blue-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Need to Request a Refund?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Contact our support team to start your refund request. 
              We'll guide you through the process.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:info@simryo.com?subject=Refund Request"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-white text-blue-600 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <Mail className="mr-2 h-5 w-5" />
                Email Support
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold border-2 border-white text-white rounded-xl hover:bg-white hover:text-blue-600 transition-colors"
              >
                Contact Us
              </a>
            </div>
            <p className="mt-6 text-sm text-blue-100">
              Email: <a href="mailto:info@simryo.com" className="underline hover:text-white">info@simryo.com</a>
            </p>
          </div>
        </div>
      </section>

      {/* Important Notes */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="border-0 shadow-lg bg-blue-50">
            <CardHeader className="text-center pb-4">
              <Info className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-xl font-bold text-gray-900">Important Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Refund Processing</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Refunds are processed to the original payment method only</li>
                    <li>• Processing time depends on your bank or payment provider</li>
                    <li>• No refunds for activated or partially used eSIMs</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Special Circumstances</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Technical issues may qualify for exceptions</li>
                    <li>• Disputed charges handled separately</li>
                    <li>• Bulk purchases may have different terms</li>
                  </ul>
                </div>
              </div>
              <Separator className="my-4" />
              <p className="text-sm text-gray-600 text-center">
                This refund policy was last updated on July 18, 2025. 
                SIMRYO reserves the right to modify this policy at any time.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
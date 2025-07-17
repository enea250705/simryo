import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  MessageCircle, 
  HelpCircle, 
  BookOpen, 
  Mail, 
  Phone, 
  Clock,
  ChevronRight,
  CheckCircle
} from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Support - SIMRYO | Get Help with Your eSIM",
  description: "Get help with your SIMRYO eSIM. Contact support, browse FAQs, and access setup guides for seamless connectivity worldwide.",
  keywords: "eSIM support, help center, customer service, setup guide, FAQ",
}

const helpTopics = [
  { title: "Getting Started", icon: BookOpen, items: ["eSIM Setup Guide", "Device Compatibility", "First Time Setup"] },
  { title: "Plans & Pricing", icon: HelpCircle, items: ["Choosing a Plan", "Regional Coverage", "Data Allowances"] },
  { title: "Technical Support", icon: MessageCircle, items: ["Connection Issues", "Speed Problems", "Device Settings"] },
]

const faqItems = [
  {
    question: "How do I install my eSIM?",
    answer: "Scan the QR code provided in your email, or manually enter the activation details in your device settings."
  },
  {
    question: "What devices support eSIM?",
    answer: "Most modern smartphones including iPhone XS and newer, Google Pixel 3 and newer, and many Samsung Galaxy models."
  },
  {
    question: "Can I use my eSIM on multiple devices?",
    answer: "Each eSIM is tied to one device. You'll need separate plans for multiple devices."
  },
  {
    question: "What happens when my data runs out?",
    answer: "Your connection will stop. You can purchase additional data or a new plan through our website."
  },
]

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            How can we help you?
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl">
            Get instant support, browse our help center, or contact our team directly
          </p>
        </div>

        {/* Help Topics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {helpTopics.map((topic, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <topic.icon className="h-12 w-12 text-accent-500 mb-4" />
                <CardTitle>{topic.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topic.items.map((item, itemIndex) => (
                  <Link 
                    key={itemIndex}
                    href={`/help/${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm">{item}</span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Link>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>Contact Support</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" />
                </div>

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical Issue</SelectItem>
                      <SelectItem value="billing">Billing Question</SelectItem>
                      <SelectItem value="setup">Setup Help</SelectItem>
                      <SelectItem value="general">General Inquiry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Please describe your issue or question..."
                    className="min-h-[120px]"
                  />
                </div>

                <Button className="w-full bg-primary-950 hover:bg-primary-900 text-white">
                  Send Message
                </Button>
              </form>

              {/* Contact Info */}
              <div className="pt-6 border-t space-y-4">
                <div className="flex items-center space-x-3 text-sm">
                  <Clock className="h-4 w-4 text-accent-500" />
                  <span>Response time: Usually within 24 hours</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Phone className="h-4 w-4 text-accent-500" />
                  <span>Emergency support: +1 (555) 123-4567</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqItems.map((faq, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
                    <p className="text-gray-600 text-sm">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8">
              <Link href="/faq">
                <Button variant="outline" className="w-full">
                  View All FAQs
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <CheckCircle className="h-8 w-8 text-accent-500 mb-3" />
              <h3 className="font-semibold mb-2">Setup Guide</h3>
              <p className="text-sm text-gray-600 mb-4">Step-by-step eSIM installation</p>
              <Link href="/setup">
                <Button variant="outline" size="sm">Get Started</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <BookOpen className="h-8 w-8 text-accent-500 mb-3" />
              <h3 className="font-semibold mb-2">Help Center</h3>
              <p className="text-sm text-gray-600 mb-4">Browse guides and tutorials</p>
              <Link href="/help">
                <Button variant="outline" size="sm">Browse Help</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <MessageCircle className="h-8 w-8 text-accent-500 mb-3" />
              <h3 className="font-semibold mb-2">Live Chat</h3>
              <p className="text-sm text-gray-600 mb-4">Chat with our support team</p>
              <Button size="sm" className="bg-primary-950 hover:bg-primary-900">
                Start Chat
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 
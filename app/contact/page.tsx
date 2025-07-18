import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Mail, 
  Clock,
  MessageCircle,
  Send
} from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us - SIMRYO | Get in Touch",
  description: "Contact SIMRYO for support, partnerships, or inquiries about our global eSIM services. Multiple ways to reach us.",
  keywords: "contact, support, customer service, business inquiries",
}

const contactMethods = [
  {
    icon: Mail,
    title: "Email Support",
    description: "Get help via email",
    contact: "info@simryo.com",
    hours: "24/7 response within 2 hours"
  },
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Instant messaging support",
    contact: "Available on website",
    hours: "24/7 during business hours"
  }
]


export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Contact Us
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl">
            We're here to help. Reach out to us through any of the channels below.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {contactMethods.map((method, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <method.icon className="h-12 w-12 text-accent-500 mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">{method.title}</h3>
                <p className="text-gray-600 mb-3">{method.description}</p>
                <p className="font-semibold text-foreground mb-2">{method.contact}</p>
                <p className="text-sm text-gray-500">{method.hours}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Send className="h-5 w-5" />
                <span>Send us a Message</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
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
                  <Label htmlFor="company">Company (Optional)</Label>
                  <Input id="company" placeholder="Your Company" />
                </div>

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="How can we help?" />
                </div>

                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Tell us more about your inquiry..."
                    className="min-h-[120px]"
                  />
                </div>

                <Button className="w-full bg-primary-950 hover:bg-primary-900 text-white">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Link */}
        <Card className="mt-16 bg-gradient-to-r from-primary-950 to-primary-800 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Looking for Quick Answers?</h2>
            <p className="text-gray-100 mb-6 max-w-2xl mx-auto">
              Check out our FAQ section for instant answers to common questions about eSIM setup, plans, and troubleshooting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" className="bg-white text-primary-950 hover:bg-gray-100">
                Browse FAQ
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-950 bg-transparent">
                Setup Guide
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
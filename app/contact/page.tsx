"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Mail, 
  Clock,
  MessageCircle,
  Send,
  CheckCircle,
  Loader2
} from "lucide-react"
import { toast } from "sonner"
import { analytics } from "@/lib/analytics"

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
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        setIsSubmitted(true)
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          company: '',
          subject: '',
          message: ''
        })
        toast.success(result.message || 'Message sent successfully!')
        
        // Track successful contact form submission
        analytics.contactForm(formData.subject)
      } else {
        toast.error(result.error || 'Failed to send message. Please try again.')
      }
    } catch (error) {
      console.error('Contact form error:', error)
      toast.error('Failed to send message. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

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
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input 
                      id="firstName" 
                      name="firstName"
                      placeholder="John" 
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input 
                      id="lastName" 
                      name="lastName"
                      placeholder="Doe" 
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input 
                    id="email" 
                    name="email"
                    type="email" 
                    placeholder="john@example.com" 
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="company">Company (Optional)</Label>
                  <Input 
                    id="company" 
                    name="company"
                    placeholder="Your Company" 
                    value={formData.company}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input 
                    id="subject" 
                    name="subject"
                    placeholder="How can we help?" 
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea 
                    id="message" 
                    name="message"
                    placeholder="Tell us more about your inquiry..."
                    className="min-h-[120px]"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : isSubmitted ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Message Sent!
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
                
                {isSubmitted && (
                  <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <p className="text-green-800 font-medium">Thank you for your message!</p>
                    <p className="text-green-600 text-sm mt-1">We'll get back to you within 24 hours.</p>
                  </div>
                )}
                
                <p className="text-sm text-gray-500 text-center">
                  * Required fields
                </p>
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
              <Button variant="secondary" size="lg" className="bg-white text-primary-950 hover:bg-gray-100" asChild>
                <a href="/faq">Browse FAQ</a>
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-950 bg-transparent" asChild>
                <a href="/setup">Setup Guide</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
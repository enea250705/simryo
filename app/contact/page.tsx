"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, MessageCircle, Loader2, CheckCircle } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { analytics } from "@/lib/analytics"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', company: '', subject: '', message: ''
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const result = await response.json()
      if (result.success) {
        setIsSubmitted(true)
        setFormData({ firstName: '', lastName: '', email: '', company: '', subject: '', message: '' })
        toast.success(result.message || 'Message sent successfully!')
        analytics.contactForm(formData.subject)
      } else {
        toast.error(result.error || 'Failed to send message. Please try again.')
      }
    } catch {
      toast.error('Failed to send message. Check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">Contact</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Get in touch</h1>
          <p className="text-gray-500">We're here to help. Reach out and we'll respond within a few hours.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Contact info */}
          <div className="space-y-4">
            <a href="mailto:info@simryo.com" className="flex items-start gap-4 border border-gray-200 hover:border-gray-300 rounded-xl p-4 transition-colors">
              <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                <Mail className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">Email</div>
                <div className="text-sm text-gray-500">info@simryo.com</div>
                <div className="text-xs text-gray-400 mt-0.5">Reply within 2 hours</div>
              </div>
            </a>

            <div className="flex items-start gap-4 border border-gray-200 rounded-xl p-4">
              <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                <MessageCircle className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">Live chat</div>
                <div className="text-sm text-gray-500">Available on website</div>
                <div className="text-xs text-gray-400 mt-0.5">24/7 support</div>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-xs text-gray-400 mb-3">Looking for quick answers?</p>
              <div className="flex flex-col gap-2">
                <Link href="/faq" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Browse FAQ →</Link>
                <Link href="/setup" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Setup guide →</Link>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            {isSubmitted ? (
              <div className="border border-gray-200 rounded-xl p-8 text-center">
                <CheckCircle className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                <p className="font-semibold text-gray-900 mb-1">Message sent</p>
                <p className="text-sm text-gray-500">We'll get back to you within 24 hours.</p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName" className="text-sm text-gray-700">First name</Label>
                    <Input id="firstName" name="firstName" placeholder="John" value={formData.firstName} onChange={handleInputChange} required className="border-gray-200 rounded-xl text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName" className="text-sm text-gray-700">Last name</Label>
                    <Input id="lastName" name="lastName" placeholder="Doe" value={formData.lastName} onChange={handleInputChange} required className="border-gray-200 rounded-xl text-sm" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm text-gray-700">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleInputChange} required className="border-gray-200 rounded-xl text-sm" />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="company" className="text-sm text-gray-700">Company <span className="text-gray-400">(optional)</span></Label>
                  <Input id="company" name="company" placeholder="Your company" value={formData.company} onChange={handleInputChange} className="border-gray-200 rounded-xl text-sm" />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="subject" className="text-sm text-gray-700">Subject</Label>
                  <Input id="subject" name="subject" placeholder="How can we help?" value={formData.subject} onChange={handleInputChange} required className="border-gray-200 rounded-xl text-sm" />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="message" className="text-sm text-gray-700">Message</Label>
                  <Textarea id="message" name="message" placeholder="Tell us more about your inquiry..." className="min-h-[120px] border-gray-200 rounded-xl text-sm" value={formData.message} onChange={handleInputChange} required />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white rounded-xl py-3 text-sm font-semibold transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : 'Send message'}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

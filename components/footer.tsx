import Link from "next/link"
import { Globe, Twitter, Facebook, Instagram, Mail, Linkedin, Youtube, MapPin, Phone, Clock, Award, Shield, Zap, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const productLinks = [
    { name: "eSIM Plans", href: "/plans" },
    { name: "Coverage Map", href: "/coverage" },
    { name: "Pricing", href: "/pricing" },
    { name: "Enterprise", href: "/enterprise" },
    { name: "API Access", href: "/api" },
    { name: "Reseller Program", href: "/reseller" },
  ]

  const supportLinks = [
    { name: "Help Center", href: "/support" },
    { name: "Setup Guide", href: "/setup" },
    { name: "Contact Us", href: "/contact" },
    { name: "Live Chat", href: "/chat" },
    { name: "FAQ", href: "/faq" },
    { name: "Device Compatibility", href: "/compatibility" },
  ]

  const companyLinks = [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
    { name: "Blog", href: "/blog" },
    { name: "Partners", href: "/partners" },
    { name: "Investor Relations", href: "/investors" },
  ]

  const legalLinks = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
    { name: "Refund Policy", href: "/refund" },
    { name: "Acceptable Use", href: "/acceptable-use" },
    { name: "GDPR Compliance", href: "/gdpr" },
  ]

  const trustIndicators = [
    {
      icon: Shield,
      label: "Enterprise Security",
      description: "Bank-level encryption"
    },
    {
      icon: Award,
      label: "Award Winning",
      description: "Top rated by customers"
    },
    {
      icon: Users,
      label: "2M+ Customers",
      description: "Trusted worldwide"
    },
    {
      icon: Zap,
      label: "99.9% Uptime",
      description: "Reliable service"
    }
  ]

  return (
    <footer className="bg-gray-900 text-white">
      {/* Trust Indicators Bar */}
      <div className="border-b border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustIndicators.map((indicator, index) => (
              <div key={index} className="flex items-center space-x-3 group">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                    <indicator.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white">{indicator.label}</p>
                  <p className="text-xs text-gray-400">{indicator.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <Globe className="h-10 w-10 text-blue-500" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full animate-pulse" />
              </div>
              <span className="font-bold text-2xl">SIMRYO</span>
            </div>
            
            <p className="text-gray-300 mb-6 text-sm leading-relaxed max-w-md">
              The world's leading eSIM marketplace, connecting travelers to premium mobile networks 
              in 190+ countries. Experience seamless global connectivity with instant activation 
              and transparent pricing.
            </p>

            {/* Newsletter Signup */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-white mb-3">Stay Updated</h4>
              <div className="flex space-x-2">
                <Input 
                  placeholder="Enter your email" 
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
                />
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4">
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Get travel tips, exclusive offers, and product updates.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <MapPin className="h-4 w-4 text-blue-500" />
                <span>San Francisco, CA • London, UK • Singapore</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <Phone className="h-4 w-4 text-blue-500" />
                <span>+1 (555) SIMRYO-1 • +44 20 7946 0958</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <Clock className="h-4 w-4 text-blue-500" />
                <span>24/7 Customer Support</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {[
                { icon: Twitter, href: "https://twitter.com/simryo", label: "Twitter" },
                { icon: Facebook, href: "https://facebook.com/simryo", label: "Facebook" },
                { icon: Instagram, href: "https://instagram.com/simryo", label: "Instagram" },
                { icon: Linkedin, href: "https://linkedin.com/company/simryo", label: "LinkedIn" },
                { icon: Youtube, href: "https://youtube.com/simryo", label: "YouTube" },
                { icon: Mail, href: "mailto:hello@simryo.com", label: "Email" },
              ].map((social, index) => (
                <Link 
                  key={index}
                  href={social.href} 
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors group"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5 text-gray-400 group-hover:text-white" />
                </Link>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Products</h3>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-3 mb-6">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* App Downloads */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Download App</h4>
              <div className="space-y-2">
                <Link 
                  href="/download/ios" 
                  className="block w-full"
                >
                  <div className="bg-gray-800 hover:bg-gray-700 rounded-lg p-2 transition-colors">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                        <span className="text-xs font-bold text-black">📱</span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Download on the</p>
                        <p className="text-sm font-semibold text-white">App Store</p>
                      </div>
                    </div>
                  </div>
                </Link>
                <Link 
                  href="/download/android" 
                  className="block w-full"
                >
                  <div className="bg-gray-800 hover:bg-gray-700 rounded-lg p-2 transition-colors">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                        <span className="text-xs font-bold text-black">🤖</span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Get it on</p>
                        <p className="text-sm font-semibold text-white">Google Play</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-gray-800" />

      {/* Bottom Footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Copyright */}
          <div className="text-center lg:text-left">
            <p className="text-sm text-gray-400">
              © {currentYear} SIMRYO Technologies Inc. All rights reserved.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Registered in Delaware, USA. Operating globally.
            </p>
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap justify-center lg:justify-center gap-x-6 gap-y-2">
            {legalLinks.map((link, index) => (
              <Link 
                key={link.name}
                href={link.href} 
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Certifications & Badges */}
          <div className="flex justify-center lg:justify-end space-x-4">
            <Badge variant="outline" className="border-gray-600 text-gray-300">
              SOC 2 Certified
            </Badge>
            <Badge variant="outline" className="border-gray-600 text-gray-300">
              GDPR Compliant
            </Badge>
            <Badge variant="outline" className="border-gray-600 text-gray-300">
              ISO 27001
            </Badge>
          </div>
        </div>

        {/* Additional Footer Info */}
        <Separator className="bg-gray-800 my-6" />
        
        <div className="text-center">
          <p className="text-xs text-gray-500 leading-relaxed max-w-4xl mx-auto">
            SIMRYO is a trademark of SIMRYO Technologies Inc. eSIM technology requires a compatible device. 
            Coverage and speeds may vary by location and network conditions. Data plans are subject to fair usage policies. 
            Prices shown are in USD and may vary by region. International roaming charges may apply for voice and SMS services.
          </p>
          
          <div className="flex justify-center space-x-6 mt-4 text-xs text-gray-500">
            <span>🌍 Available in 190+ countries</span>
            <span>⚡ Instant activation</span>
            <span>🔒 Secure payments</span>
            <span>📞 24/7 support</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

     
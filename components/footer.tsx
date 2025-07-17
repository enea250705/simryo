import Link from "next/link"
import { Globe, Twitter, Facebook, Instagram, Mail, Linkedin, Youtube } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const productLinks = [
    { name: "eSIM Plans", href: "/plans" },
    { name: "Coverage Map", href: "/coverage" },
    { name: "Pricing", href: "/pricing" },
  ]

  const supportLinks = [
    { name: "Help Center", href: "/support" },
    { name: "Setup Guide", href: "/setup" },
    { name: "Contact Us", href: "/contact" },
  ]

  const companyLinks = [
    { name: "About Us", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Careers", href: "/careers" },
  ]

  const legalLinks = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Refund Policy", href: "/refund" },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <Globe className="h-10 w-10 text-blue-500" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full animate-pulse" />
              </div>
              <span className="font-bold text-2xl">SIMRYO</span>
            </div>
            
            <p className="text-gray-300 mb-6 text-sm leading-relaxed">
              Global eSIM marketplace connecting travelers to premium mobile networks worldwide.
            </p>

            <div className="flex items-center space-x-3 text-sm text-gray-300 mb-6">
              <Mail className="h-4 w-4 text-blue-500" />
              <span>info@simryo.com</span>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {[
                { icon: Twitter, href: "https://twitter.com/simryo", label: "Twitter" },
                { icon: Facebook, href: "https://facebook.com/simryo", label: "Facebook" },
                { icon: Instagram, href: "https://instagram.com/simryo", label: "Instagram" },
                { icon: Linkedin, href: "https://linkedin.com/company/simryo", label: "LinkedIn" },
                { icon: Youtube, href: "https://youtube.com/simryo", label: "YouTube" },
                { icon: Mail, href: "mailto:info@simryo.com", label: "Email" },
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
            <ul className="space-y-3">
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
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <p className="text-sm text-gray-400">
              © {currentYear} SIMRYO Technologies Inc. All rights reserved.
            </p>
            
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4">
              {legalLinks.map((link) => (
                <Link 
                  key={link.name}
                  href={link.href} 
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
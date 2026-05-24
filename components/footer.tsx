import Image from "next/image"
import Link from "next/link"
import { Mail, Twitter, Facebook, Instagram, Linkedin, Youtube } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const productLinks = [
    { name: "eSIM Plans", href: "/plans" },
    { name: "Coverage Map", href: "/coverage" },
  ]

  const supportLinks = [
    { name: "Help Center", href: "/support" },
    { name: "Setup Guide", href: "/setup" },
    { name: "Contact Us", href: "/contact" },
  ]

  const companyLinks = [
    { name: "About Us", href: "/about" },
    { name: "Blog", href: "/blog" },
  ]

  const legalLinks = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Refund Policy", href: "/refund" },
  ]

  return (
    <footer className="bg-black text-white border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/simryologo.png"
                alt="SIMRYO logo"
                width={36}
                height={36}
                className="object-contain"
              />
              <span className="font-semibold text-lg text-white">SIMRYO</span>
            </div>
            
            <p className="text-slate-300 mb-6 text-sm leading-relaxed">
              A clean, easy-to-use global eSIM service for travelers who need reliable mobile data.
            </p>

            <div className="flex items-center gap-2 text-sm text-slate-300 mb-6">
              <Mail className="h-4 w-4 text-slate-300" />
              <span>info@simryo.com</span>
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
                    className="text-sm text-slate-300 hover:text-white transition-colors"
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
                    className="text-sm text-slate-300 hover:text-white transition-colors"
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
                    className="text-sm text-slate-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <p className="text-sm text-slate-400">
              © {currentYear} SIMRYO Technologies Inc. All rights reserved.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-400">
              {legalLinks.map((link) => (
                <Link 
                  key={link.name}
                  href={link.href} 
                  className="hover:text-white transition-colors"
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
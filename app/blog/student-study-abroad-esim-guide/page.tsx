import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Student Study Abroad eSIM Guide 2025: Budget Connectivity Solutions',
  description: 'Essential eSIM guide for students studying abroad. Find affordable plans, long-term options, and connectivity solutions for international education.',
  keywords: 'student esim, study abroad esim, student international data, cheap student esim, education esim',
  openGraph: {
    title: 'Student Study Abroad eSIM Guide 2025: Budget Connectivity Solutions',
    description: 'Essential eSIM guide for students studying abroad. Find affordable plans, long-term options, and connectivity solutions for international education.',
    images: ['/blog/student-study-abroad.jpg'],
    type: 'article',
    publishedTime: '2025-07-18T10:00:00.000Z'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Student Study Abroad eSIM Guide 2025: Budget Connectivity Solutions',
    description: 'Essential eSIM guide for students studying abroad. Find affordable plans, long-term options, and connectivity solutions for international education.',
    images: ['/blog/student-study-abroad.jpg']
  }
}

export default function StudentEsimPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <article className="prose prose-lg max-w-none">
          <header className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Student Study Abroad eSIM Guide 2025: Budget Connectivity Solutions
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Essential eSIM guide for students studying abroad. Find affordable plans, long-term options, and connectivity solutions for international education.
            </p>
          </header>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
            <h2 className="text-xl font-semibold text-blue-800 mb-3">🎓 Student-Focused Features</h2>
            <ul className="space-y-2 text-blue-700">
              <li>• <strong>Budget-friendly plans</strong> - Starting from $15/month</li>
              <li>• <strong>Long-term validity</strong> - Up to 365 days</li>
              <li>• <strong>Student discounts</strong> - Up to 25% off with valid student ID</li>
              <li>• <strong>Flexible data options</strong> - From 5GB to unlimited</li>
            </ul>
          </div>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">📚 Best Student eSIM Plans</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-lg border-2 border-blue-500">
                <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded mb-2 w-fit">STUDENT SPECIAL</div>
                <h3 className="text-xl font-semibold mb-3">Study Abroad Starter</h3>
                <p className="text-3xl font-bold text-blue-600 mb-4">$15/month</p>
                <ul className="space-y-2 mb-6">
                  <li>✅ 5GB monthly data</li>
                  <li>✅ 30+ countries</li>
                  <li>✅ Student discount eligible</li>
                  <li>✅ No contract required</li>
                  <li>✅ 24/7 support</li>
                </ul>
                <p className="text-sm text-gray-600">Perfect for light usage and staying connected with home</p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-lg border-2 border-purple-500">
                <div className="bg-purple-500 text-white text-xs px-2 py-1 rounded mb-2 w-fit">MOST POPULAR</div>
                <h3 className="text-xl font-semibold mb-3">International Student Pro</h3>
                <p className="text-3xl font-bold text-purple-600 mb-4">$35/month</p>
                <ul className="space-y-2 mb-6">
                  <li>✅ 25GB monthly data</li>
                  <li>✅ 60+ countries</li>
                  <li>✅ Premium network access</li>
                  <li>✅ Video calling optimized</li>
                  <li>✅ Academic support priority</li>
                </ul>
                <p className="text-sm text-gray-600">Ideal for research, online classes, and social connections</p>
              </div>
            </div>
          </section>

          <section className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Study Abroad?</h2>
            <p className="text-xl mb-6">Get connected with student-friendly eSIM plans designed for international education.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/plans" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center">
                View Student Plans
              </a>
              <a href="/contact" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors text-center">
                Get Student Discount
              </a>
            </div>
          </section>
        </article>
      </div>
    </div>
  )
} 
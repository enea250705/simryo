import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cheapest eSIM Plans 2025: Budget Travel Connectivity Guide',
  description: 'Find the cheapest eSIM plans for budget travelers. Compare low-cost options, get the best value for money, and stay connected without breaking the bank.',
  keywords: 'cheapest esim, budget esim plans, affordable esim, low cost esim, cheap international data',
}

export default function CheapestEsimPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <article className="prose prose-lg max-w-none">
          <header className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-6">
              Cheapest eSIM Plans 2025: Budget Travel Connectivity Guide
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay connected on a budget! Discover the most affordable eSIM plans worldwide without compromising on quality or coverage.
            </p>
          </header>

          <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-8">
            <h2 className="text-xl font-semibold text-green-800 mb-3">💰 Smart Budget Travel Tips</h2>
            <ul className="space-y-2 text-green-700">
              <li>• <strong>Compare per GB costs</strong> - Not just total price</li>
              <li>• <strong>Consider validity periods</strong> - Longer = better value</li>
              <li>• <strong>Check coverage quality</strong> - Cheap isn't good if it doesn't work</li>
              <li>• <strong>Look for regional deals</strong> - Multi-country plans save money</li>
              <li>• <strong>Time your purchase</strong> - Watch for seasonal promotions</li>
            </ul>
          </div>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">🏆 Best Value eSIM Plans by Budget</h2>
            
            <div className="space-y-8">
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="text-2xl font-semibold mb-4 text-green-600">💸 Ultra Budget: Under $10</h3>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="border-2 border-green-500 rounded-lg p-4">
                    <div className="bg-green-500 text-white text-xs px-2 py-1 rounded mb-2 w-fit">BEST VALUE</div>
                    <h4 className="font-semibold text-lg mb-2">Basic Global</h4>
                    <p className="text-2xl font-bold text-green-600 mb-2">$4.99</p>
                    <ul className="text-sm space-y-1">
                      <li>✅ 1GB data</li>
                      <li>✅ 7-day validity</li>
                      <li>✅ 50+ countries</li>
                      <li>✅ $4.99/GB ratio</li>
                    </ul>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-lg mb-2">Regional Asia</h4>
                    <p className="text-2xl font-bold text-green-600 mb-2">$7.99</p>
                    <ul className="text-sm space-y-1">
                      <li>✅ 2GB data</li>
                      <li>✅ 15-day validity</li>
                      <li>✅ 12 Asian countries</li>
                      <li>✅ $3.99/GB ratio</li>
                    </ul>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-lg mb-2">Europe Starter</h4>
                    <p className="text-2xl font-bold text-green-600 mb-2">$8.99</p>
                    <ul className="text-sm space-y-1">
                      <li>✅ 3GB data</li>
                      <li>✅ 30-day validity</li>
                      <li>✅ 25 EU countries</li>
                      <li>✅ $2.99/GB ratio</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="text-2xl font-semibold mb-4 text-blue-600">💵 Mid Budget: $10-25</h3>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-lg mb-2">Global Standard</h4>
                    <p className="text-2xl font-bold text-blue-600 mb-2">$12.99</p>
                    <ul className="text-sm space-y-1">
                      <li>✅ 5GB data</li>
                      <li>✅ 30-day validity</li>
                      <li>✅ 100+ countries</li>
                      <li>✅ $2.59/GB ratio</li>
                    </ul>
                  </div>
                  
                  <div className="border-2 border-blue-500 rounded-lg p-4">
                    <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded mb-2 w-fit">POPULAR</div>
                    <h4 className="font-semibold text-lg mb-2">Backpacker Special</h4>
                    <p className="text-2xl font-bold text-blue-600 mb-2">$19.99</p>
                    <ul className="text-sm space-y-1">
                      <li>✅ 10GB data</li>
                      <li>✅ 60-day validity</li>
                      <li>✅ 80+ countries</li>
                      <li>✅ $1.99/GB ratio</li>
                    </ul>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-lg mb-2">Regional Premium</h4>
                    <p className="text-2xl font-bold text-blue-600 mb-2">$24.99</p>
                    <ul className="text-sm space-y-1">
                      <li>✅ 15GB data</li>
                      <li>✅ 45-day validity</li>
                      <li>✅ Premium networks</li>
                      <li>✅ $1.66/GB ratio</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="text-2xl font-semibold mb-4 text-purple-600">💎 Premium Budget: $25-50</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-lg mb-2">Long-term Traveler</h4>
                    <p className="text-2xl font-bold text-purple-600 mb-2">$34.99</p>
                    <ul className="text-sm space-y-1">
                      <li>✅ 25GB data</li>
                      <li>✅ 90-day validity</li>
                      <li>✅ 120+ countries</li>
                      <li>✅ $1.39/GB ratio</li>
                      <li>✅ Premium support</li>
                    </ul>
                  </div>
                  
                  <div className="border-2 border-purple-500 rounded-lg p-4">
                    <div className="bg-purple-500 text-white text-xs px-2 py-1 rounded mb-2 w-fit">BEST RATIO</div>
                    <h4 className="font-semibold text-lg mb-2">Ultimate Value</h4>
                    <p className="text-2xl font-bold text-purple-600 mb-2">$49.99</p>
                    <ul className="text-sm space-y-1">
                      <li>✅ 50GB data</li>
                      <li>✅ 120-day validity</li>
                      <li>✅ 150+ countries</li>
                      <li>✅ $0.99/GB ratio</li>
                      <li>✅ 5G speeds included</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">📊 Price Per GB Comparison</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Plan</th>
                    <th className="px-4 py-3 text-center font-semibold">Total Price</th>
                    <th className="px-4 py-3 text-center font-semibold">Data Amount</th>
                    <th className="px-4 py-3 text-center font-semibold">Per GB Cost</th>
                    <th className="px-4 py-3 text-center font-semibold">Value Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="bg-green-50">
                    <td className="px-4 py-3 font-medium">Ultimate Value (50GB)</td>
                    <td className="px-4 py-3 text-center">$49.99</td>
                    <td className="px-4 py-3 text-center">50GB</td>
                    <td className="px-4 py-3 text-center text-green-600 font-bold">$0.99</td>
                    <td className="px-4 py-3 text-center">⭐⭐⭐⭐⭐</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Long-term Traveler (25GB)</td>
                    <td className="px-4 py-3 text-center">$34.99</td>
                    <td className="px-4 py-3 text-center">25GB</td>
                    <td className="px-4 py-3 text-center text-green-600 font-bold">$1.39</td>
                    <td className="px-4 py-3 text-center">⭐⭐⭐⭐</td>
                  </tr>
                  <tr className="bg-blue-50">
                    <td className="px-4 py-3 font-medium">Backpacker Special (10GB)</td>
                    <td className="px-4 py-3 text-center">$19.99</td>
                    <td className="px-4 py-3 text-center">10GB</td>
                    <td className="px-4 py-3 text-center text-blue-600 font-bold">$1.99</td>
                    <td className="px-4 py-3 text-center">⭐⭐⭐⭐</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Global Standard (5GB)</td>
                    <td className="px-4 py-3 text-center">$12.99</td>
                    <td className="px-4 py-3 text-center">5GB</td>
                    <td className="px-4 py-3 text-center text-yellow-600">$2.59</td>
                    <td className="px-4 py-3 text-center">⭐⭐⭐</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Basic Global (1GB)</td>
                    <td className="px-4 py-3 text-center">$4.99</td>
                    <td className="px-4 py-3 text-center">1GB</td>
                    <td className="px-4 py-3 text-center text-red-600">$4.99</td>
                    <td className="px-4 py-3 text-center">⭐⭐</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">🎯 Money-Saving Strategies</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">📅 Timing Your Purchase</h3>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-semibold mb-2">🎉 Seasonal Sales</h4>
                    <p className="text-gray-600 text-sm">Black Friday, Cyber Monday, and holiday seasons offer 20-50% discounts.</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-semibold mb-2">📧 Newsletter Discounts</h4>
                    <p className="text-gray-600 text-sm">Subscribe for exclusive promo codes and early access to sales.</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-semibold mb-2">🔄 Loyalty Programs</h4>
                    <p className="text-gray-600 text-sm">Accumulate points for future purchases and get repeat customer discounts.</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">🧮 Smart Planning</h3>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-semibold mb-2">📱 WiFi First Strategy</h4>
                    <p className="text-gray-600 text-sm">Use WiFi when available, cellular for essential connectivity only.</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-semibold mb-2">📦 Bundle Regional Plans</h4>
                    <p className="text-gray-600 text-sm">Multi-country plans often cost less than individual country eSIMs.</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-semibold mb-2">⏰ Long-term Planning</h4>
                    <p className="text-gray-600 text-sm">Longer validity periods usually offer better per-day value.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">🌍 Best Budget Options by Region</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">🇪🇺 Europe Budget</h3>
                <div className="space-y-2">
                  <div className="bg-white rounded p-3">
                    <p className="font-semibold">EU Backpacker</p>
                    <p className="text-sm text-gray-600">3GB • 30 days • $8.99</p>
                  </div>
                  <div className="bg-white rounded p-3">
                    <p className="font-semibold">Schengen Basic</p>
                    <p className="text-sm text-gray-600">5GB • 45 days • $14.99</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-3">🌏 Asia Budget</h3>
                <div className="space-y-2">
                  <div className="bg-white rounded p-3">
                    <p className="font-semibold">SEA Explorer</p>
                    <p className="text-sm text-gray-600">2GB • 15 days • $7.99</p>
                  </div>
                  <div className="bg-white rounded p-3">
                    <p className="font-semibold">Asia Pacific</p>
                    <p className="text-sm text-gray-600">8GB • 60 days • $19.99</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-800 mb-3">🌎 Americas Budget</h3>
                <div className="space-y-2">
                  <div className="bg-white rounded p-3">
                    <p className="font-semibold">North America</p>
                    <p className="text-sm text-gray-600">4GB • 30 days • $16.99</p>
                  </div>
                  <div className="bg-white rounded p-3">
                    <p className="font-semibold">Latin America</p>
                    <p className="text-sm text-gray-600">6GB • 45 days • $22.99</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Start Saving on Travel Connectivity</h2>
            <p className="text-xl mb-6">Find the perfect budget eSIM plan for your next adventure without compromising on quality.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/plans" className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center">
                Browse Budget Plans
              </Link>
              <Link href="/contact" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors text-center">
                Get Personalized Advice
              </Link>
            </div>
          </section>
        </article>
      </div>
    </div>
  )
} 
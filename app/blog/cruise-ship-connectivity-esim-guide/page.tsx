import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cruise Ship Connectivity: eSIM Guide for Ocean Travel 2025',
  description: 'Stay connected on cruise ships with eSIM technology. Compare options for port connectivity, satellite internet alternatives, and cost-effective solutions.',
  keywords: 'cruise ship esim, cruise connectivity, ship internet, cruise wifi alternative, maritime esim',
}

export default function CruiseShipEsimPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <article className="prose prose-lg max-w-none">
          <header className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-6">
              Cruise Ship Connectivity: eSIM Guide for Ocean Travel 2025
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay connected during your cruise with smart eSIM solutions. Save money on expensive ship internet and stay in touch at every port.
            </p>
          </header>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
            <h2 className="text-xl font-semibold text-blue-800 mb-3">🚢 Cruise Connectivity Challenge</h2>
            <ul className="space-y-2 text-blue-700">
              <li>• <strong>Ship WiFi:</strong> $50-100+ per day for basic internet</li>
              <li>• <strong>Roaming Charges:</strong> $5-15 per MB in international waters</li>
              <li>• <strong>Poor Coverage:</strong> Unreliable connection at sea</li>
              <li>• <strong>eSIM Solution:</strong> Connect at ports for 90% less cost</li>
            </ul>
          </div>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">🌊 Cruise Connectivity Options</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-red-50 rounded-lg p-6 border-l-4 border-red-500">
                <h3 className="text-lg font-semibold text-red-800 mb-3">💸 Ship Internet</h3>
                <ul className="space-y-2 text-red-700 text-sm">
                  <li>• $60-120/day for unlimited</li>
                  <li>• Slow speeds (1-5 Mbps)</li>
                  <li>• Limited bandwidth</li>
                  <li>• Works at sea</li>
                </ul>
                <p className="text-red-600 font-semibold mt-3">❌ Most Expensive</p>
              </div>
              
              <div className="bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-500">
                <h3 className="text-lg font-semibold text-yellow-800 mb-3">📱 Roaming</h3>
                <ul className="space-y-2 text-yellow-700 text-sm">
                  <li>• $5-15/MB international</li>
                  <li>• Automatic connection</li>
                  <li>• Bill shock risk</li>
                  <li>• Limited at sea</li>
                </ul>
                <p className="text-yellow-600 font-semibold mt-3">⚠️ Unpredictable Cost</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-500">
                <h3 className="text-lg font-semibold text-green-800 mb-3">🗺️ Port eSIM</h3>
                <ul className="space-y-2 text-green-700 text-sm">
                  <li>• $3-8/day per country</li>
                  <li>• High-speed 4G/5G</li>
                  <li>• Works at ports only</li>
                  <li>• Multiple country plans</li>
                </ul>
                <p className="text-green-600 font-semibold mt-3">✅ Best Value</p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">🗺️ Popular Cruise Routes & eSIM Plans</h2>
            
            <div className="space-y-8">
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="text-2xl font-semibold mb-4 text-blue-600">🇪🇺 Mediterranean Cruise</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Typical Ports:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Barcelona, Spain</li>
                      <li>• Rome/Civitavecchia, Italy</li>
                      <li>• French Riviera (Nice/Cannes)</li>
                      <li>• Santorini, Greece</li>
                    </ul>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">EU Regional eSIM</h4>
                    <p className="text-2xl font-bold text-blue-600 mb-2">$24.99</p>
                    <ul className="text-sm space-y-1">
                      <li>✅ 15GB for 30 days</li>
                      <li>✅ All EU countries</li>
                      <li>✅ 4G/5G speeds</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="text-2xl font-semibold mb-4 text-green-600">🏝️ Caribbean Cruise</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Typical Ports:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Cozumel, Mexico</li>
                      <li>• Jamaica (Ocho Rios)</li>
                      <li>• Barbados</li>
                      <li>• St. Thomas, USVI</li>
                    </ul>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Caribbean Multi-Country</h4>
                    <p className="text-2xl font-bold text-green-600 mb-2">$19.99</p>
                    <ul className="text-sm space-y-1">
                      <li>✅ 10GB for 14 days</li>
                      <li>✅ 15 Caribbean countries</li>
                      <li>✅ Premium networks</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="text-2xl font-semibold mb-4 text-purple-600">🌸 Alaska/Northern Cruise</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Typical Ports:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Vancouver, Canada</li>
                      <li>• Juneau, Alaska</li>
                      <li>• Ketchikan, Alaska</li>
                      <li>• Seattle, Washington</li>
                    </ul>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">North America Plan</h4>
                    <p className="text-2xl font-bold text-purple-600 mb-2">$34.99</p>
                    <ul className="text-sm space-y-1">
                      <li>✅ 20GB for 30 days</li>
                      <li>✅ USA + Canada</li>
                      <li>✅ Premium coverage</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">💡 Smart Cruise Connectivity Strategy</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">🚢 At Sea (Offline Strategy)</h3>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-semibold mb-2">📱 Download Before Sailing</h4>
                    <ul className="text-gray-600 text-sm space-y-1">
                      <li>• Offline maps (Google Maps, Maps.me)</li>
                      <li>• Entertainment (Netflix downloads)</li>
                      <li>• Translation apps</li>
                      <li>• Port guides and excursion info</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-semibold mb-2">✈️ Enable Airplane Mode</h4>
                    <p className="text-gray-600 text-sm">Avoid accidental roaming charges while at sea. Use ship WiFi only when necessary.</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">🏝️ At Port (Online Strategy)</h3>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-semibold mb-2">📶 Activate eSIM</h4>
                    <ul className="text-gray-600 text-sm space-y-1">
                      <li>• Turn on cellular data</li>
                      <li>• Switch to travel eSIM</li>
                      <li>• Check messages and emails</li>
                      <li>• Upload photos to cloud</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-semibold mb-2">⏰ Time Management</h4>
                    <p className="text-gray-600 text-sm">Most ports offer 6-8 hours. Use first 30 minutes for essential communications.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">💰 Cost Comparison Example</h2>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">7-Day Mediterranean Cruise</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-lg shadow-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Option</th>
                      <th className="px-4 py-3 text-center font-semibold">Total Cost</th>
                      <th className="px-4 py-3 text-center font-semibold">Coverage</th>
                      <th className="px-4 py-3 text-center font-semibold">Speed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="bg-red-50">
                      <td className="px-4 py-3 font-medium">Ship Internet (7 days)</td>
                      <td className="px-4 py-3 text-center text-red-600 font-bold">$420-700</td>
                      <td className="px-4 py-3 text-center">Sea + Ports</td>
                      <td className="px-4 py-3 text-center">1-5 Mbps</td>
                    </tr>
                    <tr className="bg-yellow-50">
                      <td className="px-4 py-3 font-medium">International Roaming</td>
                      <td className="px-4 py-3 text-center text-yellow-600 font-bold">$200-500+</td>
                      <td className="px-4 py-3 text-center">Ports Only</td>
                      <td className="px-4 py-3 text-center">Variable</td>
                    </tr>
                    <tr className="bg-green-50">
                      <td className="px-4 py-3 font-medium">EU eSIM Plan</td>
                      <td className="px-4 py-3 text-center text-green-600 font-bold">$24.99</td>
                      <td className="px-4 py-3 text-center">Ports Only</td>
                      <td className="px-4 py-3 text-center">50+ Mbps</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 p-4 bg-green-100 rounded-lg">
                <p className="text-green-800 font-semibold">💡 Savings with eSIM: $395-675 (94-96% less than ship internet)</p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">📋 Pre-Cruise Checklist</h2>
            
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">🧳 2 Weeks Before Departure</h3>
              <ul className="space-y-2 text-blue-700">
                <li>☐ Research ports of call and countries visited</li>
                <li>☐ Purchase appropriate regional eSIM plans</li>
                <li>☐ Download offline maps and entertainment</li>
                <li>☐ Install eSIM profiles (but don't activate yet)</li>
                <li>☐ Contact your carrier about international roaming</li>
                <li>☐ Set up automatic cloud backup for photos</li>
                <li>☐ Download currency converter and translation apps</li>
              </ul>
            </div>
          </section>

          <section className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Set Sail with Smart Connectivity</h2>
            <p className="text-xl mb-6">Get the perfect eSIM plan for your cruise adventure and save hundreds on connectivity costs.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/plans" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center">
                Find My Cruise eSIM
              </Link>
              <Link href="/contact" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors text-center">
                Get Cruise Advice
              </Link>
            </div>
          </section>
        </article>
      </div>
    </div>
  )
} 
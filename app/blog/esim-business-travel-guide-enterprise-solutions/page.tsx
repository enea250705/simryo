import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'eSIM for Business Travel: Complete Enterprise Guide 2025',
  description: 'Enterprise eSIM solutions for business travel. Bulk plans, expense management, global coverage, and corporate policies for seamless connectivity.',
  keywords: 'business esim, corporate esim, enterprise esim, business travel connectivity, bulk esim plans',
}

export default function BusinessEsimPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <article className="prose prose-lg max-w-none">
          <header className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              eSIM for Business Travel: Complete Enterprise Guide 2025
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Streamline your corporate travel with enterprise eSIM solutions. Get bulk pricing, centralized management, and global coverage for your business travelers.
            </p>
          </header>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
            <h2 className="text-xl font-semibold text-blue-800 mb-3">🏢 Why Enterprises Choose eSIM</h2>
            <ul className="space-y-2 text-blue-700">
              <li>• <strong>Cost Control:</strong> Up to 70% savings vs roaming charges</li>
              <li>• <strong>Instant Deployment:</strong> No physical SIM card logistics</li>
              <li>• <strong>Centralized Management:</strong> Bulk purchasing and allocation</li>
              <li>• <strong>Policy Compliance:</strong> Data usage monitoring and controls</li>
              <li>• <strong>Employee Satisfaction:</strong> Seamless connectivity worldwide</li>
            </ul>
          </div>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">💼 Enterprise eSIM Plans</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-lg border-2 border-blue-500">
                <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded mb-2 w-fit">POPULAR</div>
                <h3 className="text-xl font-semibold mb-3">Business Starter</h3>
                <p className="text-3xl font-bold text-blue-600 mb-4">$25/user/month</p>
                <ul className="space-y-2 mb-6">
                  <li>✅ 15GB global data</li>
                  <li>✅ 30+ countries</li>
                  <li>✅ Basic reporting</li>
                  <li>✅ Email support</li>
                  <li>✅ Bulk discounts available</li>
                </ul>
                <p className="text-sm text-gray-600">Perfect for small teams (5-50 employees)</p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-lg border-2 border-purple-500">
                <div className="bg-purple-500 text-white text-xs px-2 py-1 rounded mb-2 w-fit">RECOMMENDED</div>
                <h3 className="text-xl font-semibold mb-3">Business Pro</h3>
                <p className="text-3xl font-bold text-purple-600 mb-4">$45/user/month</p>
                <ul className="space-y-2 mb-6">
                  <li>✅ 50GB global data</li>
                  <li>✅ 100+ countries</li>
                  <li>✅ Advanced analytics</li>
                  <li>✅ Priority support</li>
                  <li>✅ Custom policies</li>
                </ul>
                <p className="text-sm text-gray-600">Ideal for medium companies (50-500 employees)</p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-lg border-2 border-gold">
                <div className="bg-yellow-500 text-white text-xs px-2 py-1 rounded mb-2 w-fit">ENTERPRISE</div>
                <h3 className="text-xl font-semibold mb-3">Enterprise</h3>
                <p className="text-3xl font-bold text-yellow-600 mb-4">Custom</p>
                <ul className="space-y-2 mb-6">
                  <li>✅ Unlimited global data</li>
                  <li>✅ 150+ countries</li>
                  <li>✅ Full API access</li>
                  <li>✅ Dedicated support</li>
                  <li>✅ SLA guarantees</li>
                </ul>
                <p className="text-sm text-gray-600">For large enterprises (500+ employees)</p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">📊 Cost Comparison: eSIM vs Traditional Solutions</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Solution</th>
                    <th className="px-4 py-3 text-center font-semibold">Setup Cost</th>
                    <th className="px-4 py-3 text-center font-semibold">Monthly Cost</th>
                    <th className="px-4 py-3 text-center font-semibold">Management</th>
                    <th className="px-4 py-3 text-center font-semibold">Flexibility</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="bg-red-50">
                    <td className="px-4 py-3 font-medium">International Roaming</td>
                    <td className="px-4 py-3 text-center">$0</td>
                    <td className="px-4 py-3 text-center text-red-600">$150-300/user</td>
                    <td className="px-4 py-3 text-center">Complex</td>
                    <td className="px-4 py-3 text-center">Low</td>
                  </tr>
                  <tr className="bg-yellow-50">
                    <td className="px-4 py-3 font-medium">Local SIM Cards</td>
                    <td className="px-4 py-3 text-center">$50/trip</td>
                    <td className="px-4 py-3 text-center text-yellow-600">$80-150/user</td>
                    <td className="px-4 py-3 text-center">Manual</td>
                    <td className="px-4 py-3 text-center">Medium</td>
                  </tr>
                  <tr className="bg-green-50">
                    <td className="px-4 py-3 font-medium">Enterprise eSIM</td>
                    <td className="px-4 py-3 text-center">$0</td>
                    <td className="px-4 py-3 text-center text-green-600">$25-65/user</td>
                    <td className="px-4 py-3 text-center">Automated</td>
                    <td className="px-4 py-3 text-center">High</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">🔧 Enterprise Management Features</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">📈 Analytics & Reporting</h3>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-semibold mb-2">Real-time Usage Monitoring</h4>
                    <p className="text-gray-600 text-sm">Track data consumption, costs, and usage patterns across all employees in real-time.</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-semibold mb-2">Detailed Cost Reports</h4>
                    <p className="text-gray-600 text-sm">Monthly/quarterly reports with cost breakdowns by employee, department, and destination.</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-semibold mb-2">Budget Alerts</h4>
                    <p className="text-gray-600 text-sm">Automated notifications when usage approaches predefined limits or budgets.</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">⚙️ Policy & Control</h3>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-semibold mb-2">Usage Policies</h4>
                    <p className="text-gray-600 text-sm">Set data limits, approved countries, and usage restrictions per employee or department.</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-semibold mb-2">Approval Workflows</h4>
                    <p className="text-gray-600 text-sm">Require manager approval for high-cost destinations or additional data purchases.</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-semibold mb-2">Automatic Provisioning</h4>
                    <p className="text-gray-600 text-sm">Instantly provision eSIMs based on travel itineraries and company policies.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">🌍 Global Coverage for Business</h2>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Enterprise Network Partnerships</h3>
              <p className="mb-4">Our enterprise eSIM solutions leverage premium carrier partnerships worldwide:</p>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-blue-600 mb-2">🇺🇸 Americas</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Verizon (USA)</li>
                    <li>• Rogers (Canada)</li>
                    <li>• Telcel (Mexico)</li>
                    <li>• Movistar (Latin America)</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-green-600 mb-2">🇪🇺 Europe/Africa</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Vodafone (Multi-country)</li>
                    <li>• Orange (France/Africa)</li>
                    <li>• Deutsche Telekom (Germany)</li>
                    <li>• MTN (Africa)</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-purple-600 mb-2">🇯🇵 Asia-Pacific</h4>
                  <ul className="text-sm space-y-1">
                    <li>• NTT Docomo (Japan)</li>
                    <li>• Singtel (Singapore)</li>
                    <li>• Telstra (Australia)</li>
                    <li>• China Mobile (China)</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Business Travel?</h2>
            <p className="text-xl mb-6">Get a custom quote and see how much your company can save with enterprise eSIM solutions.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center">
                Request Enterprise Quote
              </Link>
              <Link href="/plans" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors text-center">
                View Business Plans
              </Link>
            </div>
          </section>
        </article>
      </div>
    </div>
  )
} 
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Family Travel eSIM & Group Plans 2025: Complete Guide',
  description: 'Best eSIM solutions for family travel and groups. Compare shared data plans, individual eSIMs, and cost-effective options for multiple travelers.',
  keywords: 'family esim, group esim plans, family travel connectivity, shared esim, group travel esim',
  openGraph: {
    title: 'Family Travel eSIM & Group Plans 2025: Complete Guide',
    description: 'Best eSIM solutions for family travel and groups. Compare shared data plans, individual eSIMs, and cost-effective options for multiple travelers.',
    images: ['/blog/family-travel-plans.jpg'],
    type: 'article',
    publishedTime: '2025-07-18T10:00:00.000Z'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Family Travel eSIM & Group Plans 2025: Complete Guide',
    description: 'Best eSIM solutions for family travel and groups. Compare shared data plans, individual eSIMs, and cost-effective options for multiple travelers.',
    images: ['/blog/family-travel-plans.jpg']
  }
}

export default function FamilyTravelEsimPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <article className="prose prose-lg max-w-none">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-6 text-center">
            Family Travel eSIM & Group Plans 2025
          </h1>
          
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">👨‍👩‍👧‍👦 Family eSIM Options</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-3">Individual eSIMs</h3>
                <p className="text-2xl font-bold text-blue-600 mb-3">$15/person</p>
                <ul className="text-sm space-y-1">
                  <li>✅ Personal data allowance</li>
                  <li>✅ Independent usage</li>
                  <li>✅ No sharing conflicts</li>
                  <li>❌ Higher total cost</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-lg border-2 border-green-500">
                <div className="bg-green-500 text-white text-xs px-2 py-1 rounded mb-2 w-fit">RECOMMENDED</div>
                <h3 className="text-lg font-semibold mb-3">Shared Hotspot</h3>
                <p className="text-2xl font-bold text-green-600 mb-3">$25/family</p>
                <ul className="text-sm space-y-1">
                  <li>✅ One device shares data</li>
                  <li>✅ Cost-effective for groups</li>
                  <li>✅ Centralized management</li>
                  <li>⚠️ Battery dependency</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-3">Hybrid Solution</h3>
                <p className="text-2xl font-bold text-purple-600 mb-3">$35/family</p>
                <ul className="text-sm space-y-1">
                  <li>✅ Mix of individual + shared</li>
                  <li>✅ Backup connectivity</li>
                  <li>✅ Flexible usage</li>
                  <li>⚠️ More complex setup</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">💰 Cost Analysis by Family Size</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Family Size</th>
                    <th className="px-4 py-3 text-center font-semibold">Individual eSIMs</th>
                    <th className="px-4 py-3 text-center font-semibold">Shared Hotspot</th>
                    <th className="px-4 py-3 text-center font-semibold">Best Option</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 font-medium">2 Adults</td>
                    <td className="px-4 py-3 text-center">$30/week</td>
                    <td className="px-4 py-3 text-center text-green-600">$25/week</td>
                    <td className="px-4 py-3 text-center">Shared</td>
                  </tr>
                  <tr className="bg-blue-50">
                    <td className="px-4 py-3 font-medium">2 Adults + 2 Kids</td>
                    <td className="px-4 py-3 text-center">$60/week</td>
                    <td className="px-4 py-3 text-center text-green-600">$35/week</td>
                    <td className="px-4 py-3 text-center">Shared</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">2 Adults + Teens</td>
                    <td className="px-4 py-3 text-center">$60/week</td>
                    <td className="px-4 py-3 text-center">$45/week</td>
                    <td className="px-4 py-3 text-center">Hybrid</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">🎯 Family Travel Tips</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-blue-800 mb-3">👨‍👩‍👧 Managing Kids' Usage</h3>
                <ul className="space-y-2 text-blue-700">
                  <li>• Set data limits per device</li>
                  <li>• Download content before travel</li>
                  <li>• Use parental controls</li>
                  <li>• Encourage WiFi usage</li>
                </ul>
              </div>
              
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-green-800 mb-3">💡 Smart Strategies</h3>
                <ul className="space-y-2 text-green-700">
                  <li>• One parent as hotspot host</li>
                  <li>• Backup eSIM for emergencies</li>
                  <li>• Rotate hotspot duties</li>
                  <li>• Monitor usage daily</li>
                </ul>
              </div>
            </div>
          </section>
        </article>
      </div>
    </div>
  )
} 
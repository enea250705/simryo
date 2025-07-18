import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Emergency Communication & Backup eSIM Guide 2025',
  description: 'Essential guide to emergency communication with eSIM technology. Learn about backup connectivity, emergency services, and crisis communication.',
  keywords: 'emergency esim, backup connectivity, emergency communication, crisis esim, emergency data plan',
  openGraph: {
    title: 'Emergency Communication & Backup eSIM Guide 2025',
    description: 'Essential guide to emergency communication with eSIM technology. Learn about backup connectivity, emergency services, and crisis communication.',
    images: ['/blog/emergency-communication.jpg'],
    type: 'article',
    publishedTime: '2025-07-18T10:00:00.000Z'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emergency Communication & Backup eSIM Guide 2025',
    description: 'Essential guide to emergency communication with eSIM technology. Learn about backup connectivity, emergency services, and crisis communication.',
    images: ['/blog/emergency-communication.jpg']
  }
}

export default function EmergencyEsimPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <article className="prose prose-lg max-w-none">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-6 text-center">
            Emergency Communication & Backup eSIM Guide 2025
          </h1>
          
          <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8">
            <h2 className="text-xl font-semibold text-red-800 mb-3">🚨 Emergency Preparedness</h2>
            <ul className="space-y-2 text-red-700">
              <li>• Always have backup connectivity options</li>
              <li>• Pre-install emergency eSIM profiles</li>
              <li>• Keep emergency contact numbers offline</li>
              <li>• Know local emergency service numbers</li>
            </ul>
          </div>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">🆘 Emergency eSIM Plans</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-lg border-2 border-red-500">
                <div className="bg-red-500 text-white text-xs px-2 py-1 rounded mb-2 w-fit">EMERGENCY</div>
                <h3 className="text-xl font-semibold mb-3">Crisis Communication</h3>
                <p className="text-2xl font-bold text-red-600 mb-3">$9.99</p>
                <ul className="space-y-2 mb-4">
                  <li>✅ 1GB emergency data</li>
                  <li>✅ 7-day validity</li>
                  <li>✅ Global coverage</li>
                  <li>✅ Instant activation</li>
                  <li>✅ Emergency services access</li>
                </ul>
                <p className="text-sm text-gray-600">For critical communication needs</p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-lg border-2 border-orange-500">
                <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded mb-2 w-fit">BACKUP</div>
                <h3 className="text-xl font-semibold mb-3">Extended Backup</h3>
                <p className="text-2xl font-bold text-orange-600 mb-3">$19.99</p>
                <ul className="space-y-2 mb-4">
                  <li>✅ 5GB backup data</li>
                  <li>✅ 30-day validity</li>
                  <li>✅ Multi-country coverage</li>
                  <li>✅ Family sharing option</li>
                  <li>✅ 24/7 support priority</li>
                </ul>
                <p className="text-sm text-gray-600">For extended emergency situations</p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">📞 Emergency Contact Strategy</h2>
            
            <div className="bg-yellow-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-yellow-800 mb-4">Essential Emergency Numbers</h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-2">🇺🇸 North America</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Emergency: 911</li>
                    <li>• Non-emergency: 311</li>
                    <li>• Poison Control: 1-800-222-1222</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-2">🇪🇺 Europe</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Emergency: 112</li>
                    <li>• Police: 110 (Germany)</li>
                    <li>• Medical: 15 (France)</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-2">🌏 Asia Pacific</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Japan: 110 (Police), 119 (Fire)</li>
                    <li>• Australia: 000</li>
                    <li>• Singapore: 999</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">📱 Emergency Apps & Tools</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-lg mb-3 text-red-600">🆘 Emergency</h3>
                <ul className="space-y-1 text-sm">
                  <li>• SkyAlert (Global)</li>
                  <li>• Emergency SOS (iOS)</li>
                  <li>• ICE (In Case of Emergency)</li>
                  <li>• Red Cross Emergency</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-lg mb-3 text-blue-600">📡 Communication</h3>
                <ul className="space-y-1 text-sm">
                  <li>• WhatsApp</li>
                  <li>• Signal (Encrypted)</li>
                  <li>• Telegram</li>
                  <li>• Zello Walkie Talkie</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-lg mb-3 text-green-600">🗺️ Location</h3>
                <ul className="space-y-1 text-sm">
                  <li>• Find My (iOS)</li>
                  <li>• Google Find My Device</li>
                  <li>• Life360</li>
                  <li>• what3words</li>
                </ul>
              </div>
            </div>
          </section>
        </article>
      </div>
    </div>
  )
} 
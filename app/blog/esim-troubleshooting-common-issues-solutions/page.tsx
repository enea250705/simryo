import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'eSIM Troubleshooting: Fix Common Issues & Problems [2025 Guide]',
  description: 'Complete guide to fix eSIM problems. Solutions for activation issues, no internet connection, network problems, and device compatibility troubles.',
  keywords: 'esim not working, esim problems, esim troubleshooting, esim activation failed, esim no internet',
  openGraph: {
    title: 'eSIM Troubleshooting: Fix Common Issues & Problems [2025 Guide]',
    description: 'Complete guide to fix eSIM problems. Solutions for activation issues, no internet connection, network problems, and device compatibility troubles.',
    images: ['/blog/esim-troubleshooting-guide.jpg'],
    type: 'article',
    publishedTime: '2025-07-18T10:00:00.000Z'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'eSIM Troubleshooting: Fix Common Issues & Problems [2025 Guide]',
    description: 'Complete guide to fix eSIM problems. Solutions for activation issues, no internet connection, network problems, and device compatibility troubles.',
    images: ['/blog/esim-troubleshooting-guide.jpg']
  }
}

export default function EsimTroubleshootingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <article className="prose prose-lg max-w-none">
          <header className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              eSIM Troubleshooting: Fix Common Issues & Problems
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Having eSIM problems? Our comprehensive troubleshooting guide helps you quickly resolve activation, connectivity, and performance issues.
            </p>
          </header>

          <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8">
            <h2 className="text-xl font-semibold text-red-800 mb-3">🚨 Quick Emergency Solutions</h2>
            <ul className="space-y-2 text-red-700">
              <li>• <strong>No Internet:</strong> Toggle Airplane mode ON/OFF</li>
              <li>• <strong>Can't Activate:</strong> Check WiFi connection and try again</li>
              <li>• <strong>Wrong Network:</strong> Go to Settings > Cellular > Network Selection</li>
              <li>• <strong>Still Problems:</strong> Restart your device completely</li>
            </ul>
          </div>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">🔧 Common eSIM Problems & Solutions</h2>
            
            <div className="space-y-8">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-semibold text-red-600 mb-3">❌ Problem: eSIM Won't Activate</h3>
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Possible Causes:</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>No internet connection during setup</li>
                    <li>QR code scanned multiple times</li>
                    <li>Device not eSIM compatible</li>
                    <li>Carrier restrictions</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">✅ Solutions:</h4>
                  <ol className="list-decimal list-inside text-green-700 space-y-1">
                    <li>Ensure stable WiFi connection</li>
                    <li>Use fresh QR code (contact support for new one)</li>
                    <li>Verify device compatibility</li>
                    <li>Check if device is carrier-locked</li>
                    <li>Try manual installation with SM-DP+ address</li>
                  </ol>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-semibold text-red-600 mb-3">📶 Problem: No Internet Connection</h3>
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Possible Causes:</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Wrong APN settings</li>
                    <li>Data roaming disabled</li>
                    <li>Network not selected properly</li>
                    <li>eSIM not set as primary data line</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">✅ Solutions:</h4>
                  <ol className="list-decimal list-inside text-green-700 space-y-1">
                    <li>Enable Data Roaming for eSIM</li>
                    <li>Set eSIM as Primary Data Line</li>
                    <li>Reset Network Settings</li>
                    <li>Manually select network operator</li>
                    <li>Check APN configuration</li>
                  </ol>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-semibold text-red-600 mb-3">🐌 Problem: Slow Internet Speed</h3>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">✅ Solutions:</h4>
                  <ol className="list-decimal list-inside text-green-700 space-y-1">
                    <li>Check data usage (may be throttled)</li>
                    <li>Move to area with better coverage</li>
                    <li>Switch to different network band</li>
                    <li>Restart device to refresh connection</li>
                    <li>Clear cache of internet-heavy apps</li>
                  </ol>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">📱 Device-Specific Troubleshooting</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold mb-3">🍎 iPhone Issues</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Settings > Cellular > Add Cellular Plan</li>
                  <li>• Check for iOS updates</li>
                  <li>• Reset Network Settings if needed</li>
                  <li>• Ensure device is unlocked</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold mb-3">🤖 Android Issues</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Settings > Network > Mobile Network</li>
                  <li>• Clear SIM Toolkit cache</li>
                  <li>• Check Google Play Services</li>
                  <li>• Verify carrier compatibility</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">🔄 Step-by-Step Reset Guide</h2>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6">
              <h3 className="text-xl font-semibold text-yellow-800 mb-4">⚠️ Last Resort: Complete Reset</h3>
              <p className="text-yellow-700 mb-4">Try these steps only if other solutions don't work:</p>
              
              <ol className="space-y-3 text-yellow-700">
                <li className="flex items-start">
                  <span className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">1</span>
                  <div>
                    <strong>Backup your data</strong>
                    <p>Ensure all important data is backed up</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">2</span>
                  <div>
                    <strong>Remove eSIM profile</strong>
                    <p>Delete the problematic eSIM from device settings</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">3</span>
                  <div>
                    <strong>Reset Network Settings</strong>
                    <p>This will remove all WiFi passwords and cellular settings</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">4</span>
                  <div>
                    <strong>Request new eSIM</strong>
                    <p>Contact support for a fresh QR code</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">5</span>
                  <div>
                    <strong>Reinstall eSIM</strong>
                    <p>Follow activation process with new QR code</p>
                  </div>
                </li>
              </ol>
            </div>
          </section>

          <section className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
            <p className="text-xl mb-6">Our expert support team is available 24/7 to resolve any eSIM issues.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/support" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center">
                Contact Support
              </Link>
              <Link href="/faq" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors text-center">
                View FAQ
              </Link>
            </div>
          </section>
        </article>
      </div>
    </div>
  )
} 
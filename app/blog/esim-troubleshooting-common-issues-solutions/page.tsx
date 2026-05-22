import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'eSIM Troubleshooting: Fix Common Issues & Problems [2025 Guide]',
  description: 'Complete guide to fix eSIM problems. Solutions for activation issues, no internet connection, network problems, and device compatibility troubles.',
  keywords: 'esim not working, esim problems, esim troubleshooting, esim activation failed, esim no internet',
  openGraph: {
    title: 'eSIM Troubleshooting: Fix Common Issues & Problems [2025 Guide]',
    description: 'Complete guide to fix eSIM problems. Solutions for activation issues, no internet connection, network problems, and device compatibility troubles.',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=630&fit=crop&crop=center'],
    type: 'article',
    publishedTime: '2025-07-18T10:00:00.000Z'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'eSIM Troubleshooting: Fix Common Issues & Problems [2025 Guide]',
    description: 'Complete guide to fix eSIM problems. Solutions for activation issues, no internet connection, network problems, and device compatibility troubles.',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=630&fit=crop&crop=center']
  }
}

export default function EsimTroubleshootingPage() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">

        {/* Back */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-8">
          ← All articles
        </Link>

        {/* Header */}
        <header className="mb-10">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Technical Support</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight">eSIM Troubleshooting: Fix Common Issues and Problems</h1>
          <p className="text-gray-500 mb-5 leading-relaxed">Having eSIM problems? Our comprehensive troubleshooting guide helps you quickly resolve activation, connectivity, and performance issues.</p>
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-8">
            <span className="font-medium text-gray-600">Tech Support Team</span>
            <span>·</span>
            <span>Nov 18, 2024</span>
            <span>·</span>
            <span>7 min read</span>
          </div>
          <div className="relative h-56 sm:h-64 rounded-2xl overflow-hidden bg-gray-100">
            <Image src="https://images.unsplash.com/photo-1495592822108-9e6261896da8?w=900&q=80" alt="eSIM troubleshooting and technical support" fill className="object-cover" priority />
          </div>
        </header>

        {/* Article content */}
        <article className="prose prose-gray max-w-none">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
            <p className="text-gray-900 font-medium mb-2">Quick Emergency Solutions</p>
            <ul className="mb-0">
              <li><strong>No internet:</strong> Toggle Airplane mode on, wait 10 seconds, toggle off.</li>
              <li><strong>Can't activate:</strong> Check that you have a stable Wi-Fi connection and try again.</li>
              <li><strong>Wrong network:</strong> Go to Settings &gt; Cellular &gt; Network Selection and choose manually.</li>
              <li><strong>Still not working:</strong> Restart your device completely.</li>
            </ul>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Common eSIM Problems and Solutions</h2>

          <h3 className="text-base font-semibold text-gray-900 mt-6 mb-3">Problem: eSIM Won't Activate</h3>
          <p>Possible causes include no internet connection during setup, a QR code that has already been scanned (each QR code is single-use), a device that isn't eSIM compatible, or carrier restrictions on the device.</p>

          <p>Solutions to try in order:</p>
          <ol>
            <li>Ensure you have a stable Wi-Fi connection before scanning — eSIM activation requires internet access.</li>
            <li>If the QR code has already been scanned, contact your provider for a fresh activation code.</li>
            <li>Verify that your device supports eSIM by checking the manufacturer's specifications page.</li>
            <li>Check whether your device is carrier-locked — locked devices may not accept third-party eSIM profiles.</li>
            <li>Try manual installation using the SM-DP+ address and activation code if your provider supplies them.</li>
          </ol>

          <h3 className="text-base font-semibold text-gray-900 mt-6 mb-3">Problem: No Internet Connection After Activation</h3>
          <p>Common causes are wrong APN settings, data roaming disabled, the network not selected properly, or the eSIM not set as the primary data line.</p>

          <p>Solutions:</p>
          <ol>
            <li>Go to Settings &gt; Cellular (or Mobile Data) and enable Data Roaming for your eSIM line.</li>
            <li>Confirm your eSIM is set as the primary data line, not just the secondary SIM.</li>
            <li>Try resetting network settings (note: this also removes saved Wi-Fi passwords).</li>
            <li>Manually select the local network operator rather than using automatic selection.</li>
            <li>Check whether your APN settings are correct — your provider's support page will have the right values.</li>
          </ol>

          <h3 className="text-base font-semibold text-gray-900 mt-6 mb-3">Problem: Slow Internet Speed</h3>
          <p>Slow speeds can indicate you've hit your plan's fair usage threshold, poor coverage in your current location, or a network congestion issue.</p>

          <p>Solutions:</p>
          <ol>
            <li>Check your data usage — if you've hit the FUP threshold, speeds will be throttled until the next day or until you top up.</li>
            <li>Move to a different location — building materials and distance from towers affect signal quality significantly.</li>
            <li>Restart your device to force a fresh network connection.</li>
            <li>Switch the network selection to a different available carrier if multiple are available in your settings.</li>
            <li>Clear the cache of data-heavy apps (maps, browsers) which can occasionally affect connection performance.</li>
          </ol>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Device-Specific Troubleshooting</h2>

          <h3 className="text-base font-semibold text-gray-900 mt-6 mb-3">iPhone Issues</h3>
          <ul>
            <li>Navigate to Settings &gt; Cellular &gt; Add Cellular Plan to add a new eSIM.</li>
            <li>Check for iOS updates — outdated software can cause eSIM compatibility issues.</li>
            <li>Reset Network Settings via Settings &gt; General &gt; Transfer or Reset iPhone if connectivity issues persist.</li>
            <li>Ensure the device is carrier-unlocked (not locked to a specific carrier).</li>
          </ul>

          <h3 className="text-base font-semibold text-gray-900 mt-6 mb-3">Android Issues</h3>
          <ul>
            <li>Navigate to Settings &gt; Network &gt; Mobile Network to manage eSIM profiles.</li>
            <li>Clear the SIM Toolkit app's cache if experiencing profile management issues.</li>
            <li>Check that Google Play Services are up to date, as some eSIM functionality depends on them.</li>
            <li>Verify carrier compatibility — some Android devices are region-locked and may not work with all providers.</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Last Resort: Complete Reset and Reinstallation</h2>
          <p>If none of the above solutions work, a full eSIM reset and reinstallation often resolves persistent issues. Use this approach only after trying simpler solutions.</p>

          <ol>
            <li><strong>Back up your data</strong> — ensure all important content is backed up before proceeding.</li>
            <li><strong>Remove the eSIM profile</strong> — delete the problematic eSIM from your device's cellular settings.</li>
            <li><strong>Reset Network Settings</strong> — this removes all Wi-Fi passwords and cellular configuration. Reconnect to Wi-Fi afterward.</li>
            <li><strong>Request a new eSIM</strong> — contact your provider's support for a fresh QR code or activation code.</li>
            <li><strong>Reinstall the eSIM</strong> — follow the activation process from the beginning with the new credentials.</li>
          </ol>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">When to Contact Support</h2>
          <p>Contact your eSIM provider's support team if:</p>
          <ul>
            <li>You've tried all the above steps and the eSIM still won't activate or connect.</li>
            <li>Your device shows the eSIM as installed but connectivity never works.</li>
            <li>You're receiving error messages during activation that aren't covered in your provider's FAQ.</li>
            <li>You need a replacement QR code because your original was scanned or expired.</li>
          </ul>

          <p>SIMRYO offers 24/7 customer support to help resolve any eSIM issues. You can reach the support team through the website at <Link href="/plans" className="text-gray-900 underline">simryo.com</Link>.</p>
        </article>

        {/* CTA */}
        <div className="mt-12 border border-gray-200 rounded-xl p-6 bg-gray-50 text-center">
          <p className="text-sm font-semibold text-gray-900 mb-1">Ready to get connected?</p>
          <p className="text-sm text-gray-500 mb-4">Browse eSIM plans for 190+ countries.</p>
          <Link href="/plans">
            <button className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
              Browse Plans →
            </button>
          </Link>
        </div>

      </div>
    </div>
  )
}

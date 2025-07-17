import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy - SIMRYO | How We Protect Your Data",
  description: "Learn how SIMRYO collects, uses, and protects your personal information when you use our eSIM services.",
  keywords: "privacy policy, data protection, GDPR, personal information",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Information We Collect</h2>
            <p className="text-gray-600 mb-4">
              We collect information you provide directly to us, such as when you create an account, 
              purchase our services, or contact us for support.
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Personal information (name, email address, phone number)</li>
              <li>Payment information (processed securely by third-party providers)</li>
              <li>Device information (IMEI, device model, operating system)</li>
              <li>Usage data (data consumption, connection logs)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-600 mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Provide and maintain our eSIM services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices, updates, and support messages</li>
              <li>Respond to your comments, questions, and customer service requests</li>
              <li>Monitor and analyze trends, usage, and activities</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Information Sharing</h2>
            <p className="text-gray-600 mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties 
              except as described in this policy:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>With mobile network operators to provide connectivity services</li>
              <li>With payment processors to handle transactions</li>
              <li>When required by law or to protect our rights</li>
              <li>With your consent or at your direction</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Data Security</h2>
            <p className="text-gray-600 mb-4">
              We implement appropriate technical and organizational measures to protect your personal 
              information against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Your Rights</h2>
            <p className="text-gray-600 mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Access and update your personal information</li>
              <li>Request deletion of your personal information</li>
              <li>Object to processing of your personal information</li>
              <li>Request data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Contact Us</h2>
            <p className="text-gray-600">
              If you have any questions about this Privacy Policy, please contact us at:{" "}
              <a href="mailto:privacy@simryo.com" className="text-accent-500 hover:underline">
                privacy@simryo.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
} 
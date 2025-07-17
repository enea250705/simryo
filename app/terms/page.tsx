import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service - SIMRYO | User Agreement",
  description: "Read SIMRYO's terms of service and user agreement for our global eSIM connectivity services.",
  keywords: "terms of service, user agreement, legal terms, eSIM terms",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-foreground mb-8">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 mb-4">
              By accessing or using SIMRYO's services, you agree to be bound by these Terms of Service 
              and all applicable laws and regulations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Service Description</h2>
            <p className="text-gray-600 mb-4">
              SIMRYO provides eSIM connectivity services that allow you to access mobile data networks 
              in various countries around the world. Our services include:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>eSIM profile provisioning and activation</li>
              <li>Data connectivity through partner networks</li>
              <li>Customer support and technical assistance</li>
              <li>Account management tools</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Account Registration</h2>
            <p className="text-gray-600 mb-4">
              To use our services, you must provide accurate and complete information during registration. 
              You are responsible for maintaining the confidentiality of your account credentials.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Payment and Billing</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>All payments are processed securely through third-party payment providers</li>
              <li>Prices are subject to change with reasonable notice</li>
              <li>Refunds are provided according to our refund policy</li>
              <li>You are responsible for all charges incurred under your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Service Limitations</h2>
            <p className="text-gray-600 mb-4">Our services are subject to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Network availability and coverage limitations</li>
              <li>Data speed and bandwidth restrictions</li>
              <li>Device compatibility requirements</li>
              <li>Local regulations and restrictions</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Prohibited Uses</h2>
            <p className="text-gray-600 mb-4">You may not use our services for:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Illegal activities or violation of local laws</li>
              <li>Spamming, phishing, or other malicious activities</li>
              <li>Excessive usage that impacts network performance</li>
              <li>Reselling or redistributing our services without authorization</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Limitation of Liability</h2>
            <p className="text-gray-600 mb-4">
              SIMRYO shall not be liable for any indirect, incidental, special, or consequential damages 
              resulting from your use of our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Contact Information</h2>
            <p className="text-gray-600">
              For questions about these Terms of Service, contact us at:{" "}
              <a href="mailto:legal@simryo.com" className="text-accent-500 hover:underline">
                legal@simryo.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
} 
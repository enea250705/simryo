import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Smartphone, 
  QrCode, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  Apple,
  Phone
} from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Setup Guide - SIMRYO | How to Install Your eSIM",
  description: "Step-by-step guide to install and activate your SIMRYO eSIM on iPhone, Android, and other compatible devices.",
  keywords: "eSIM setup, installation guide, iPhone eSIM, Android eSIM, activation",
}

const deviceSteps = {
  ios: [
    {
      title: "📱 Check Your iPhone",
      description: "iPhone XS/XR or newer with iOS 12.1+",
      icon: CheckCircle
    },
    {
      title: "📶 Connect to Wi-Fi", 
      description: "Get on a stable Wi-Fi network",
      icon: Settings
    },
    {
      title: "⚙️ Open Settings",
      description: "Settings → Cellular → Add Cellular Plan",
      icon: Phone
    },
    {
      title: "📷 Scan QR Code",
      description: "Point your camera at the QR code we sent you",
      icon: QrCode
    },
    {
      title: "✅ You're Connected!",
      description: "Give your plan a name and you're ready to travel",
      icon: Smartphone
    }
  ],
  android: [
    {
      title: "📱 Check Your Phone",
      description: "Google Pixel 3+, Samsung Galaxy S20+, or other eSIM device",
      icon: CheckCircle
    },
    {
      title: "📶 Connect to Wi-Fi",
      description: "Get on a stable Wi-Fi network",
      icon: Settings
    },
    {
      title: "⚙️ Open Settings",
      description: "Settings → Network & Internet → Mobile Network",
      icon: Phone
    },
    {
      title: "➕ Add Carrier",
      description: "Tap 'Add Carrier' or 'Add Mobile Plan'",
      icon: QrCode
    },
    {
      title: "📷 Scan & Connect",
      description: "Scan the QR code we sent you and you're ready!",
      icon: Smartphone
    }
  ]
}

const troubleshootingTips = [
  {
    issue: "QR Code Won't Scan",
    solution: "Try manual entry using the activation code provided in your email"
  },
  {
    issue: "No Network Connection",
    solution: "Enable data roaming and ensure the eSIM line is selected for cellular data"
  },
  {
    issue: "Installation Failed",
    solution: "Restart your device and try again. Ensure you have a stable internet connection"
  },
  {
    issue: "eSIM Not Showing",
    solution: "Check if your device is carrier-unlocked and eSIM compatible"
  }
]

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            eSIM Setup Guide
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl">
            Follow our step-by-step guide to install and activate your SIMRYO eSIM
          </p>
        </div>

        {/* Prerequisites */}
        <Card className="mb-8 border-accent-200 bg-accent-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-accent-600" />
              <span>Before You Start</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-accent-600" />
                <span>Ensure your device is eSIM compatible and unlocked</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-accent-600" />
                <span>Connect to a stable Wi-Fi network</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-accent-600" />
                <span>Have your SIMRYO QR code email ready</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-accent-600" />
                <span>Ensure your primary SIM (if any) has an active plan</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Device-Specific Instructions */}
        <Tabs defaultValue="ios" className="mb-12">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ios" className="flex items-center space-x-2">
              <Apple className="h-4 w-4" />
              <span>iPhone</span>
            </TabsTrigger>
            <TabsTrigger value="android" className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>Android</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ios" className="mt-6">
            <div className="space-y-6">
              {deviceSteps.ios.map((step, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-primary-950 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center space-x-2">
                          <step.icon className="h-5 w-5 text-accent-500" />
                          <span>{step.title}</span>
                        </h3>
                        <p className="text-gray-600">{step.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="android" className="mt-6">
            <div className="space-y-6">
              {deviceSteps.android.map((step, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-primary-950 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center space-x-2">
                          <step.icon className="h-5 w-5 text-accent-500" />
                          <span>{step.title}</span>
                        </h3>
                        <p className="text-gray-600">{step.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Troubleshooting */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Common Issues & Solutions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {troubleshootingTips.map((tip, index) => (
                <div key={index} className="border-l-4 border-accent-500 pl-4">
                  <h4 className="font-semibold text-foreground">{tip.issue}</h4>
                  <p className="text-gray-600 text-sm mt-1">{tip.solution}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Video Tutorial Placeholder */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Video Tutorial</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Video tutorial coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support CTA */}
        <Card className="bg-gradient-to-r from-primary-950 to-primary-800 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Need More Help?</h2>
            <p className="text-gray-100 mb-6 max-w-2xl mx-auto">
              Our support team is available 24/7 to help you with eSIM installation and activation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/support">
                <Button variant="secondary" size="lg" className="bg-white text-primary-950 hover:bg-gray-100">
                  Contact Support
                </Button>
              </Link>
              <Link href="/faq">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-950 bg-transparent">
                  View FAQs
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
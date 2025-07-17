"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Mail, Download, Home, Copy, ExternalLink } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface OrderItem {
  success: boolean
  orderId: string
  countryName: string
  flag: string
  plan: {
    price: number
    data: string
    days: number
  }
  quantity: number
  qrCodeUrl: string
  activationCode: string
  instructions: string[]
  status: string
}

export default function ConfirmationPage() {
  const [completedOrder, setCompletedOrder] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const orderData = localStorage.getItem('completedOrder')
    if (orderData) {
      try {
        const parsed = JSON.parse(orderData)
        setCompletedOrder(parsed)
      } catch (error) {
        console.error('Failed to parse order data:', error)
        router.push('/plans')
      }
    } else {
      router.push('/plans')
    }
    setIsLoading(false)
  }, [router])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const downloadQRCode = (url: string, filename: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your order...</p>
        </div>
      </div>
    )
  }

  if (!completedOrder) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="text-center">
          <div className="text-6xl mb-6">❌</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">We couldn't find your order details.</p>
          <Link href="/plans">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Browse Plans
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const orderItems: OrderItem[] = completedOrder.data || []
  const customerInfo = completedOrder.customerInfo || {}

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Purchase Successful! 🎉
        </h1>
        <p className="text-gray-600">
          Your eSIM{orderItems.length > 1 ? 's are' : ' is'} ready for activation
        </p>
      </div>

      {/* Email Confirmation */}
      <Card className="mb-8 bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <Mail className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="font-semibold text-blue-900">Email Sent!</h3>
              <p className="text-blue-700">
                We've sent your eSIM details and QR codes to <strong>{customerInfo.email}</strong>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <div className="space-y-6">
        {orderItems.map((item, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{item.flag}</span>
                  <div>
                    <CardTitle className="text-lg">{item.countryName}</CardTitle>
                    <p className="text-sm text-gray-600">
                      {item.plan.data} • {item.plan.days} days • ${item.plan.price}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {item.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* QR Code */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center">
                    📱 QR Code for Activation
                  </h3>
                  <div className="bg-white p-4 rounded-lg border text-center">
                    <img 
                      src={item.qrCodeUrl} 
                      alt={`QR Code for ${item.countryName}`}
                      className="mx-auto mb-4 max-w-[200px] h-auto"
                    />
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadQRCode(item.qrCodeUrl, `${item.countryName}-esim-qr.png`)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download QR Code
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(item.qrCodeUrl, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Full Size
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Activation Code & Instructions */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">🔑 Activation Code</h3>
                    <div className="bg-gray-50 p-3 rounded-lg border">
                      <code className="text-sm font-mono">{item.activationCode}</code>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2 h-6 w-6 p-0"
                        onClick={() => copyToClipboard(item.activationCode)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">📋 Setup Instructions</h3>
                    <ol className="space-y-1 text-sm">
                      {item.instructions.map((instruction, idx) => (
                        <li key={idx} className="flex">
                          <span className="text-blue-600 font-medium mr-2">{idx + 1}.</span>
                          {instruction}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Important Notes */}
      <Card className="mt-8 bg-orange-50 border-orange-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-orange-900 mb-3">⚠️ Important Notes</h3>
          <ul className="space-y-2 text-sm text-orange-800">
            <li>• Keep this information safe - you'll need it to activate your eSIM</li>
            <li>• Your eSIM will activate when you first connect to a network in your destination</li>
            <li>• Make sure your device supports eSIM technology before traveling</li>
            <li>• Contact our support team if you need help: support@simryo.com</li>
            <li>• Check your email for a copy of all this information</li>
          </ul>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
        <Link href="/plans">
          <Button variant="outline" className="w-full sm:w-auto">
            <Home className="h-4 w-4 mr-2" />
            Browse More Plans
          </Button>
        </Link>
        <Button 
          onClick={() => window.print()} 
          variant="outline"
          className="w-full sm:w-auto"
        >
          <Download className="h-4 w-4 mr-2" />
          Print This Page
        </Button>
      </div>
    </div>
  )
}
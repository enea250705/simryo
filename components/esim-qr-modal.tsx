"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, Download, Smartphone, Wifi, Calendar, Globe } from "lucide-react"
import { toast } from "sonner"

interface ESIMQRModalProps {
  isOpen: boolean
  onClose: () => void
  esimData: {
    iccid: string
    qrCodeUrl: string
    activationCode: string
    planName: string
    country: string
    dataAmount: string
    days: number
    price: number
    currency: string
    expiresAt: string
  } | null
}

export function ESIMQRModal({ isOpen, onClose, esimData }: ESIMQRModalProps) {
  const [copied, setCopied] = useState(false)

  if (!esimData) return null

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success(`${label} copied to clipboard!`)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error("Failed to copy to clipboard")
    }
  }

  const downloadQRCode = () => {
    const link = document.createElement('a')
    link.href = esimData.qrCodeUrl
    link.download = `esim-qr-${esimData.iccid}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("QR code downloaded!")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Your eSIM is Ready!
          </DialogTitle>
          <DialogDescription>
            Scan the QR code below to activate your eSIM on your device
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Plan Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Plan Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Plan</p>
                  <p className="font-medium">{esimData.planName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Country</p>
                  <p className="font-medium">{esimData.country}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data</p>
                  <p className="font-medium flex items-center gap-1">
                    <Wifi className="h-3 w-3" />
                    {esimData.dataAmount}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Validity</p>
                  <p className="font-medium flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {esimData.days} days
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* QR Code */}
          <Card>
            <CardHeader>
              <CardTitle>QR Code</CardTitle>
              <CardDescription>
                Scan this QR code with your phone's camera or go to Settings > Cellular > Add Cellular Plan
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="inline-block p-4 bg-white rounded-lg border-2 border-gray-200">
                <img 
                  src={esimData.qrCodeUrl} 
                  alt="eSIM QR Code" 
                  className="w-48 h-48 object-contain"
                />
              </div>
              <div className="mt-4">
                <Button onClick={downloadQRCode} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download QR Code
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Activation Information */}
          <Card>
            <CardHeader>
              <CardTitle>Activation Information</CardTitle>
              <CardDescription>
                Use these details if manual activation is required
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">ICCID</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-2 bg-gray-100 rounded text-sm font-mono">
                    {esimData.iccid}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(esimData.iccid, "ICCID")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">Activation Code</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-2 bg-gray-100 rounded text-sm font-mono">
                    {esimData.activationCode}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(esimData.activationCode, "Activation Code")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activation Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>How to Activate</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Badge variant="secondary" className="mt-0.5">1</Badge>
                  <span>Go to your phone's <strong>Settings</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge variant="secondary" className="mt-0.5">2</Badge>
                  <span>Tap <strong>Cellular</strong> or <strong>Mobile Data</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge variant="secondary" className="mt-0.5">3</Badge>
                  <span>Tap <strong>Add Cellular Plan</strong> or <strong>Add eSIM</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge variant="secondary" className="mt-0.5">4</Badge>
                  <span>Scan the QR code above or enter the activation code manually</span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge variant="secondary" className="mt-0.5">5</Badge>
                  <span>Follow the on-screen instructions</span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge variant="secondary" className="mt-0.5">6</Badge>
                  <span>Your eSIM will be activated and ready to use!</span>
                </li>
              </ol>
            </CardContent>
          </Card>

          {/* Pro Tips */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">💡 Pro Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 text-sm text-blue-700">
                <li>• Keep your original SIM card active for calls and SMS</li>
                <li>• Use the eSIM for data while traveling</li>
                <li>• Monitor your data usage in Settings > Cellular</li>
                <li>• Contact support if you need help with activation</li>
              </ul>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={onClose} className="flex-1">
              Got it!
            </Button>
            <Button variant="outline" onClick={() => window.open('/profile', '_blank')}>
              View in Dashboard
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 
 
 
 
 
 
 
 
 
 
 
 
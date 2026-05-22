"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Mail, Download, Home, Copy, ExternalLink, UserPlus, Clock } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface OrderItem {
  success: boolean
  orderId: string
  countryName: string
  flag: string
  plan: { price: number; data: string; days: number }
  quantity: number
  qrCodeUrl: string
  activationCode: string
  instructions: string[]
  status: string
}

export default function ConfirmationPage() {
  const [completedOrder, setCompletedOrder] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGuest, setIsGuest] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const orderData = localStorage.getItem('completedOrder')
    if (orderData) {
      try { setCompletedOrder(JSON.parse(orderData)) }
      catch { router.push('/plans') }
    } else {
      router.push('/plans')
    }
    setIsGuest(!localStorage.getItem('simryo-user'))
    setIsLoading(false)
  }, [router])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied!')
  }

  const downloadQRCode = (url: string, filename: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="h-6 w-6 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
      </div>
    )
  }

  if (!completedOrder) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <p className="font-semibold text-gray-900 mb-2">Order not found</p>
          <p className="text-sm text-gray-500 mb-6">We couldn't find your order details.</p>
          <Link href="/plans">
            <button className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
              Browse Plans
            </button>
          </Link>
        </div>
      </div>
    )
  }

  const orderItems: OrderItem[] = completedOrder.data || []
  const customerInfo = completedOrder.customerInfo || {}
  const hasPending = orderItems.some(item => item.status === 'pending')
  const signupUrl = `/signup?email=${encodeURIComponent(customerInfo.email || '')}&callbackUrl=${encodeURIComponent('/profile')}`

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">

        {/* Success header */}
        <div className="text-center mb-8">
          <CheckCircle className="h-10 w-10 text-gray-900 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Purchase confirmed</h1>
          <p className="text-gray-500 text-sm">
            {hasPending
              ? "Your eSIM details will arrive by email within 15 minutes."
              : `Your eSIM${orderItems.length > 1 ? 's are' : ' is'} ready for activation.`}
          </p>
        </div>

        {/* Email confirmation */}
        <div className="flex items-start gap-3 border border-gray-200 rounded-xl px-5 py-4 mb-6">
          <Mail className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" />
          <div>
            <div className="text-sm font-semibold text-gray-900">Confirmation email sent</div>
            <div className="text-sm text-gray-500 mt-0.5">
              QR codes and activation details sent to <strong>{customerInfo.email}</strong>
            </div>
          </div>
        </div>

        {/* Create account — guests only */}
        {isGuest && (
          <div className="border border-gray-200 rounded-xl p-5 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-gray-900 mb-1">Create a free account</div>
                <div className="text-sm text-gray-500">Track your eSIM, view order history, and download QR codes anytime.</div>
              </div>
              <Link href={signupUrl} className="shrink-0">
                <button className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap">
                  <UserPlus className="h-4 w-4" />
                  Create account
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* Order items */}
        <div className="space-y-5">
          {orderItems.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">

              {/* Item header */}
              <div className="flex items-center justify-between px-5 py-4 bg-gray-50 border-b border-gray-100">
                <div>
                  <div className="text-sm font-semibold text-gray-900">{item.countryName}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {item.plan.data} · {item.plan.days} days · €{item.plan.price}
                  </div>
                </div>
                <span className={`text-xs font-semibold rounded-full px-2.5 py-1 ${
                  item.status === 'pending'
                    ? 'bg-orange-50 text-orange-600 border border-orange-100'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {item.status === 'pending' ? 'Processing' : 'Active'}
                </span>
              </div>

              {/* Item content */}
              <div className="p-5">
                {item.status === 'pending' ? (
                  <div className="flex flex-col items-center text-center py-4 gap-2">
                    <Clock className="h-6 w-6 text-gray-400" />
                    <p className="text-sm font-semibold text-gray-900">eSIM being processed</p>
                    <p className="text-sm text-gray-500 max-w-sm">
                      QR code and activation details will be sent to <strong>{customerInfo.email}</strong> within 10–15 minutes.
                    </p>
                    <p className="text-xs text-gray-400">Order ID: {item.orderId}</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-6">
                    {/* QR Code */}
                    <div>
                      <div className="text-sm font-semibold text-gray-900 mb-3">QR code</div>
                      <div className="border border-gray-200 rounded-xl p-4 text-center bg-gray-50">
                        {item.qrCodeUrl ? (
                          <>
                            <img src={item.qrCodeUrl} alt={`QR Code for ${item.countryName}`} className="mx-auto mb-3 max-w-[180px]" />
                            <div className="flex flex-col gap-2">
                              <button
                                onClick={() => downloadQRCode(item.qrCodeUrl, `${item.countryName}-esim-qr.png`)}
                                className="inline-flex items-center justify-center gap-1.5 border border-gray-200 hover:border-gray-300 bg-white text-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                              >
                                <Download className="h-3 w-3" />
                                Download
                              </button>
                              <button
                                onClick={() => window.open(item.qrCodeUrl, '_blank')}
                                className="inline-flex items-center justify-center gap-1.5 border border-gray-200 hover:border-gray-300 bg-white text-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                              >
                                <ExternalLink className="h-3 w-3" />
                                View full size
                              </button>
                            </div>
                          </>
                        ) : (
                          <p className="text-sm text-gray-400 py-8">QR code sent to your email</p>
                        )}
                      </div>
                    </div>

                    {/* Activation + instructions */}
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm font-semibold text-gray-900 mb-2">Activation code</div>
                        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                          <code className="text-xs font-mono flex-1 break-all text-gray-700">{item.activationCode || '—'}</code>
                          {item.activationCode && (
                            <button onClick={() => copyToClipboard(item.activationCode)} className="shrink-0 text-gray-400 hover:text-gray-700 transition-colors">
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-semibold text-gray-900 mb-2">Setup instructions</div>
                        <ol className="space-y-1.5">
                          {item.instructions.map((instruction, idx) => (
                            <li key={idx} className="flex gap-2 text-sm text-gray-600">
                              <span className="text-gray-400 shrink-0">{idx + 1}.</span>
                              {instruction}
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Notes */}
        <div className="mt-8 border border-gray-200 rounded-xl p-5 bg-gray-50 text-sm text-gray-500 space-y-1">
          <div className="font-semibold text-gray-700 mb-2">Important</div>
          <p>· Keep your activation code safe — you'll need it to activate your eSIM.</p>
          <p>· Your eSIM activates when you first connect at your destination.</p>
          <p>· Make sure your device supports eSIM before traveling.</p>
          <p>· Contact support if you need help: <a href="mailto:info@simryo.com" className="underline hover:text-gray-900">info@simryo.com</a></p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
          <Link href="/plans">
            <button className="inline-flex items-center justify-center gap-2 border border-gray-200 hover:border-gray-300 bg-white text-gray-700 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors w-full sm:w-auto">
              <Home className="h-4 w-4" />
              Browse more plans
            </button>
          </Link>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center justify-center gap-2 border border-gray-200 hover:border-gray-300 bg-white text-gray-700 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            <Download className="h-4 w-4" />
            Print this page
          </button>
          {isGuest && (
            <Link href={signupUrl}>
              <button className="inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors w-full sm:w-auto">
                <UserPlus className="h-4 w-4" />
                Create account
              </button>
            </Link>
          )}
        </div>

      </div>
    </div>
  )
}

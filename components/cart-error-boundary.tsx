"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { RefreshCw, Home, ShoppingCart } from 'lucide-react'
import Link from 'next/link'

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class CartErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Cart Error Boundary caught an error:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  handleClearCart = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cart')
      }
    } catch (e) {
      console.error('Failed to clear cart:', e)
    }
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 pt-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
            <Card className="text-center p-8">
              <CardContent>
                <div className="text-6xl mb-6">🛒</div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  Something went wrong
                </h1>
                <p className="text-gray-600 mb-6">
                  We're sorry, but something unexpected happened while loading your cart. 
                  This might be due to corrupted cart data.
                </p>
                
                <div className="space-y-3">
                  <Button 
                    onClick={this.handleRetry}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                  
                  <Button 
                    onClick={this.handleClearCart}
                    variant="outline"
                    className="w-full"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Clear Cart & Start Over
                  </Button>
                  
                  <Link href="/" className="block">
                    <Button variant="ghost" className="w-full">
                      <Home className="h-4 w-4 mr-2" />
                      Go to Homepage
                    </Button>
                  </Link>
                </div>
                
                <p className="text-sm text-gray-500 mt-6">
                  If this problem persists, please contact support
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }

    return this.props.children
  }
} 
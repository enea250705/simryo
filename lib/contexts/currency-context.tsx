"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Currency = 'USD' | 'EUR'

interface CurrencyContextType {
  currency: Currency
  setCurrency: (currency: Currency) => void
  formatPrice: (price: number, currency?: Currency) => string
  convertPrice: (price: number, fromCurrency: Currency, toCurrency: Currency) => number
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

// Exchange rate - in a real app, this would come from an API
const EUR_TO_USD_RATE = 1.09 // 1 EUR = 1.09 USD (approximate)
const USD_TO_EUR_RATE = 0.92 // 1 USD = 0.92 EUR (approximate)

interface CurrencyProviderProps {
  children: ReactNode
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [currency, setCurrencyState] = useState<Currency>('USD')

  // Load currency preference from localStorage on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem('preferred-currency') as Currency
    if (savedCurrency && (savedCurrency === 'USD' || savedCurrency === 'EUR')) {
      setCurrencyState(savedCurrency)
    }
  }, [])

  // Save currency preference to localStorage when it changes
  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency)
    localStorage.setItem('preferred-currency', newCurrency)
  }

  // Convert price between currencies
  const convertPrice = (price: number, fromCurrency: Currency, toCurrency: Currency): number => {
    if (fromCurrency === toCurrency) return price
    
    if (fromCurrency === 'EUR' && toCurrency === 'USD') {
      return price * EUR_TO_USD_RATE
    } else if (fromCurrency === 'USD' && toCurrency === 'EUR') {
      return price * USD_TO_EUR_RATE
    }
    
    return price
  }

  // Format price with proper currency symbol and formatting
  const formatPrice = (price: number, displayCurrency?: Currency): string => {
    const targetCurrency = displayCurrency || currency
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: targetCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price)
  }

  const value: CurrencyContextType = {
    currency,
    setCurrency,
    formatPrice,
    convertPrice
  }

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}
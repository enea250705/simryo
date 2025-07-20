"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, DollarSign, Euro } from 'lucide-react'
import { useCurrency, type Currency } from '@/lib/contexts/currency-context'

interface CurrencyOption {
  code: Currency
  name: string
  symbol: string
  flag: string
  icon: React.ComponentType<any>
}

const currencyOptions: CurrencyOption[] = [
  {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    flag: '🇺🇸',
    icon: DollarSign
  },
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    flag: '🇪🇺',
    icon: Euro
  }
]

interface CurrencySelectorProps {
  variant?: 'default' | 'compact' | 'minimal'
  className?: string
}

export function CurrencySelector({ variant = 'default', className = '' }: CurrencySelectorProps) {
  const { currency, setCurrency } = useCurrency()
  const [isOpen, setIsOpen] = useState(false)

  const currentCurrency = currencyOptions.find(option => option.code === currency)
  const Icon = currentCurrency?.icon || DollarSign

  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency)
    setIsOpen(false)
  }

  if (variant === 'minimal') {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className={`h-8 px-2 ${className}`}>
            <span className="text-sm font-medium">{currentCurrency?.symbol}</span>
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {currencyOptions.map((option) => {
            const OptionIcon = option.icon
            return (
              <DropdownMenuItem
                key={option.code}
                onClick={() => handleCurrencyChange(option.code)}
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{option.flag}</span>
                  <OptionIcon className="h-4 w-4" />
                  <span className="font-medium">{option.code}</span>
                </div>
                {currency === option.code && (
                  <Badge variant="secondary" className="text-xs">Active</Badge>
                )}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  if (variant === 'compact') {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className={`h-9 ${className}`}>
            <span className="text-lg mr-2">{currentCurrency?.flag}</span>
            <Icon className="h-4 w-4 mr-1" />
            <span className="font-medium">{currency}</span>
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {currencyOptions.map((option) => {
            const OptionIcon = option.icon
            return (
              <DropdownMenuItem
                key={option.code}
                onClick={() => handleCurrencyChange(option.code)}
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{option.flag}</span>
                  <OptionIcon className="h-4 w-4" />
                  <div>
                    <div className="font-medium">{option.code}</div>
                    <div className="text-xs text-gray-500">{option.name}</div>
                  </div>
                </div>
                {currency === option.code && (
                  <Badge variant="secondary" className="text-xs">Active</Badge>
                )}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={`h-10 ${className}`}>
          <span className="text-lg mr-2">{currentCurrency?.flag}</span>
          <Icon className="h-4 w-4 mr-2" />
          <span className="font-medium">{currency}</span>
          <span className="text-sm text-gray-500 ml-1">({currentCurrency?.symbol})</span>
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="px-2 py-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide">
          Select Currency
        </div>
        {currencyOptions.map((option) => {
          const OptionIcon = option.icon
          return (
            <DropdownMenuItem
              key={option.code}
              onClick={() => handleCurrencyChange(option.code)}
              className="flex items-center justify-between cursor-pointer py-3"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{option.flag}</span>
                <OptionIcon className="h-5 w-5" />
                <div>
                  <div className="font-medium">{option.name}</div>
                  <div className="text-sm text-gray-500">{option.code} ({option.symbol})</div>
                </div>
              </div>
              {currency === option.code && (
                <Badge variant="default" className="text-xs">Current</Badge>
              )}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
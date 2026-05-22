"use client"

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { useCurrency, type Currency } from '@/lib/contexts/currency-context'

interface CurrencyOption {
  code: Currency
  name: string
  symbol: string
  flagCode: string
}

const currencyOptions: CurrencyOption[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flagCode: 'us' },
  { code: 'EUR', name: 'Euro',      symbol: '€', flagCode: 'eu' },
]

interface CurrencySelectorProps {
  variant?: 'default' | 'compact' | 'minimal'
  className?: string
}

function FlagImg({ code, alt }: { code: string; alt: string }) {
  return (
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      alt={alt}
      className="w-5 h-[14px] rounded-sm object-cover border border-gray-200/60"
    />
  )
}

export function CurrencySelector({ variant = 'default', className = '' }: CurrencySelectorProps) {
  const { currency, setCurrency } = useCurrency()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const current = currencyOptions.find(o => o.code === currency) ?? currencyOptions[0]

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const trigger = (
    <button
      onClick={() => setOpen(v => !v)}
      className={`inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors ${className}`}
    >
      <FlagImg code={current.flagCode} alt={current.name} />
      <span>{current.code}</span>
      <span className="text-gray-400">{current.symbol}</span>
      <ChevronDown className={`h-3.5 w-3.5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
    </button>
  )

  const dropdown = open && (
    <div className="absolute z-50 mt-1.5 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-1 overflow-hidden">
      {currencyOptions.map(opt => (
        <button
          key={opt.code}
          onClick={() => { setCurrency(opt.code); setOpen(false) }}
          className="w-full flex items-center justify-between gap-3 px-3 py-2.5 text-sm hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <FlagImg code={opt.flagCode} alt={opt.name} />
            <span className="font-medium text-gray-800">{opt.code}</span>
            <span className="text-gray-400 text-xs">{opt.name}</span>
          </div>
          {currency === opt.code && <Check className="h-3.5 w-3.5 text-blue-500 shrink-0" />}
        </button>
      ))}
    </div>
  )

  return (
    <div ref={ref} className="relative inline-block">
      {trigger}
      {dropdown}
    </div>
  )
}

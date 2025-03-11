"use client"

import { useEffect, useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useCurrency } from "@/store/use-currency"

// Common currencies with their codes and symbols
const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CAD", symbol: "$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "$", name: "Australian Dollar" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
]

interface CurrencySelectorProps {
  className?: string
}

export function CurrencySelector({ className = "" }: CurrencySelectorProps) {
  const [open, setOpen] = useState(false)
  const { currency: user_currency, setCurrency, initializeCurrency } = useCurrency()

  useEffect(() => {
    initializeCurrency();
  }, [initializeCurrency]);
  
  const selectedCurrencyData = currencies.find((c) => c.code === user_currency)

  const onCurrencyChange = (currency: string) => {
      if(!currency) return
      setCurrency(currency)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-[120px] justify-between ${className}`}
        >
          <span>
            {selectedCurrencyData?.symbol} {selectedCurrencyData?.code}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]">
        {currencies.map((currency) => (
          <DropdownMenuItem
            key={currency.code}
            onClick={() => {
              onCurrencyChange(currency.code)
              setOpen(false)
            }}
            className="flex items-center justify-between"
          >
            <span>
              {currency.symbol} {currency.code}
            </span>
            <span className="text-muted-foreground text-xs">{currency.name}</span>
            {user_currency === currency.code && <Check className="ml-auto h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


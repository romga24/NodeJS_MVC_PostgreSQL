"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Minus, Plus } from "lucide-react"
import { useTranslations } from "next-intl"

interface PassengerInputProps {
  value: number
  onChange: (value: number) => void
}

export function PassengerInput({ value, onChange }: PassengerInputProps) {
  const t = useTranslations()

  const increment = () => {
    onChange(Math.min(9, value + 1))
  }

  const decrement = () => {
    onChange(Math.max(1, value - 1))
  }

  return (
    <div className="flex flex-col space-y-1.5">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {t("passengers.passengers")}
      </label>
      <div className="flex items-center">
        <Button type="button" variant="outline" size="icon" onClick={decrement} disabled={value <= 1}>
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          value={value}
          onChange={(e) => {
            const val = Number.parseInt(e.target.value)
            if (!isNaN(val) && val >= 1 && val <= 9) {
              onChange(val)
            }
          }}
          min={1}
          max={9}
          className="w-16 mx-2 text-center"
        />
        <Button type="button" variant="outline" size="icon" onClick={increment} disabled={value >= 9}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

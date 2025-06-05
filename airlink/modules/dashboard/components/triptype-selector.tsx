"use client"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ArrowLeftRight, ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"

interface TriptypeSelectorProps {
  value: "roundTrip" | "oneWay"
  onChange: (value: "roundTrip" | "oneWay") => void
}

export function TriptypeSelector({ value, onChange }: TriptypeSelectorProps) {
  const t = useTranslations()

  return (
    <div className="flex flex-col space-y-1.5">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {t("tripType")}
      </label>
      <ToggleGroup type="single" value={value} onValueChange={(v) => v && onChange(v as "roundTrip" | "oneWay")}>
        <ToggleGroupItem value="roundTrip" aria-label={t("roundTrip")}>
          {t("roundTrip")} <ArrowLeftRight className="ml-2 h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="oneWay" aria-label={t("oneWay")}>
          {t("oneWay")} <ArrowRight className="ml-2 h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}

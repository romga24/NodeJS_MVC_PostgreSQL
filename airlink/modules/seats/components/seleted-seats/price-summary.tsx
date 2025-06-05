"use client"

import { useTranslations } from "next-intl"

interface PriceSummaryProps {
  basePrice: number
  seatsPrice: number
  totalPrice: number
  passengers: number
}

export function PriceSummary({ basePrice, seatsPrice, totalPrice, passengers }: PriceSummaryProps) {
  const t = useTranslations()
  const tSeats = useTranslations("seats")

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>
          {t("common.basePrice")} ({passengers} {passengers === 1 ? t("flights.passenger") : t("flights.passengers")})
        </span>
        <span>{basePrice.toFixed(2)} €</span>
      </div>
      <div className="flex justify-between text-sm">
        <span>{tSeats("seatSelection")}</span>
        <span>{seatsPrice.toFixed(2)} €</span>
      </div>
      <div className="flex justify-between font-bold">
        <span>{t("common.total")}</span>
        <span>{totalPrice.toFixed(2)} €</span>
      </div>
    </div>
  )
}

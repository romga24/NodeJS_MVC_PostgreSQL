"use client"

import { useTranslations } from "next-intl"

export function SeatLegend() {
  const t = useTranslations("seats.seatLegend")

  return (
    <div className="flex flex-wrap gap-2">
      <div className="flex items-center">
        <div className="w-6 h-6 bg-gray-100 rounded mr-2"></div>
        <span className="text-sm">{t("available")}</span>
      </div>
      <div className="flex items-center">
        <div className="w-6 h-6 bg-blue-100 rounded mr-2"></div>
        <span className="text-sm">{t("business")}</span>
      </div>
      <div className="flex items-center">
        <div className="w-6 h-6 bg-green-500 rounded mr-2"></div>
        <span className="text-sm">{t("selected")}</span>
      </div>
      <div className="flex items-center">
        <div className="w-6 h-6 bg-gray-300 rounded mr-2"></div>
        <span className="text-sm">{t("occupied")}</span>
      </div>
    </div>
  )
}

"use client"

import { useTranslations } from "next-intl"

export function EmptySeatMessage() {
  const t = useTranslations("seats")

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <p className="text-lg font-medium mb-2">{t("emptySeatMessage.title")}</p>
      <p className="text-sm text-gray-500">{t("emptySeatMessage.description")}</p>
    </div>
  )
}

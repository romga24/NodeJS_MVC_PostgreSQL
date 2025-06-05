"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useTranslations } from "next-intl"

export function InfoAlert() {
  const t = useTranslations()
  const tSeats = useTranslations("seats")

  return (
    <Alert className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{t("common.info")}</AlertTitle>
      <AlertDescription>{tSeats("seatSelectionInfo")}</AlertDescription>
    </Alert>
  )
}

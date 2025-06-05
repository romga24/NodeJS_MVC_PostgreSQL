"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { useTranslations } from "next-intl"

interface NoSeatsMessageProps {
  onSkip: () => void
}

export function NoSeatsMessage({ onSkip }: NoSeatsMessageProps) {
  const t = useTranslations()
  const tSeats = useTranslations("seats")

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{tSeats("seatSelection")}</h1>

      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{tSeats("noSeatsAvailable")}</AlertTitle>
        <AlertDescription>{tSeats("noSeatsAvailableMessage")}</AlertDescription>
      </Alert>

      <div className="flex justify-center">
        <Button onClick={onSkip}>{tSeats("skipSeatSelection")}</Button>
      </div>
    </div>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"

interface ActionButtonsProps {
  onContinue: () => void
  onSkip: () => void
  isDisabled: boolean
}

export function ActionButtons({ onContinue, onSkip, isDisabled }: ActionButtonsProps) {
  const t = useTranslations()
  const tSeats = useTranslations("seats")

  return (
    <div className="space-y-2 pt-4">
      <Button className="w-full" onClick={onContinue} disabled={isDisabled}>
        {t("common.continue")}
      </Button>
      <Button variant="outline" className="w-full" onClick={onSkip}>
        {tSeats("skipSeatSelection")}
      </Button>
    </div>
  )
}

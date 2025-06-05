"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useTranslations } from "next-intl"
import type { Seat } from "../../types/seat-types"

interface SeatProps {
  seat: Seat | null
  isSelected: boolean
  onSelect: (seat: Seat) => void
}

export function SeatComponent({ seat, isSelected, onSelect }: SeatProps) {
  const t = useTranslations("seats")

  if (!seat) {
    return (
      <div className="w-12 h-12 rounded-md bg-gray-50 flex items-center justify-center text-gray-300 text-xs">-</div>
    )
  }

  // Función para determinar si un asiento está ocupado
  const isOccupied = (seat: Seat) => {
    return seat.estado === "ocupado" || seat.estado === "reservado"
  }

  const getSeatColor = () => {
    if (isOccupied(seat)) {
      return "bg-gray-300 text-gray-500 cursor-not-allowed"
    }

    if (isSelected) {
      return "bg-green-500 text-white hover:bg-green-600"
    }

    if (seat.clase.toLowerCase() === "business") {
      return "bg-blue-100 text-blue-800 hover:bg-blue-200"
    }

    return "bg-gray-100 hover:bg-gray-200"
  }

  const formatPrice = (price: number | undefined) => {
    if (price === undefined || price === null) {
      return "0.00"
    }
    return price.toFixed(2)
  }

  const getSeatStatusText = (seat: Seat) => {
    if (seat.estado === "ocupado" || seat.estado === "reservado") {
      return t("occupied")
    }
    return isSelected ? t("selected") : t("available")
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={`w-12 h-12 p-0 ${getSeatColor()}`}
            disabled={isOccupied(seat)}
            onClick={() => onSelect(seat)}
          >
            {seat.codigo_asiento}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <p>
              {t("seatTooltip.seat")}: {seat.codigo_asiento}
            </p>
            <p>
              {t("seatTooltip.class")}: {seat.clase}
            </p>
            <p>
              {t("seatTooltip.price")}: {formatPrice(seat.precio)} €
            </p>
            <p>
              {t("seatTooltip.status")}: {getSeatStatusText(seat)}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

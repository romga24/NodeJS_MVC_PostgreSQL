"use client"

import { useTranslations } from "next-intl"
import type { Seat } from "@/modules/seats/types/seat-types"

interface SelectedSeatsListProps {
  selectedOutboundSeats: Seat[]
  selectedReturnSeats: Seat[]
}

export function SelectedSeatsList({
  selectedOutboundSeats,
  selectedReturnSeats,
}: SelectedSeatsListProps) {
  const t = useTranslations()

  const getSeatClassDisplay = (seatClass: string) => {
    const normalizedClass = seatClass.toLowerCase()
    if (normalizedClass === "business") {
      return "Business"
    } else if (normalizedClass === "economy" || normalizedClass === "economica") {
      return "Economy"
    }
    return seatClass
  }

  if (selectedOutboundSeats.length === 0 && selectedReturnSeats.length === 0) {
    return null
  }

  return (
    <div className="mt-2 p-2 bg-gray-50 rounded-md">
      <p className="text-sm font-medium mb-2">{t("booking.selectedSeats")}:</p>

      {selectedOutboundSeats.length > 0 && (
        <div className="mb-2">
          <p className="text-xs font-semibold mb-1">{t("flights.outboundFlight")}</p>
          <div className="flex flex-wrap gap-1">
            {selectedOutboundSeats.map((seat) => (
              <div
                key={seat.id_asiento}
                className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded"
              >
                {seat.codigo_asiento} ({getSeatClassDisplay(seat.clase)}) - {seat.precio.toFixed(2)} €
              </div>
            ))}
          </div>
        </div>
      )}
      {selectedReturnSeats.length > 0 && (
        <div>
          <p className="text-xs font-semibold mb-1">{t("flights.returnFlight")}</p>
          <div className="flex flex-wrap gap-1">
            {selectedReturnSeats.map((seat) => (
              <div
                key={seat.id_asiento}
                className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded"
              >
                {seat.codigo_asiento} ({getSeatClassDisplay(seat.clase)}) - {seat.precio.toFixed(2)} €
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

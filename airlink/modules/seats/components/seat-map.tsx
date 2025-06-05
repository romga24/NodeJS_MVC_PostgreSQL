"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { useTranslations } from "next-intl"
import type { Seat } from "../types/seat-types"
import { SeatLegend } from "./seat-map/seat-legend"
import { SeatMapHeader } from "./seat-map/seat-map-header"
import { SeatRow } from "./seat-map/seat-row"
import { EmptySeatMessage } from "./seat-map/empty-seat-message"

interface SeatMapProps {
  seats: Seat[]
  selectedSeats: Seat[]
  onSeatSelect: (seat: Seat) => void
  maxSelections: number
}

export function SeatMap({ seats, selectedSeats, onSeatSelect, maxSelections }: SeatMapProps) {
  const t = useTranslations("seats")
  const [hoveredSeat, setHoveredSeat] = useState<Seat | null>(null)

  const seatsArray = Array.isArray(seats) ? seats : []

  if (seatsArray.length === 0) {
    return <EmptySeatMessage />
  }

  const seatsByRow: Record<number, Record<string, Seat>> = {}

  seatsArray.forEach((seat) => {
    if (!seatsByRow[seat.fila]) {
      seatsByRow[seat.fila] = {}
    }
    seatsByRow[seat.fila][seat.columna] = seat
  })

  const rows = Object.keys(seatsByRow)
    .map(Number)
    .sort((a, b) => a - b)

  const leftColumns = ["A", "B", "C"]
  const rightColumns = ["D", "E", "F"]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <SeatLegend />
        <Badge variant="outline">
          {selectedSeats.length}/{maxSelections} {t("selected")}
        </Badge>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-max">
          <SeatMapHeader leftColumns={leftColumns} rightColumns={rightColumns} />

          {rows.map((row) => (
            <SeatRow
              key={`row-${row}`}
              row={row}
              leftColumns={leftColumns}
              rightColumns={rightColumns}
              seatsByRow={seatsByRow[row]}
              selectedSeats={selectedSeats}
              onSeatSelect={onSeatSelect}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

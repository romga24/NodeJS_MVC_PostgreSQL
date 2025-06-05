"use client"

import type { Seat } from "../../types/seat-types"
import { SeatComponent } from "./seat"

interface SeatRowProps {
  row: number
  leftColumns: string[]
  rightColumns: string[]
  seatsByRow: Record<string, Seat>
  selectedSeats: Seat[]
  onSeatSelect: (seat: Seat) => void
}

export function SeatRow({ row, leftColumns, rightColumns, seatsByRow, selectedSeats, onSeatSelect }: SeatRowProps) {
  const isSeatSelected = (seat: Seat) => {
    return selectedSeats.some((s) => s.id_asiento === seat.id_asiento)
  }

  return (
    <div className="flex items-center justify-center mb-3">
      <div className="w-10 text-center font-medium">{row}</div>
      <div className="flex space-x-2 mr-8">
        {leftColumns.map((column) => (
          <div key={`seat-${row}-${column}`}>
            <SeatComponent
              seat={seatsByRow[column]}
              isSelected={seatsByRow[column] ? isSeatSelected(seatsByRow[column]) : false}
              onSelect={onSeatSelect}
            />
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        {rightColumns.map((column) => (
          <div key={`seat-${row}-${column}`}>
            <SeatComponent
              seat={seatsByRow[column]}
              isSelected={seatsByRow[column] ? isSeatSelected(seatsByRow[column]) : false}
              onSelect={onSeatSelect}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

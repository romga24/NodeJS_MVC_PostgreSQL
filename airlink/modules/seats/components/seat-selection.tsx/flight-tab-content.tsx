"use client"

import type { Flight } from "@/modules/flights/types/flights-types"
import type { Seat } from "../../types/seat-types"
import { SeatMap } from "../seat-map"
import { FlightHeader } from "./flight-header"

interface FlightTabContentProps {
  flight: Flight
  seats: Seat[]
  selectedSeats: Seat[]
  onSeatSelect: (seat: Seat) => void
  maxSelections: number
}

export function FlightTabContent({ flight, seats, selectedSeats, onSeatSelect, maxSelections }: FlightTabContentProps) {
  return (
    <>
      <FlightHeader flight={flight} />
      <SeatMap seats={seats} selectedSeats={selectedSeats} onSeatSelect={onSeatSelect} maxSelections={maxSelections} />
    </>
  )
}

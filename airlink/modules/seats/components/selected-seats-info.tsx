"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useTranslations } from "next-intl"
import type { Flight } from "@/modules/flights/types/flights-types"
import type { Seat } from "../types/seat-types"
import { ActionButtons } from "./seleted-seats/action-buttons"
import { FlightInfo } from "./seleted-seats/flight-info"
import { PriceSummary } from "./seleted-seats/price-summary"
import { SelectedSeatsList } from "./seleted-seats/selected-seats-list"

interface SelectedSeatsInfoProps {
  outboundFlight: Flight
  returnFlight: Flight | null
  selectedOutboundSeats: Seat[]
  selectedReturnSeats: Seat[]
  passengers: number
  onContinue: () => void
  onSkip: () => void
  tripType: "roundTrip" | "oneWay"
}

export function SelectedSeatsInfo({
  outboundFlight,
  returnFlight,
  selectedOutboundSeats,
  selectedReturnSeats,
  passengers,
  onContinue,
  onSkip,
  tripType,
}: SelectedSeatsInfoProps) {
  const t = useTranslations("seats")

  const [totalPrice, setTotalPrice] = useState<number>(0)
  const [basePrice, setBasePrice] = useState<number>(0)
  const [seatsPrice, setSeatsPrice] = useState<number>(0)


  useEffect(() => {
    const outboundBasePrice = outboundFlight.precio_vuelo * passengers
    const returnBasePrice = returnFlight ? returnFlight.precio_vuelo * passengers : 0
    const totalBasePrice = outboundBasePrice + returnBasePrice

    const outboundSeatsPrice = selectedOutboundSeats.reduce((sum, seat) => sum + seat.precio, 0)
    const returnSeatsPrice = selectedReturnSeats.reduce((sum, seat) => sum + seat.precio, 0)
    const totalSeatsPrice = outboundSeatsPrice + returnSeatsPrice

    setBasePrice(totalBasePrice)
    setSeatsPrice(totalSeatsPrice)
    setTotalPrice(totalBasePrice + totalSeatsPrice)
  }, [outboundFlight, returnFlight, selectedOutboundSeats, selectedReturnSeats, passengers])

  const isDisabled =
    selectedOutboundSeats.length < passengers ||
    (returnFlight && tripType === "roundTrip" ? selectedReturnSeats.length < passengers : false)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("selectionSummary")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <FlightInfo flight={outboundFlight} />
          <SelectedSeatsList selectedOutboundSeats={selectedOutboundSeats} selectedReturnSeats={selectedReturnSeats} />
          <Separator />

          <PriceSummary basePrice={basePrice} seatsPrice={seatsPrice} totalPrice={totalPrice} passengers={passengers} />

          <ActionButtons onContinue={onContinue} onSkip={onSkip} isDisabled={isDisabled} />
        </div>
      </CardContent>
    </Card>
  )
}

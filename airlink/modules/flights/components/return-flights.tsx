"use client"

import { useState, useEffect } from "react"
import { FlightCard } from "./flight-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plane } from "lucide-react"
import { useTranslations } from "next-intl"
import type { Flight } from "../types/flights-types"

interface ReturnFlightsProps {
  flights: Flight[]
  className?: string
}

export function ReturnFlights({ flights, className = "" }: ReturnFlightsProps) {
  const [selectedFlightId, setSelectedFlightId] = useState<string | null>(null)
  const t = useTranslations()

  useEffect(() => {
    const storedFlight = sessionStorage.getItem("selectedReturnFlight")
    if (storedFlight) {
      try {
        const flight = JSON.parse(storedFlight)
        setSelectedFlightId(flight.numero_vuelo)
      } catch (error) {
        console.error(t("flights.errorParsingStoredFlight"), error)
      }
    }
  }, [t])

  const handleSelectFlight = (flightId: string) => {
    if (selectedFlightId === flightId) return

    setSelectedFlightId(flightId)

    const selectedFlight = flights.find((flight) => flight.numero_vuelo === flightId)
    if (selectedFlight) {
      console.log(t("flights.savingSelectedReturnFlight"), selectedFlight)
      sessionStorage.setItem("selectedReturnFlight", JSON.stringify(selectedFlight))

      const event = new Event("returnFlightSelected")
      window.dispatchEvent(event)
    }
  }

  if (!flights || flights.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plane className="mr-2 h-5 w-5 rotate-180" />
            {t("flights.returnFlights")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-8">{t("flights.noFlightsAvailable")}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Plane className="mr-2 h-5 w-5 rotate-180" />
          {t("flights.returnFlights")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {flights.map((flight) => (
            <FlightCard
              key={flight.numero_vuelo}
              flight={flight}
              onSelect={() => handleSelectFlight(flight.numero_vuelo)}
              isSelected={selectedFlightId === flight.numero_vuelo}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

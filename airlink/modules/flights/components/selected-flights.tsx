"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format, parseISO } from "date-fns"
import { Clock, Plane } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useTranslations } from "next-intl"
import { FlightLeg } from "../types/flights-types"

interface SelectedFlightsSummaryProps {
  outboundFlight: FlightLeg | null
  returnFlight: FlightLeg | null
  flightType: "economy" | "business"
}

export function SelectedFlightsSummary({ outboundFlight, returnFlight, flightType }: SelectedFlightsSummaryProps) {
  const t = useTranslations()

  if (!outboundFlight) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("search.selectedFlights")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">{t("search.outboundFlight")}</h3>
          <FlightSummaryCard flight={outboundFlight} flightType={flightType} />
        </div>

        {returnFlight && (
          <div>
            <h3 className="text-lg font-semibold mb-3">{t("search.returnFlight")}</h3>
            <FlightSummaryCard flight={returnFlight} flightType={flightType} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface FlightSummaryCardProps {
  flight: FlightLeg
  flightType: "economy" | "business"
}

function FlightSummaryCard({ flight, flightType }: FlightSummaryCardProps) {
  const t = useTranslations()
  const departureTime = parseISO(flight.departureTime)
  const arrivalTime = parseISO(flight.arrivalTime)

  const durationMs = arrivalTime.getTime() - departureTime.getTime()
  const durationHours = Math.floor(durationMs / (1000 * 60 * 60))
  const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Plane className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">{flight.numero_vuelo}</p>
                <p className="text-sm text-muted-foreground">
                  {flight.from} → {flight.to}
                </p>
              </div>
            </div>
            <div>
              <Badge variant="outline">{flightType === "business" ? t("search.business") : t("search.economy")}</Badge>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">{format(departureTime, "HH:mm")}</p>
              <p className="text-sm text-muted-foreground">{format(parseISO(flight.departureDate), "dd MMM yyyy")}</p>
              <p className="text-sm font-medium mt-1">{flight.from}</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative w-20 md:w-32">
                <div className="border-t border-dashed border-muted-foreground w-full absolute top-1/2" />
                <div className="flex justify-between absolute w-full">
                  <div className="h-2 w-2 rounded-full bg-primary -mt-1" />
                  <div className="h-2 w-2 rounded-full bg-primary -mt-1" />
                </div>
              </div>
              <div className="flex items-center mt-1 gap-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {durationHours}h {durationMinutes}m
                </span>
              </div>
            </div>

            <div>
              <p className="font-semibold">{format(arrivalTime, "HH:mm")}</p>
              <p className="text-sm text-muted-foreground">{format(parseISO(flight.arrivalDate), "dd MMM yyyy")}</p>
              <p className="text-sm font-medium mt-1">{flight.to}</p>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 border-t">
            <p className="text-sm text-muted-foreground">{t("search.flightPrice")}</p>
            <p className="font-bold">${flight.price[flightType]}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


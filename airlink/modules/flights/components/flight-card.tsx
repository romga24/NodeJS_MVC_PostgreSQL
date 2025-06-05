"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Plane, Clock, Info } from "lucide-react"
import { FlightDetailsDialog } from "./flight-details-dialog"
import { useTranslations } from "next-intl"
import type { Flight } from "../types/flights-types"

interface FlightCardProps {
  flight: Flight
  onSelect: () => void
  isSelected?: boolean
}

export function FlightCard({ flight, onSelect, isSelected = false }: FlightCardProps) {
  const [showDetails, setShowDetails] = useState(false)
  const t = useTranslations()

  const departureTime = parseISO(flight.fecha_salida)
  const arrivalTime = parseISO(flight.fecha_llegada)
  const durationMs = arrivalTime.getTime() - departureTime.getTime()
  const durationHours = Math.floor(durationMs / (1000 * 60 * 60))
  const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))

  const handleSelect = () => {
    onSelect()
  }

  return (
    <Card className={`mb-4 transition-all ${isSelected ? "border-primary border-2" : ""}`}>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                <span className="font-bold text-sm">{flight.aerolinea.codigo_iata}</span>
              </div>
              <div>
                <p className="font-semibold">{flight.aerolinea.nombre}</p>
                <p className="text-sm text-gray-500">
                  {t("flights.flight")} {flight.numero_vuelo}
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center mt-4">
              <div className="text-center">
                <p className="font-bold text-lg">{format(parseISO(flight.fecha_salida), "HH:mm")}</p>
                <p className="text-sm">{flight.aeropuerto_origen.codigo_iata}</p>
              </div>

              <div className="mx-4 my-2 md:my-0 flex flex-col items-center">
                <div className="text-xs text-gray-500">
                  {durationHours}h {durationMinutes}m
                </div>
                <div className="relative w-20 md:w-32">
                  <div className="border-t border-gray-300 absolute w-full top-1/2"></div>
                  <div className="absolute -right-1 top-1/2 transform -translate-y-1/2">
                    <Plane className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <div className="text-xs text-gray-500">{t("flights.direct")}</div>
              </div>

              <div className="text-center">
                <p className="font-bold text-lg">{format(parseISO(flight.fecha_llegada), "HH:mm")}</p>
                <p className="text-sm">{flight.aeropuerto_destino.codigo_iata}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 md:mt-0 w-full md:w-auto flex flex-col items-end">
            <p className="text-2xl font-bold text-right">{flight.precio_vuelo.toFixed(2)} €</p>
            <p className="text-sm text-gray-500 mb-2">{t("flights.perPassenger")}</p>
            <div className="flex gap-2 w-full md:w-auto">
              <Button variant="outline" size="sm" onClick={() => setShowDetails(true)}>
                <Info className="h-4 w-4 mr-1" /> {t("flights.details")}
              </Button>
              <Button onClick={handleSelect} variant={isSelected ? "default" : "outline"} className="w-full md:w-auto">
                {isSelected ? t("flights.selected") : t("flights.select")}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-1" />
            <span>
              {t("flights.departure")}: {format(parseISO(flight.fecha_salida), "EEEE, d MMMM yyyy", { locale: es })}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <Plane className="h-4 w-4 mr-1" />
            <span>
              {flight.avion.modelo} - {flight.avion.distribucion_asientos}
            </span>
          </div>
        </div>
      </CardContent>

      <FlightDetailsDialog flight={flight} open={showDetails} onOpenChange={setShowDetails} />
    </Card>
  )
}

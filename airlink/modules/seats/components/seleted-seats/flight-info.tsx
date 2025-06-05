"use client"

import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Plane } from "lucide-react"
import { useTranslations } from "next-intl"
import type { Flight } from "@/modules/flights/types/flights-types"

interface FlightInfoProps {
  flight: Flight
  isReturn?: boolean
}

export function FlightInfo({ flight, isReturn = false }: FlightInfoProps) {
  const t = useTranslations("flights")

  return (
    <div>
      <div className="flex items-center mb-2">
        <Plane className={`h-4 w-4 mr-2 ${isReturn ? "rotate-180" : ""}`} />
        <span className="font-medium">{isReturn ? t("returnFlight") : t("outboundFlight")}</span>
      </div>
      <div className="text-sm space-y-1">
        <div className="flex justify-between">
          <span>{flight.aerolinea.nombre}</span>
          <span>{flight.numero_vuelo}</span>
        </div>
        <div>
          {format(parseISO(flight.fecha_salida), "dd MMM", { locale: es })} ·{" "}
          {format(parseISO(flight.fecha_salida), "HH:mm")} - {format(parseISO(flight.fecha_llegada), "HH:mm")}
        </div>
        <div className="flex justify-between">
          <span>
            {flight.aeropuerto_origen.codigo_iata} - {flight.aeropuerto_destino.codigo_iata}
          </span>
        </div>
      </div>
    </div>
  )
}

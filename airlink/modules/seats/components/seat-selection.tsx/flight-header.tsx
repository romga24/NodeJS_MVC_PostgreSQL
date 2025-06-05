"use client"

import { useTranslations } from "next-intl"
import type { Flight } from "@/modules/flights/types/flights-types"

interface FlightHeaderProps {
  flight: Flight
}

export function FlightHeader({ flight }: FlightHeaderProps) {
  const t = useTranslations("flights")

  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold">
        {flight.aerolinea.nombre} - {t("flight")} {flight.numero_vuelo}
      </h3>
      <p className="text-sm text-gray-500">
        {flight.aeropuerto_origen.codigo_iata} → {flight.aeropuerto_destino.codigo_iata}
      </p>
    </div>
  )
}

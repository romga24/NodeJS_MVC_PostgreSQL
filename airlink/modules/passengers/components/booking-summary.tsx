"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Plane } from "lucide-react"
import { useTranslations } from "next-intl"
import type { Flight } from "@/modules/flights/types/flights-types"
import type { Seat } from "@/modules/seats/types/seat-types"

interface BookingSummaryProps {
  outboundFlight: Flight | null
  returnFlight: Flight | null
  selectedOutboundSeats: Seat[]
  selectedReturnSeats: Seat[]
  passengerCount: number
}

export function BookingSummary({
  outboundFlight,
  returnFlight,
  selectedOutboundSeats,
  selectedReturnSeats,
  passengerCount,
}: BookingSummaryProps) {
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const [basePrice, setBasePrice] = useState<number>(0)
  const [seatsPrice, setSeatsPrice] = useState<number>(0)
  const t = useTranslations()

	  const getSeatClassDisplay = (seatClass: string) => {
    const normalizedClass = seatClass.toLowerCase()
    console.log("Clase del asiento recibida:", seatClass, "-> normalizada:", normalizedClass)

    if (normalizedClass === "business") {
      return "Business"
    } else if (normalizedClass === "economy" || normalizedClass === "economica") {
      return "Economy"
    }

    return seatClass
  }

  useEffect(() => {
    const outboundBasePrice = outboundFlight ? outboundFlight.precio_vuelo * passengerCount : 0
    const returnBasePrice = returnFlight ? returnFlight.precio_vuelo * passengerCount : 0
    const totalBasePrice = outboundBasePrice + returnBasePrice

    const outboundSeatsPrice = selectedOutboundSeats.reduce((sum, seat) => sum + seat.precio, 0)
    const returnSeatsPrice = selectedReturnSeats.reduce((sum, seat) => sum + seat.precio, 0)
    const totalSeatsPrice = outboundSeatsPrice + returnSeatsPrice

    setBasePrice(totalBasePrice)
    setSeatsPrice(totalSeatsPrice)
    setTotalPrice(totalBasePrice + totalSeatsPrice)
  }, [outboundFlight, returnFlight, selectedOutboundSeats, selectedReturnSeats, passengerCount])

  if (!outboundFlight) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("booking.bookingDetails")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-center mb-2">
              <Plane className="h-4 w-4 mr-2" />
              <span className="font-medium">{t("flights.outboundFlight")}</span>
            </div>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>{outboundFlight.aerolinea.nombre}</span>
                <span>{outboundFlight.numero_vuelo}</span>
              </div>
              <div>
                {format(parseISO(outboundFlight.fecha_salida), "dd MMM", { locale: es })} ·{" "}
                {format(parseISO(outboundFlight.fecha_salida), "HH:mm")} -{" "}
                {format(parseISO(outboundFlight.fecha_llegada), "HH:mm")}
              </div>
              <div className="flex justify-between">
                <span>
                  {outboundFlight.aeropuerto_origen.codigo_iata} - {outboundFlight.aeropuerto_destino.codigo_iata}
                </span>
              </div>
            </div>
            {selectedOutboundSeats.length > 0 && (
              <div className="mt-2 p-2 bg-gray-50 rounded-md">
                <p className="text-sm font-medium mb-1">{t("booking.selectedSeats")}:</p>
                <div className="flex flex-wrap gap-1">
                  {selectedOutboundSeats.map((seat) => (
                    <div key={seat.id_asiento} className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                      {seat.codigo_asiento} ({getSeatClassDisplay(seat.clase)})
                      - {seat.precio.toFixed(2)} €
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {returnFlight && (
            <div>
              <div className="flex items-center mb-2">
                <Plane className="h-4 w-4 mr-2 rotate-180" />
                <span className="font-medium">{t("flights.returnFlight")}</span>
              </div>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>{returnFlight.aerolinea.nombre}</span>
                  <span>{returnFlight.numero_vuelo}</span>
                </div>
                <div>
                  {format(parseISO(returnFlight.fecha_salida), "dd MMM", { locale: es })} ·{" "}
                  {format(parseISO(returnFlight.fecha_salida), "HH:mm")} -{" "}
                  {format(parseISO(returnFlight.fecha_llegada), "HH:mm")}
                </div>
                <div className="flex justify-between">
                  <span>
                    {returnFlight.aeropuerto_origen.codigo_iata} - {returnFlight.aeropuerto_destino.codigo_iata}
                  </span>
                </div>
              </div>
              {selectedReturnSeats.length > 0 && (
                <div className="mt-2 p-2 bg-gray-50 rounded-md">
                  <p className="text-sm font-medium mb-1">{t("booking.selectedSeats")}:</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedReturnSeats.map((seat) => (
                      <div key={seat.id_asiento} className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                        {seat.codigo_asiento}
                        {getSeatClassDisplay(seat.clase)}{" "}
                        {seat.precio.toFixed(2)} €
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="border-t pt-4">
            <div className="flex justify-between text-sm">
              <span>
                {t("flights.basePrice")} ({passengerCount}{" "}
                {passengerCount === 1 ? t("passengers.passenger") : t("passengers.passengers")})
              </span>
              <span>{basePrice.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>{t("booking.seatSelection")}</span>
              <span>{seatsPrice.toFixed(2)} €</span>
            </div>
            <div className="border-t pt-2 mt-2 flex justify-between font-bold">
              <span>{t("common.total")}</span>
              <span>{totalPrice.toFixed(2)} €</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

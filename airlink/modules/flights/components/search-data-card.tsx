"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Plane } from "lucide-react"
import { useTranslations } from "next-intl"
import type { SearchFlightsParams, Flight } from "../types/flights-types"

interface SearchDataCardProps {
  searchParams: SearchFlightsParams
}

export function SearchDataCard({ searchParams }: SearchDataCardProps) {
  const router = useRouter()
  const { locale, passengers } = searchParams
  const [outboundFlight, setOutboundFlight] = useState<Flight | null>(null)
  const [returnFlight, setReturnFlight] = useState<Flight | null>(null)
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const t = useTranslations()

  const loadSelectedFlights = () => {
    const storedOutbound = sessionStorage.getItem("selectedOutboundFlight")
    const storedReturn = sessionStorage.getItem("selectedReturnFlight")

    if (storedOutbound) {
      try {
        const flight = JSON.parse(storedOutbound)
        console.log(t("flights.retrievedOutboundFlight"), flight)
        setOutboundFlight(flight)
      } catch (error) {
        console.error(t("flights.errorParsingStoredFlight"), error)
      }
    } else {
      setOutboundFlight(null)
    }

    if (storedReturn) {
      try {
        const flight = JSON.parse(storedReturn)
        console.log(t("flights.retrievedReturnFlight"), flight)
        setReturnFlight(flight)
      } catch (error) {
        console.error(t("flights.errorParsingStoredFlight"), error)
      }
    } else {
      setReturnFlight(null)
    }
  }

  useEffect(() => {
    loadSelectedFlights()

    const handleOutboundSelected = () => loadSelectedFlights()
    const handleReturnSelected = () => loadSelectedFlights()

    window.addEventListener("outboundFlightSelected", handleOutboundSelected)
    window.addEventListener("returnFlightSelected", handleReturnSelected)

    return () => {
      window.removeEventListener("outboundFlightSelected", handleOutboundSelected)
      window.removeEventListener("returnFlightSelected", handleReturnSelected)
    }
  }, [])

  useEffect(() => {
    let total = 0

    if (outboundFlight) {
      total += outboundFlight.precio_vuelo * passengers
    }

    if (returnFlight) {
      total += returnFlight.precio_vuelo * passengers
    }

    setTotalPrice(total)
  }, [outboundFlight, returnFlight, passengers])

  const handleContinue = () => {
    if (!outboundFlight) {
      alert(t("flights.pleaseSelectOutboundFlight"))
      return
    }

    if (searchParams.tripType === "roundTrip" && !returnFlight) {
      alert(t("flights.pleaseSelectReturnFlight"))
      return
    }

    sessionStorage.setItem("searchParams", JSON.stringify(searchParams))

    window.location.href = `/${locale}/seats`
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("flights.priceSummary")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {outboundFlight && (
            <div className="p-3 bg-gray-50 rounded-md">
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
                <div className="flex justify-between font-medium">
                  <span>
                    {outboundFlight.aeropuerto_origen.codigo_iata} - {outboundFlight.aeropuerto_destino.codigo_iata}
                  </span>
                  <span>{(outboundFlight.precio_vuelo * passengers).toFixed(2)} €</span>
                </div>
              </div>
            </div>
          )}

          {returnFlight && (
            <div className="p-3 bg-gray-50 rounded-md">
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
                <div className="flex justify-between font-medium">
                  <span>
                    {returnFlight.aeropuerto_origen.codigo_iata} - {returnFlight.aeropuerto_destino.codigo_iata}
                  </span>
                  <span>{(returnFlight.precio_vuelo * passengers).toFixed(2)} €</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <span>{t("passengers.passengers")}</span>
            <span>{passengers}</span>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between font-bold">
              <span>{t("common.total")}</span>
              <span>{totalPrice.toFixed(2)} €</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{t("flights.finalPriceDisclaimer")}</p>
          </div>

          <div className="space-y-2 pt-4">
            <Button className="w-full" onClick={handleContinue}>
              {t("common.continue")}
            </Button>
            <Button variant="outline" className="w-full" onClick={handleBack}>
              {t("common.back")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

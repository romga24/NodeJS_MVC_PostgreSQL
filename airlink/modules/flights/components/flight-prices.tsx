"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslations } from "next-intl"
import type { Flight } from "../types/flights-types"

interface FlightPricesProps {
  outboundFlight: Flight | null
  returnFlight: Flight | null
  passengers: number
}

export function FlightPrices({ outboundFlight, returnFlight, passengers }: FlightPricesProps) {
  const [outboundPrice, setOutboundPrice] = useState<number>(0)
  const [returnPrice, setReturnPrice] = useState<number>(0)
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const t = useTranslations()

  useEffect(() => {
    const outPrice = outboundFlight ? outboundFlight.precio_vuelo * passengers : 0
    const retPrice = returnFlight ? returnFlight.precio_vuelo * passengers : 0

    setOutboundPrice(outPrice)
    setReturnPrice(retPrice)
    setTotalPrice(outPrice + retPrice)
  }, [outboundFlight, returnFlight, passengers])

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("flights.priceBreakdown")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {outboundFlight && (
            <div className="flex justify-between">
              <span>
                {t("flights.outboundFlight")} ({passengers}{" "}
                {passengers === 1 ? t("passengers.passenger") : t("passengers.passengers")})
              </span>
              <span>{outboundPrice.toFixed(2)} €</span>
            </div>
          )}

          {returnFlight && (
            <div className="flex justify-between">
              <span>
                {t("flights.returnFlight")} ({passengers}{" "}
                {passengers === 1 ? t("passengers.passenger") : t("passengers.passengers")})
              </span>
              <span>{returnPrice.toFixed(2)} €</span>
            </div>
          )}

          <div className="border-t pt-4">
            <div className="flex justify-between font-bold">
              <span>{t("common.total")}</span>
              <span>{totalPrice.toFixed(2)} €</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

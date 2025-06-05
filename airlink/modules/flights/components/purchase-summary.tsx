"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Plane } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import type { FlightLeg } from "../types/flights-types"

interface PurchaseSummaryProps {
  outboundFlight: FlightLeg | null
  returnFlight: FlightLeg | null
  flightType: "economy" | "business"
  passengers: number
}

export function PurchaseSummary({ outboundFlight, returnFlight, flightType, passengers }: PurchaseSummaryProps) {
  const router = useRouter()
  const t = useTranslations()

  const outboundPrice = outboundFlight ? outboundFlight.price[flightType] : 0
  const returnPrice = returnFlight ? returnFlight.price[flightType] : 0
  const totalPrice = (outboundPrice + returnPrice) * passengers

  const handleContinue = () => {
    if (!outboundFlight) return

    if (returnFlight === null && outboundFlight.to !== outboundFlight.from) return

    router.push("/passenger-details")
  }

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>{t("search.tripSummary")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!outboundFlight && !returnFlight ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Plane className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">{t("search.selectFlightsToSeeSummary")}</p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <h3 className="font-medium">{t("search.passengers")}</h3>
              <p>
                {passengers} {passengers === 1 ? t("search.passenger") : t("search.passengers")}
              </p>
            </div>

            {outboundFlight && (
              <div className="space-y-2">
                <h3 className="font-medium">{t("search.outboundFlight")}</h3>
                <div className="flex justify-between">
                  <p>{outboundFlight.numero_vuelo}</p>
                  <p>${outboundFlight.price[flightType]}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {outboundFlight.from} → {outboundFlight.to}
                </p>
              </div>
            )}

            {returnFlight && (
              <div className="space-y-2">
                <h3 className="font-medium">{t("search.returnFlight")}</h3>
                <div className="flex justify-between">
                  <p>{returnFlight.numero_vuelo}</p>
                  <p>${returnFlight.price[flightType]}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {returnFlight.from} → {returnFlight.to}
                </p>
              </div>
            )}

            <div className="pt-4 border-t">
              <div className="flex justify-between font-medium">
                <p>{t("search.subtotal")}</p>
                <p>${(outboundPrice + returnPrice) * passengers}</p>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <p>{t("search.taxesAndFees")}</p>
                <p>{t("search.included")}</p>
              </div>
            </div>

            <div className="flex justify-between font-bold text-lg pt-2">
              <p>{t("search.total")}</p>
              <p>${totalPrice}</p>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          disabled={!outboundFlight || (outboundFlight.to !== outboundFlight.from && !returnFlight)}
          onClick={handleContinue}
        >
          <CreditCard className="mr-2 h-4 w-4" />
          {t("search.continueToPayment")}
        </Button>
      </CardFooter>
    </Card>
  )
}

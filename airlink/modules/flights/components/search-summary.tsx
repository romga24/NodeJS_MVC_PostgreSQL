"use client"

import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Card, CardContent } from "@/components/ui/card"
import { Plane, Users } from "lucide-react"
import { useTranslations } from "next-intl"
import type { SearchFlightsParams } from "../types/flights-types"

interface SearchSummaryProps {
  searchParams: SearchFlightsParams
}

export function SearchSummary({ searchParams }: SearchSummaryProps) {
  const t = useTranslations()

  if (!searchParams) return null

  const { originCode, destinationCode, departureDate, returnDate, passengers, tripType } = searchParams

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <h2 className="text-xl font-bold mb-4">{t("flights.searchSummary")}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">{t("flights.route")}</span>
            <div className="flex items-center mt-1">
              <span className="font-medium">{originCode}</span>
              <Plane className="mx-2 h-4 w-4" />
              <span className="font-medium">{destinationCode}</span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-sm text-gray-500">{t("flights.departureDate")}</span>
            <span className="font-medium">
              {departureDate
                ? format(parseISO(departureDate), "EEEE, d MMMM yyyy", { locale: es })
                : t("flights.notSpecified")}
            </span>
          </div>

          {tripType === "roundTrip" && returnDate && (
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">{t("flights.returnDate")}</span>
              <span className="font-medium">{format(parseISO(returnDate), "EEEE, d MMMM yyyy", { locale: es })}</span>
            </div>
          )}

          <div className="flex flex-col">
            <span className="text-sm text-gray-500">{t("passengers.passengers")}</span>
            <div className="flex items-center mt-1">
              <Users className="mr-2 h-4 w-4" />
              <span className="font-medium">
                {passengers} {passengers === 1 ? t("passengers.passenger") : t("passengers.passengers")}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useSearchFlights } from "../hooks/use-search-flights"
import { OutboundFlights } from "./outbound-flights"
import { ReturnFlights } from "./return-flights"
import { SearchDataCard } from "./search-data-card"
import { SearchSummary } from "./search-summary"
import { useTranslations } from "next-intl"
import type { Flight, SearchFlightsParams } from "../types/flights-types"

interface SearchPageClientProps {
  locale: string
}

export function SearchPageClient({ locale }: SearchPageClientProps) {
  const { getStoredFlights } = useSearchFlights()
  const [outboundFlights, setOutboundFlights] = useState<Flight[]>([])
  const [returnFlights, setReturnFlights] = useState<Flight[]>([])
  const [searchParams, setSearchParams] = useState<SearchFlightsParams | null>(null)
  const [loading, setLoading] = useState(true)
  const t = useTranslations()

  useEffect(() => {
    const { outboundFlights, returnFlights, searchParams } = getStoredFlights()

    setOutboundFlights(outboundFlights)
    setReturnFlights(returnFlights)
    setSearchParams(searchParams)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!searchParams || outboundFlights.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t("flights.noFlightsFound")}</h1>
          <p className="mb-4">{t("flights.noResultsToShow")}</p>
          <a href={`/${locale}`} className="text-blue-500 hover:underline">
            {t("common.backToHome")}
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SearchSummary searchParams={searchParams} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <OutboundFlights flights={outboundFlights} />

          {searchParams.tripType === "roundTrip" && returnFlights.length > 0 && (
            <ReturnFlights flights={returnFlights} className="mt-8" />
          )}
        </div>

        <div className="lg:col-span-1">
          <SearchDataCard searchParams={searchParams} />
        </div>
      </div>
    </div>
  )
}

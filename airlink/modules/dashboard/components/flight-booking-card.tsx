"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AirportSelector } from "./airport-selector"
import { DateSelector } from "./date-selector"
import { PassengerInput } from "./passenger-input"
import { TriptypeSelector } from "./triptype-selector"
import { format } from "date-fns"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSearchFlights } from "@/modules/flights/hooks/use-search-flights"
import { useTranslations } from "next-intl"

interface FlightBookingCardProps {
  locale: string
}

export function FlightBookingCard({ locale }: FlightBookingCardProps) {
  const t = useTranslations()
  const [originCode, setOriginCode] = useState("")
  const [destinationCode, setDestinationCode] = useState("")
  const [departureDate, setDepartureDate] = useState<Date | undefined>(undefined)
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined)
  const [tripType, setTripType] = useState<"roundTrip" | "oneWay">("roundTrip")
  const [passengers, setPassengers] = useState(1)
  const [validationError, setValidationError] = useState<string | null>(null)

  const { searchAndNavigate, loading, error } = useSearchFlights()

  const handleSearch = () => {
    setValidationError(null)

    if (!originCode) {
      setValidationError(t("dashboard.selectOriginAirport"))
      return
    }
    if (!destinationCode) {
      setValidationError(t("dashboard.selectDestinationAirport"))
      return
    }
    if (originCode === destinationCode) {
      setValidationError(t("dashboard.originDestinationCannotBeSame"))
      return
    }
    if (!departureDate) {
      setValidationError(t("dashboard.selectDepartureDate"))
      return
    }
    if (tripType === "roundTrip" && !returnDate) {
      setValidationError(t("dashboard.selectReturnDate"))
      return
    }

    const formattedDepartureDate = format(departureDate, "yyyy-MM-dd")
    const formattedReturnDate = returnDate ? format(returnDate, "yyyy-MM-dd") : undefined
    const safeLocale = locale || "es"

    const searchParams = {
      locale: safeLocale,
      originCode,
      destinationCode,
      departureDate: formattedDepartureDate,
      returnDate: formattedReturnDate,
      passengers,
      tripType,
    }

    searchAndNavigate(searchParams)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white/95 shadow-lg overflow-auto">
      <CardHeader className="p-4">
        <CardTitle className="text-center">{t("dashboard.searchFlights")}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
					<div className="flex justify-start mt-4">
          	<TriptypeSelector value={tripType} onChange={setTripType} />
					</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <AirportSelector
              value={originCode}
              onChange={setOriginCode}
              placeholder={t("dashboard.selectOrigin")}
              label={t("dashboard.origin")}
            />
            <AirportSelector
              value={destinationCode}
              onChange={setDestinationCode}
              placeholder={t("dashboard.selectDestination")}
              label={t("dashboard.destination")}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <DateSelector date={departureDate} onDateChange={setDepartureDate} label={t("dashboard.departureDate")} />
            {tripType === "roundTrip" && (
              <DateSelector
                date={returnDate}
                onDateChange={setReturnDate}
                label={t("dashboard.returnDate")}
                minDate={departureDate}
              />
            )}
          </div>
          <PassengerInput value={passengers} onChange={setPassengers} />
          {(validationError || error) && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{validationError || error}</AlertDescription>
            </Alert>
          )}
          <Button className="w-full" onClick={handleSearch} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("common.searching")}
              </>
            ) : (
              t("dashboard.searchFlights")
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

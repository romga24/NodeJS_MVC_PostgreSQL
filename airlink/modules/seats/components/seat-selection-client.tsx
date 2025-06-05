"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTranslations } from "next-intl"
import { SelectedSeatsInfo } from "./selected-seats-info"
import type { SearchFlightsParams, Flight } from "@/modules/flights/types/flights-types"
import { getFlightSeats } from "../services/seats"
import type { Seat } from "../types/seat-types"
import { LoadingState } from "./seat-selection.tsx/loading-state"
import { FlightTabContent } from "./seat-selection.tsx/flight-tab-content"
import { InfoAlert } from "./seat-selection.tsx/info-alert"
import { NoSeatsMessage } from "./seat-selection.tsx/no-seats-message"
import { WarningAlerts } from "./seat-selection.tsx/warning-alerts"

interface SeatSelectionClientProps {
  locale: string
}

export function SeatSelectionClient({ locale }: SeatSelectionClientProps) {
  const t = useTranslations()
  const tSeats = useTranslations("seats")
  const tFlights = useTranslations("flights")

  const [searchParams, setSearchParams] = useState<SearchFlightsParams | null>(null)
  const [outboundFlight, setOutboundFlight] = useState<Flight | null>(null)
  const [returnFlight, setReturnFlight] = useState<Flight | null>(null)
  const [outboundSeats, setOutboundSeats] = useState<Seat[]>([])
  const [returnSeats, setReturnSeats] = useState<Seat[]>([])
  const [selectedOutboundSeats, setSelectedOutboundSeats] = useState<Seat[]>([])
  const [selectedReturnSeats, setSelectedReturnSeats] = useState<Seat[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("outbound")
  const [skipSeatSelection, setSkipSeatSelection] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [warnings, setWarnings] = useState<string[]>([])

  useEffect(() => {
    const storedParams = sessionStorage.getItem("searchParams")
    const storedOutbound = sessionStorage.getItem("selectedOutboundFlight")
    const storedReturn = sessionStorage.getItem("selectedReturnFlight")

    if (storedParams) {
      const params = JSON.parse(storedParams)
      setSearchParams(params)
    }

    if (storedOutbound) {
      const flight = JSON.parse(storedOutbound)
      setOutboundFlight(flight)
    }

    if (storedReturn) {
      const flight = JSON.parse(storedReturn)
      setReturnFlight(flight)
    }

    if (!storedOutbound) {
      window.location.href = `/${locale}`
      return
    }
  }, [locale])

  useEffect(() => {
    const loadSeats = async () => {
      if (!outboundFlight) return

      setLoading(true)
      setWarnings([])

      try {
        const outboundSeatsData = await getFlightSeats(outboundFlight.numero_vuelo)

        if (!outboundSeatsData || outboundSeatsData.length === 0) {
          console.warn(`No se encontraron asientos para el vuelo de ida ${outboundFlight.numero_vuelo}`)
          setWarnings((prev) => [...prev, tSeats("noSeatsFoundWarning", { flightNumber: outboundFlight.numero_vuelo })])
        }

        setOutboundSeats(Array.isArray(outboundSeatsData) ? outboundSeatsData : [])

        if (returnFlight) {
          const returnSeatsData = await getFlightSeats(returnFlight.numero_vuelo)

          if (!returnSeatsData || returnSeatsData.length === 0) {
            console.warn(`No se encontraron asientos para el vuelo de vuelta ${returnFlight.numero_vuelo}`)
            setWarnings((prev) => [
              ...prev,
              tSeats("noSeatsFoundReturnWarning", { flightNumber: returnFlight.numero_vuelo }),
            ])
          }

          setReturnSeats(Array.isArray(returnSeatsData) ? returnSeatsData : [])
        }
      } catch (error) {
        console.error("Error al cargar asientos:", error)
        setError(tSeats("errorLoadingSeats"))
      } finally {
        setLoading(false)
      }
    }

    loadSeats()
  }, [outboundFlight, returnFlight, tSeats])

  const handleSeatSelect = (seat: Seat, isOutbound: boolean) => {
    if (seat.estado === "ocupado") return

    if (isOutbound) {
      if (selectedOutboundSeats.length >= (searchParams?.passengers || 1)) {
        if (selectedOutboundSeats.some((s) => s.id_asiento === seat.id_asiento)) {
          setSelectedOutboundSeats((prev) => prev.filter((s) => s.id_asiento !== seat.id_asiento))
        } else {
          setSelectedOutboundSeats((prev) => [...prev.slice(1), seat])
        }
      } else {
        setSelectedOutboundSeats((prev) => [...prev, seat])
      }
    } else {
      if (selectedReturnSeats.length >= (searchParams?.passengers || 1)) {
        if (selectedReturnSeats.some((s) => s.id_asiento === seat.id_asiento)) {
          setSelectedReturnSeats((prev) => prev.filter((s) => s.id_asiento !== seat.id_asiento))
        } else {
          setSelectedReturnSeats((prev) => [...prev.slice(1), seat])
        }
      } else {
        setSelectedReturnSeats((prev) => [...prev, seat])
      }
    }
  }

  const handleSkipSelection = () => {
    setSkipSeatSelection(true)

    const passengersCount = searchParams?.passengers || 1
    const availableOutboundSeats = outboundSeats.filter((seat) => seat.estado === "disponible")
    const autoSelectedOutboundSeats = availableOutboundSeats.slice(0, passengersCount)
    setSelectedOutboundSeats(autoSelectedOutboundSeats)

    sessionStorage.setItem("selectedOutboundSeats", JSON.stringify(autoSelectedOutboundSeats))

    if (returnFlight && searchParams?.tripType === "roundTrip") {
      const availableReturnSeats = returnSeats.filter((seat) => seat.estado === "disponible")
      const autoSelectedReturnSeats = availableReturnSeats.slice(0, passengersCount)
      setSelectedReturnSeats(autoSelectedReturnSeats)
      sessionStorage.setItem("selectedReturnSeats", JSON.stringify(autoSelectedReturnSeats))
    }

    window.location.href = `/${locale}/passengers`
  }

  const handleContinue = () => {
    const outboundSeatsNeeded = searchParams?.passengers || 1
    const returnSeatsNeeded = returnFlight && searchParams?.tripType === "roundTrip" ? searchParams?.passengers || 1 : 0

    if (!skipSeatSelection) {
      if (outboundSeats.length > 0 && selectedOutboundSeats.length < outboundSeatsNeeded) {
        alert(
          tSeats("pleaseSelect") +
            ` ${outboundSeatsNeeded} ` +
            tSeats("seatsRequired") +
            ` ` +
            tFlights("outboundFlight").toLowerCase(),
        )
        return
      }

      if (
        returnFlight &&
        searchParams?.tripType === "roundTrip" &&
        returnSeats.length > 0 &&
        selectedReturnSeats.length < returnSeatsNeeded
      ) {
        alert(
          tSeats("pleaseSelect") +
            ` ${returnSeatsNeeded} ` +
            tSeats("seatsRequired") +
            ` ` +
            tFlights("returnFlight").toLowerCase(),
        )
        return
      }
    }

    sessionStorage.setItem("selectedOutboundSeats", JSON.stringify(selectedOutboundSeats))
    if (returnFlight && searchParams?.tripType === "roundTrip") {
      sessionStorage.setItem("selectedReturnSeats", JSON.stringify(selectedReturnSeats))
    }

    window.location.href = `/${locale}/passengers`
  }

  if (loading) {
    return <LoadingState />
  }

  if (!outboundFlight || !searchParams) {
    return (<p>No hay vuelos disponibles.</p>)
  }

  const noSeatsAvailable = outboundSeats.length === 0 && (!returnFlight || returnSeats.length === 0)

  if (noSeatsAvailable) {
    return <NoSeatsMessage onSkip={handleSkipSelection} />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{tSeats("seatSelection")}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{tSeats("seatMap")}</CardTitle>
              <CardDescription>
                {tSeats("selectSeatsForEachPassenger", { passengers: searchParams.passengers })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="outbound">{tFlights("outboundFlight")}</TabsTrigger>
                  {returnFlight && searchParams.tripType === "roundTrip" && (
                    <TabsTrigger value="return">{tFlights("returnFlight")}</TabsTrigger>
                  )}
                </TabsList>

                <TabsContent value="outbound" className="mt-4">
                  <FlightTabContent
                    flight={outboundFlight}
                    seats={outboundSeats}
                    selectedSeats={selectedOutboundSeats}
                    onSeatSelect={(seat) => handleSeatSelect(seat, true)}
                    maxSelections={searchParams.passengers}
                  />
                </TabsContent>

                {returnFlight && searchParams.tripType === "roundTrip" && (
                  <TabsContent value="return" className="mt-4">
                    <FlightTabContent
                      flight={returnFlight}
                      seats={returnSeats}
                      selectedSeats={selectedReturnSeats}
                      onSeatSelect={(seat) => handleSeatSelect(seat, false)}
                      maxSelections={searchParams.passengers}
                    />
                  </TabsContent>
                )}
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <SelectedSeatsInfo
            outboundFlight={outboundFlight}
            returnFlight={returnFlight}
            selectedOutboundSeats={selectedOutboundSeats}
            selectedReturnSeats={selectedReturnSeats}
            passengers={searchParams.passengers}
            onContinue={handleContinue}
            onSkip={handleSkipSelection}
            tripType={searchParams.tripType}
          />
        </div>
      </div>
    </div>
  )
}

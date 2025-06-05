"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { format, parseISO } from "date-fns"
import { es, enUS } from "date-fns/locale"
import { AlertCircle, ArrowLeft, Plane, User, CreditCard, Loader2 } from "lucide-react"
import { createBooking } from "@/modules/booking/services/booking"
import type { Flight } from "@/modules/flights/types/flights-types"
import type { Passenger } from "@/modules/passengers/types/passenger-types"
import type { Seat } from "@/modules/seats/types/seat-types"
import { useTranslations } from "next-intl"

interface BookingConfirmationPageProps {
  locale: string
}

export function BookingConfirmationPage({ locale }: BookingConfirmationPageProps) {
  const t = useTranslations("booking")
  const commonT = useTranslations("common")
  const flightsT = useTranslations("flights")
  const passengersT = useTranslations("passengers")

  const [outboundFlight, setOutboundFlight] = useState<Flight | null>(null)
  const [returnFlight, setReturnFlight] = useState<Flight | null>(null)
  const [selectedOutboundSeats, setSelectedOutboundSeats] = useState<Seat[]>([])
  const [selectedReturnSeats, setSelectedReturnSeats] = useState<Seat[]>([])
  const [passengers, setPassengers] = useState<Passenger[]>([])
  const [contactInfo, setContactInfo] = useState<{ email: string; phone: string }>({ email: "", phone: "" })
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const router = useRouter()

  const dateLocale = locale === "es" ? es : enUS

  const getSeatClassDisplay = (seatClass: string) => {
    const normalizedClass = seatClass.toLowerCase()
    console.log("Clase del asiento recibida:", seatClass, "-> normalizada:", normalizedClass)

    if (normalizedClass === "business") {
      return t("business")
    } else if (normalizedClass === "economy" || normalizedClass === "economica") {
      return t("economy")
    }
    return seatClass
  }

  useEffect(() => {
    try {
      const storedOutbound = sessionStorage.getItem("selectedOutboundFlight")
      const storedReturn = sessionStorage.getItem("selectedReturnFlight")
      const storedOutboundSeats = sessionStorage.getItem("selectedOutboundSeats")
      const storedReturnSeats = sessionStorage.getItem("selectedReturnSeats")
      const storedPassengers = sessionStorage.getItem("passengers")
      const storedContactInfo = sessionStorage.getItem("contactInfo")
      const storedSearchParams = sessionStorage.getItem("searchParams")

      if (!storedOutbound || !storedPassengers) {
        setError(t("errors.incompleteBookingInfo"))
        setLoading(false)
        return
      }

      const outboundFlight = JSON.parse(storedOutbound)
      const searchParams = JSON.parse(storedSearchParams || "{}")
      const passengers = JSON.parse(storedPassengers)

      setOutboundFlight(outboundFlight)
      setPassengers(passengers)

      if (storedContactInfo) {
        setContactInfo(JSON.parse(storedContactInfo))
      } else if (passengers && passengers.length > 0) {
        const contactEmail = passengers[0].email || ""
        const contactPhone = passengers[0].phone || ""
        setContactInfo({ email: contactEmail, phone: contactPhone })
      }

      if (storedReturn) {
        setReturnFlight(JSON.parse(storedReturn))
      }

      if (storedOutboundSeats) {
        const outboundSeats = JSON.parse(storedOutboundSeats)
        console.log("Asientos de ida cargados:", outboundSeats)
        setSelectedOutboundSeats(outboundSeats)
      }

      if (storedReturnSeats) {
        const returnSeats = JSON.parse(storedReturnSeats)
        console.log("Asientos de vuelta cargados:", returnSeats)
        setSelectedReturnSeats(returnSeats)
      }

      calculateTotalPrice(
        outboundFlight,
        storedReturn ? JSON.parse(storedReturn) : null,
        storedOutboundSeats ? JSON.parse(storedOutboundSeats) : [],
        storedReturnSeats ? JSON.parse(storedReturnSeats) : [],
        passengers.length,
      )

      setLoading(false)
    } catch (err) {
      console.error(t("errors.loadingDataError"), err)
      setError(t("errors.bookingDataError"))
      setLoading(false)
    }
  }, [t])

  const calculateTotalPrice = (
    outbound: Flight | null,
    returnFlight: Flight | null,
    outboundSeats: Seat[],
    returnSeats: Seat[],
    passengerCount: number,
  ) => {
    let total = 0

    if (outbound) {
      const outboundPrice = outbound.precio_vuelo * passengerCount
      console.log("Precio vuelo ida:", outbound.precio_vuelo, "x", passengerCount, "=", outboundPrice)
      total += outboundPrice
    }
    if (returnFlight) {
      const returnPrice = returnFlight.precio_vuelo * passengerCount
      console.log("Precio vuelo vuelta:", returnFlight.precio_vuelo, "x", passengerCount, "=", returnPrice)
      console.log("Datos completos vuelo vuelta:", returnFlight)
      total += returnPrice
    }

    const outboundSeatsPrice = outboundSeats.reduce((sum, seat) => sum + seat.precio, 0)
    const returnSeatsPrice = returnSeats.reduce((sum, seat) => sum + seat.precio, 0)

    console.log("Precio asientos ida:", outboundSeatsPrice)
    console.log("Precio asientos vuelta:", returnSeatsPrice)

    total += outboundSeatsPrice + returnSeatsPrice

    console.log("Precio total calculado:", total)
    setTotalPrice(total)
  }

  const handleGoBack = () => {
    router.push(`/${locale}/passengers`)
  }

  const handleConfirmBooking = async () => {
    if (!outboundFlight || !passengers || passengers.length === 0) {
      setError(t("errors.incompleteBookingInfo"))
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const bookingData = {
        outboundFlight,
        returnFlight: returnFlight || undefined,
        passengers,
        outboundSeats: selectedOutboundSeats,
        returnSeats: selectedReturnSeats,
        contactInfo,
        totalPrice,
      }

      const result = await createBooking(bookingData)

      if (result.success) {
        sessionStorage.setItem("lastBookingId", result.bookingId || "")

        router.push(`/${locale}/confirmation/success`)
      } else {
        setError(result.error || t("errors.createBookingError"))
      }
    } catch (err) {
      console.error(t("errors.processingBookingError"), err)
      setError(t("errors.processingBookingError"))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error && !outboundFlight) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{commonT("error")}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4 text-center">
          <Button onClick={() => router.push(`/${locale}/dashboard`)}>{commonT("backToHome")}</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t("confirmationTitle")}</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{commonT("error")}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plane className="mr-2 h-5 w-5" />
                {flightsT("flightDetails")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {outboundFlight && (
                <div>
                  <h3 className="font-semibold mb-2">{flightsT("outboundFlight")}</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{outboundFlight.aerolinea.nombre}</span>
                      <span>
                        {flightsT("flight")} {outboundFlight.numero_vuelo}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <div>
                        <p className="font-medium">
                          {format(parseISO(outboundFlight.fecha_salida), "HH:mm", { locale: dateLocale })}
                        </p>
                        <p className="text-sm text-gray-500">{outboundFlight.aeropuerto_origen.codigo_iata}</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-xs text-gray-500">
                          {format(parseISO(outboundFlight.fecha_salida), "dd MMM", { locale: dateLocale })}
                        </div>
                        <div className="w-16 h-px bg-gray-300 my-2"></div>
                        <div className="text-xs text-gray-500">{flightsT("direct")}</div>
                      </div>
                      <div>
                        <p className="font-medium">
                          {format(parseISO(outboundFlight.fecha_llegada), "HH:mm", { locale: dateLocale })}
                        </p>
                        <p className="text-sm text-gray-500">{outboundFlight.aeropuerto_destino.codigo_iata}</p>
                      </div>
                    </div>
                  </div>

                  {selectedOutboundSeats.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium mb-1">{t("selectedSeats")}:</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedOutboundSeats.map((seat, index) => (
                          <div key={seat.id_asiento} className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                            {seat.codigo_asiento} ({getSeatClassDisplay(seat.clase)}) - {passengersT("passenger")}{" "}
                            {index + 1}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {returnFlight && (
                <div>
                  <h3 className="font-semibold mb-2">{flightsT("returnFlight")}</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{returnFlight.aerolinea.nombre}</span>
                      <span>
                        {flightsT("flight")} {returnFlight.numero_vuelo}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <div>
                        <p className="font-medium">
                          {format(parseISO(returnFlight.fecha_salida), "HH:mm", { locale: dateLocale })}
                        </p>
                        <p className="text-sm text-gray-500">{returnFlight.aeropuerto_origen.codigo_iata}</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-xs text-gray-500">
                          {format(parseISO(returnFlight.fecha_salida), "dd MMM", { locale: dateLocale })}
                        </div>
                        <div className="w-16 h-px bg-gray-300 my-2"></div>
                        <div className="text-xs text-gray-500">{flightsT("direct")}</div>
                      </div>
                      <div>
                        <p className="font-medium">
                          {format(parseISO(returnFlight.fecha_llegada), "HH:mm", { locale: dateLocale })}
                        </p>
                        <p className="text-sm text-gray-500">{returnFlight.aeropuerto_destino.codigo_iata}</p>
                      </div>
                    </div>
                  </div>

                  {selectedReturnSeats.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium mb-1">{t("selectedSeats")}:</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedReturnSeats.map((seat, index) => (
                          <div key={seat.id_asiento} className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                            {seat.codigo_asiento} ({getSeatClassDisplay(seat.clase)}) - {passengersT("passenger")}{" "}
                            {index + 1}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                {passengersT("passengerInformation")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {passengers.map((passenger, index) => (
                  <div key={passenger.id} className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-semibold mb-2">
                      {passengersT("passenger")} {index + 1}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">{passengersT("fullName")}</p>
                        <p>
                          {passenger.firstName} {passenger.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{passengersT("document")}</p>
                        <p>
                          {passenger.documentType === "dni"
                            ? passengersT("documentTypes.dni")
                            : passenger.documentType === "passport"
                              ? passengersT("documentTypes.passport")
                              : passengersT("documentTypes.other")}
                          : {passenger.documentNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="mt-4">
                  <h3 className="font-semibold mb-2">{t("contactInformation")}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">{commonT("email")}</p>
                      <p>{contactInfo.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{commonT("phone")}</p>
                      <p>{contactInfo.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{t("priceSummary")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {outboundFlight && (
                  <div className="flex justify-between">
                    <span>
                      {flightsT("outboundFlight")} ({passengers.length}{" "}
                      {passengers.length === 1 ? passengersT("passenger") : passengersT("passengers")})
                    </span>
                    <span>{(outboundFlight.precio_vuelo * passengers.length).toFixed(2)} €</span>
                  </div>
                )}

                {returnFlight && (
                  <div className="flex justify-between">
                    <span>
                      {flightsT("returnFlight")} ({passengers.length}{" "}
                      {passengers.length === 1 ? passengersT("passenger") : passengersT("passengers")})
                    </span>
                    <span>{(returnFlight.precio_vuelo * passengers.length).toFixed(2)} €</span>
                  </div>
                )}

                {selectedOutboundSeats.length > 0 && (
                  <div className="flex justify-between">
                    <span>
                      {t("seatSelection")} ({flightsT("outbound")})
                    </span>
                    <span>{selectedOutboundSeats.reduce((sum, seat) => sum + seat.precio, 0).toFixed(2)} €</span>
                  </div>
                )}

                {selectedReturnSeats.length > 0 && (
                  <div className="flex justify-between">
                    <span>
                      {t("seatSelection")} ({flightsT("return")})
                    </span>
                    <span>{selectedReturnSeats.reduce((sum, seat) => sum + seat.precio, 0).toFixed(2)} €</span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between font-bold">
                  <span>{commonT("total")}</span>
                  <span>{totalPrice.toFixed(2)} €</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button onClick={handleConfirmBooking} className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("processing")}
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    {t("confirmAndPay")}
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleGoBack} disabled={isSubmitting} className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("backToPassengers")}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

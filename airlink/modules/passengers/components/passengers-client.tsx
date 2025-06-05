"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { savePassengerInfo } from "@/modules/passengers/services/passengers"
import { PassengerForm } from "./passenger-form"
import { BookingSummary } from "./booking-summary"
import type { Flight } from "@/modules/flights/types/flights-types"
import type { Seat } from "@/modules/seats/types/seat-types"
import type { Passenger } from "../types/passenger-types"

interface PassengersClientProps {
  locale: string
}

export function PassengersClient({ locale }: PassengersClientProps) {
  const [outboundFlight, setOutboundFlight] = useState<Flight | null>(null)
  const [returnFlight, setReturnFlight] = useState<Flight | null>(null)
  const [selectedOutboundSeats, setSelectedOutboundSeats] = useState<Seat[]>([])
  const [selectedReturnSeats, setSelectedReturnSeats] = useState<Seat[]>([])
  const [passengers, setPassengers] = useState<Passenger[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [contactInfo, setContactInfo] = useState({ email: "", phone: "" })
  const router = useRouter()

  useEffect(() => {
    try {
      const storedOutbound = sessionStorage.getItem("selectedOutboundFlight")
      const storedReturn = sessionStorage.getItem("selectedReturnFlight")
      const storedOutboundSeats = sessionStorage.getItem("selectedOutboundSeats")
      const storedReturnSeats = sessionStorage.getItem("selectedReturnSeats")
      const storedSearchParams = sessionStorage.getItem("searchParams")

      if (!storedOutbound || !storedSearchParams) {
        setError("No se encontró información de vuelos seleccionados")
        setLoading(false)
        return
      }

      const outboundFlight = JSON.parse(storedOutbound)
      const searchParams = JSON.parse(storedSearchParams)
      const passengerCount = searchParams.passengers || 1

      setOutboundFlight(outboundFlight)

      if (storedReturn) {
        setReturnFlight(JSON.parse(storedReturn))
      }

      if (storedOutboundSeats) {
        const outboundSeats = JSON.parse(storedOutboundSeats)
        setSelectedOutboundSeats(outboundSeats)

        const initialPassengers: Passenger[] = Array.from({ length: passengerCount }, (_, i) => ({
          id: `passenger-${i + 1}`,
          type: "adult",
          firstName: "",
          lastName: "",
          documentType: "dni",
          documentNumber: "",
          seatOutbound: "",
          seatReturn: "",
        }))

        const updatedPassengers = initialPassengers.map((passenger, index) => {
          return {
            ...passenger,
            seatOutbound: outboundSeats[index]?.codigo_asiento || "",
          }
        })

        if (storedReturnSeats) {
          const returnSeats = JSON.parse(storedReturnSeats)
          setSelectedReturnSeats(returnSeats)

          updatedPassengers.forEach((passenger, index) => {
            passenger.seatReturn = returnSeats[index]?.codigo_asiento || ""
          })
        }

        setPassengers(updatedPassengers)
      } else {
        const initialPassengers: Passenger[] = Array.from({ length: passengerCount }, (_, i) => ({
          id: `passenger-${i + 1}`,
          type: "adult",
          firstName: "",
          lastName: "",
          documentType: "dni",
          documentNumber: "",
          seatOutbound: "",
          seatReturn: "",
        }))
        setPassengers(initialPassengers)
      }

      setLoading(false)
    } catch (err) {
      console.error("Error al cargar datos:", err)
      setError("Error al cargar datos de vuelos")
      setLoading(false)
    }
  }, [])

  const handlePassengerChange = (index: number, data: Partial<Passenger>) => {
    setPassengers((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], ...data }
      return updated
    })
  }

  const handleContactInfoChange = (field: "email" | "phone", value: string) => {
    setContactInfo((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      setError(null)

      const isValid =
        passengers.every((p) => p.firstName && p.lastName && p.documentNumber) && contactInfo.email && contactInfo.phone

      if (!isValid) {
        setError("Por favor, complete todos los campos requeridos")
        setIsSubmitting(false)
        return
      }

      // Guardar la información de pasajeros en sessionStorage
      await savePassengerInfo(passengers)

      // Guardar la información de contacto en sessionStorage
      sessionStorage.setItem("contactInfo", JSON.stringify(contactInfo))

      // Redirigir a la página de confirmación sin crear la reserva
      router.push(`/${locale}/confirmation`)
    } catch (err) {
      console.error("Error al procesar el formulario:", err)
      setError("Error al procesar el formulario")
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
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4 text-center">
          <Button onClick={() => router.push(`/${locale}/dashboard`)}>Volver al inicio</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Información de pasajeros</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Datos de pasajeros</CardTitle>
              <CardDescription>Por favor, complete la información de todos los pasajeros</CardDescription>
            </CardHeader>
            <CardContent>
              {passengers.map((passenger, index) => (
                <PassengerForm
                  key={passenger.id}
                  passenger={passenger}
                  index={index}
                  onChange={handlePassengerChange}
                  outboundSeat={selectedOutboundSeats[index]?.codigo_asiento}
                  returnSeat={selectedReturnSeats[index]?.codigo_asiento}
                />
              ))}

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Información de contacto</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={contactInfo.email}
                      onChange={(e) => handleContactInfoChange("email", e.target.value)}
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={contactInfo.phone}
                      onChange={(e) => handleContactInfoChange("phone", e.target.value)}
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    "Continuar al pago"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <BookingSummary
            outboundFlight={outboundFlight}
            returnFlight={returnFlight}
            selectedOutboundSeats={selectedOutboundSeats}
            selectedReturnSeats={selectedReturnSeats}
            passengerCount={passengers.length}
          />
        </div>
      </div>
    </div>
  )
}

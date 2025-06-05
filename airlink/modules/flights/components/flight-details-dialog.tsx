"use client"

import { useState, useEffect } from "react"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Plane, Luggage, Wifi, Coffee, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getFlightDetailedInfo } from "@/modules/flights/services/tickets"
import { useTranslations } from "next-intl"
import type { Flight } from "../types/flights-types"

interface FlightDetailsDialogProps {
  flight: Flight
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FlightDetailsDialog({ flight, open, onOpenChange }: FlightDetailsDialogProps) {
  const [flightDetails, setFlightDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const t = useTranslations()

  const departureTime = parseISO(flight.fecha_salida)
  const arrivalTime = parseISO(flight.fecha_llegada)
  const durationMs = arrivalTime.getTime() - departureTime.getTime()
  const durationHours = Math.floor(durationMs / (1000 * 60 * 60))
  const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))

  useEffect(() => {
    if (open) {
      setLoading(true)
      try {
        const details = getFlightDetailedInfo(flight)
        setFlightDetails(details)
      } catch (error) {
        console.error(t("flights.errorGettingDetails"), error)
      } finally {
        setLoading(false)
      }
    }
  }, [open, flight, t])

  if (!open) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Plane className="mr-2 h-5 w-5" />
            {t("flights.detailedInformation")} {flight.numero_vuelo}
          </DialogTitle>
          <DialogDescription>
            {flight.aerolinea.nombre} - {format(parseISO(flight.fecha_salida), "EEEE, d MMMM yyyy", { locale: es })}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">{t("flights.details")}</TabsTrigger>
              <TabsTrigger value="services">{t("flights.services")}</TabsTrigger>
              <TabsTrigger value="baggage">{t("flights.baggage")}</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">{t("flights.flightDetails")}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{t("flights.airline")}:</span>
                      <span>
                        {flight.aerolinea.nombre} ({flight.aerolinea.codigo_iata})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">{t("flights.flightNumber")}:</span>
                      <span>{flight.numero_vuelo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">{t("common.duration")}:</span>
                      <span>
                        {durationHours}h {durationMinutes}m
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">{t("common.price")}:</span>
                      <span>{flight.precio_vuelo.toFixed(2)} €</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mt-6 mb-3">{t("flights.schedule")}</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                          <span className="font-bold text-xs text-blue-700">S</span>
                        </div>
                        <div>
                          <p className="font-semibold">{format(parseISO(flight.fecha_salida), "HH:mm")}</p>
                          <p className="text-sm text-gray-500">
                            {format(parseISO(flight.fecha_salida), "EEEE, d MMMM yyyy", { locale: es })}
                          </p>
                        </div>
                      </div>
                      <div className="ml-4 pl-4 border-l border-gray-300 py-2">
                        <p className="font-medium">{flight.aeropuerto_origen.nombre}</p>
                        <p className="text-sm text-gray-500">
                          {flight.aeropuerto_origen.ciudad}, {flight.aeropuerto_origen.pais}
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
                          <span className="font-bold text-xs text-green-700">L</span>
                        </div>
                        <div>
                          <p className="font-semibold">{format(parseISO(flight.fecha_llegada), "HH:mm")}</p>
                          <p className="text-sm text-gray-500">
                            {format(parseISO(flight.fecha_llegada), "EEEE, d MMMM yyyy", { locale: es })}
                          </p>
                        </div>
                      </div>
                      <div className="ml-4 pl-4 border-l border-gray-300 py-2">
                        <p className="font-medium">{flight.aeropuerto_destino.nombre}</p>
                        <p className="text-sm text-gray-500">
                          {flight.aeropuerto_destino.ciudad}, {flight.aeropuerto_destino.pais}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">{t("flights.aircraftInformation")}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{t("flights.model")}:</span>
                      <span>{flight.avion.modelo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">{t("flights.configuration")}:</span>
                      <span>{flight.avion.distribucion_asientos}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">{t("flights.capacity")}:</span>
                      <span>
                        {flight.avion.capacidad} {t("flights.passengers")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">{t("flights.totalSeats")}:</span>
                      <span>{flight.avion.total_asientos}</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">{t("flights.additionalInformation")}</h3>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm text-gray-600">
                        {t("flights.operatedBy", { airline: flight.aerolinea.nombre })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="services" className="pt-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">{t("flights.onboardServices")}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start p-3 bg-gray-50 rounded-md">
                      <Wifi className="h-5 w-5 mr-2 text-blue-500 mt-0.5" />
                      <div>
                        <p className="font-medium">{t("flights.wifiOnboard")}</p>
                        <p className="text-sm text-gray-600">{t("flights.availableWithCharge")}</p>
                      </div>
                    </div>
                    <div className="flex items-start p-3 bg-gray-50 rounded-md">
                      <Coffee className="h-5 w-5 mr-2 text-blue-500 mt-0.5" />
                      <div>
                        <p className="font-medium">{t("flights.foodAndDrinks")}</p>
                        <p className="text-sm text-gray-600">{t("flights.mealServiceIncluded")}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">{t("flights.entertainment")}</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-600">
                      {t("flights.entertainmentDescription", { airline: flight.aerolinea.nombre })}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">{t("flights.amenities")}</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-600">{t("flights.amenitiesDescription")}</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="baggage" className="pt-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">{t("flights.baggagePolicy")}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start p-3 bg-gray-50 rounded-md">
                      <Luggage className="h-5 w-5 mr-2 text-blue-500 mt-0.5" />
                      <div>
                        <p className="font-medium">{t("flights.handLuggage")}</p>
                        <p className="text-sm text-gray-600">{t("flights.handLuggageAllowance")}</p>
                        <p className="text-sm text-gray-600">{t("flights.personalItem")}</p>
                      </div>
                    </div>
                    <div className="flex items-start p-3 bg-gray-50 rounded-md">
                      <Luggage className="h-5 w-5 mr-2 text-blue-500 mt-0.5" />
                      <div>
                        <p className="font-medium">{t("flights.checkedBaggage")}</p>
                        <p className="text-sm text-gray-600">{t("flights.checkedBaggageAllowance")}</p>
                        <p className="text-sm text-gray-600">{t("flights.additionalBaggageFee")}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">{t("flights.restrictions")}</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-600">{t("flights.restrictionsDescription")}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">{t("flights.specialBaggage")}</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-600">{t("flights.specialBaggageDescription")}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}

        <div className="flex justify-end mt-4">
          <DialogClose asChild>
            <Button variant="outline">
              <X className="h-4 w-4 mr-1" /> {t("common.close")}
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}

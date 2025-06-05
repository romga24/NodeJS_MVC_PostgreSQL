"use client"

import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Plane, Calendar, ArrowRight } from "lucide-react"
import type { Booking } from "../types/booking-types"
import { useTranslations } from "next-intl"

interface BookingsListProps {
  bookings: Booking[]
  onSelectBooking: (booking: Booking) => void
}

export function BookingsList({ bookings, onSelectBooking }: BookingsListProps) {
  const t = useTranslations()

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "programado":
        return "bg-green-100 text-green-800"
      case "cancelado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "programado":
        return t("flights.scheduled")
      case "cancelado":
        return t("flights.cancelled")
      default:
        return status
    }
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg mb-4">{t("bookings.noActiveBookings")}</p>
        <p className="text-gray-500">{t("bookings.bookingsWillAppearHere")}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div key={booking.id_reserva} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
          <div className="flex flex-col sm:flex-row sm:justify-between items-start mb-3 gap-3">
            <div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm text-gray-500">
                  {t("bookings.bookingMadeOn")}{" "}
                  {format(parseISO(booking.fecha_reserva), "d 'de' MMMM 'de' yyyy", { locale: es })}
                </span>
              </div>
              <h3 className="font-medium mt-1 truncate max-w-xs sm:max-w-none">
                {t("bookings.booking")} #{booking.id_reserva}
              </h3>
            </div>

            {/* Botón abajo en móvil, a la derecha en sm+ */}
            <div className="w-full sm:w-auto sm:self-start">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelectBooking(booking)}
                className="w-full sm:w-auto"
              >
                {t("common.viewDetails")}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            {booking.billetes.slice(0, 2).map((ticket) => (
              <div key={ticket.id_billete} className="flex flex-wrap items-center text-sm gap-x-1 gap-y-1">
                <Plane className="h-4 w-4 text-primary" />
                <span className="font-medium truncate max-w-[120px]">{ticket.vuelo.numero_vuelo}</span>
                <span>·</span>
                <span>{format(parseISO(ticket.vuelo.fecha_salida), "d MMM", { locale: es })}</span>
                <span>·</span>
                <span>{format(parseISO(ticket.vuelo.fecha_salida), "HH:mm")}</span>
                <ArrowRight className="h-3 w-3 mx-1" />
                <span>·</span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getStatusColor(ticket.vuelo.estado_vuelo)}`}
                >
                  {getStatusText(ticket.vuelo.estado_vuelo)}
                </span>
              </div>
            ))}

            {booking.billetes.length > 2 && (
              <div className="text-sm text-gray-500">
                + {booking.billetes.length - 2} {t("bookings.moreTickets")}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

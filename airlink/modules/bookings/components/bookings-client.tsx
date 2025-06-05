"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { BookingsList } from "./bookings-list"
import { BookingDetails } from "./booking-details"
import type { Booking } from "../types/booking-types"
import { getUserBookings } from "../services/booking"
import { useSessionStatus } from "@/modules/shared/components/session-checker"
import { useTranslations } from "next-intl"

interface BookingsClientProps {
  locale: string
}

export function BookingsClient({ locale }: BookingsClientProps) {
  const t = useTranslations()
  const { data: session, status } = useSession()
  const { isSessionExpired } = useSessionStatus()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadBookings() {
      if (status !== "authenticated" || isSessionExpired) return

      setLoading(true)
      setError(null)

      try {
        const data = await getUserBookings()
        setBookings(data)
      } catch (err) {
        console.error("Error al cargar reservas:", err)
        setError(err instanceof Error ? err.message : "Error al cargar las reservas")
      } finally {
        setLoading(false)
      }
    }

    loadBookings()
  }, [status, isSessionExpired])

  const handleSelectBooking = (booking: Booking) => {
    setSelectedBooking(booking)
  }

  const handleBackToList = () => {
    setSelectedBooking(null)
  }

  const handleBookingDeleted = (bookingId: number) => {
    setBookings(bookings.filter((booking) => booking.id_reserva !== bookingId))
    setSelectedBooking(null)
  }

  const handleTicketDeleted = (bookingId: number, ticketId: number) => {
    setBookings(
      bookings.map((booking) => {
        if (booking.id_reserva === bookingId) {
          return {
            ...booking,
            billetes: booking.billetes.filter((ticket) => ticket.id_billete !== ticketId),
          }
        }
        return booking
      }),
    )

    const updatedBooking = bookings.find((b) => b.id_reserva === bookingId)
    if (updatedBooking && updatedBooking.billetes.length <= 1) {
      setBookings(bookings.filter((b) => b.id_reserva !== bookingId))
      setSelectedBooking(null)
    } else if (selectedBooking && selectedBooking.id_reserva === bookingId) {
      const updated = bookings.find((b) => b.id_reserva === bookingId)
      if (updated) setSelectedBooking(updated)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center min-h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (status === "unauthenticated" || isSessionExpired) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("common.accessDenied")}</AlertTitle>
          <AlertDescription>{t("common.loginRequired")}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">{t("bookings.bookingsManagement")}</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {selectedBooking ? (
        <BookingDetails
          booking={selectedBooking}
          onBack={handleBackToList}
          onDelete={handleBookingDeleted}
          onTicketDelete={handleTicketDeleted}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{t("bookings.myBookings")}</CardTitle>
          </CardHeader>
          <CardContent>
            <BookingsList bookings={bookings} onSelectBooking={handleSelectBooking} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

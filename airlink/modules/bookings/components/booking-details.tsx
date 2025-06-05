import { useState } from "react"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Trash2, Loader2, Calendar, FileDown } from "lucide-react"
import { DeleteConfirmDialog } from "./delete-confirm-dialog"
import { useTranslations } from "next-intl"

import type { Booking } from "../types/booking-types"
import { deleteBooking, downloadBookingPDF } from "../services/booking"
import { TicketCard } from "./ticket-card"

interface BookingDetailsProps {
  booking: Booking
  onBack: () => void
  onDelete: (bookingId: number) => void
  onTicketDelete: (bookingId: number, ticketId: number) => void
}

export function BookingDetails({ booking, onBack, onDelete, onTicketDelete }: BookingDetailsProps) {
  const t = useTranslations()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false)

  const handleDeleteBooking = async () => {
    setIsDeleting(true)

    try {
      await deleteBooking(booking.id_reserva)
      onDelete(booking.id_reserva)
    } catch (err) {
      console.error("Error al eliminar la reserva:", err)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDownloadPDF = async () => {
    setIsDownloadingPDF(true)

    try {
      await downloadBookingPDF(booking.id_reserva)
    } catch (err) {
      console.error("Error al descargar el PDF de la reserva:", err)
    } finally {
      setIsDownloadingPDF(false)
    }
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-2 justify-between items-center">
        <Button variant="outline" onClick={onBack} className="flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("bookings.backToMyBookings")}
        </Button>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={handleDownloadPDF}
            disabled={isDownloadingPDF}
            className="flex items-center"
          >
            {isDownloadingPDF ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t("common.downloading")}
              </>
            ) : (
              <>
                <FileDown className="h-4 w-4 mr-2" />
                {t("booking.downloadPDF")}
              </>
            )}
          </Button>
          <Button variant="destructive" onClick={() => setShowDeleteDialog(true)} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t("common.deleting")}
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                {t("bookings.cancelBooking")}
              </>
            )}
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            {t("bookings.bookingDetails")} #{booking.id_reserva}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">{t("bookings.bookingDate")}</p>
              <p className="font-medium">
                {format(parseISO(booking.fecha_reserva), "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t("bookings.totalTickets")}</p>
              <p className="font-medium">{booking.billetes.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-xl font-semibold mb-4">{t("bookings.tickets")}</h2>
      <div className="space-y-4">
        {booking.billetes.map((ticket) => (
          <TicketCard
            key={ticket.id_billete}
            ticket={ticket}
            bookingId={booking.id_reserva}
            onDelete={onTicketDelete}
          />
        ))}
      </div>

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteBooking}
        title={t("bookings.confirmCancelBooking")}
        description={t("bookings.cancelBookingWarning")}
      />
    </>
  )
}

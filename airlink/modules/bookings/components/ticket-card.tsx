"use client"

import { useState } from "react"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Plane, User, CreditCard, Trash2, AlertCircle, Loader2 } from "lucide-react"
import { DeleteConfirmDialog } from "./delete-confirm-dialog"
import type { Ticket } from "../types/booking-types"
import { deleteTicket } from "../services/booking"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

interface TicketCardProps {
  ticket: Ticket
  bookingId: number
  onDelete: (bookingId: number, ticketId: number) => void
}

export function TicketCard({ ticket, bookingId, onDelete }: TicketCardProps) {
  const t = useTranslations()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const departureTime = ticket.vuelo?.fecha_salida ? parseISO(ticket.vuelo.fecha_salida) : new Date()
  const arrivalTime = ticket.vuelo?.fecha_llegada ? parseISO(ticket.vuelo.fecha_llegada) : new Date()

  const durationMs = arrivalTime.getTime() - departureTime.getTime()
  const durationHours = Math.floor(durationMs / (1000 * 60 * 60))
  const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))

  // Funciones para el estado del vuelo (solo programado y cancelado)
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

  const handleDeleteTicket = async () => {
    setIsDeleting(true)
    setError(null)

    try {
      console.log(`Eliminando billete ${ticket.id_billete} de la reserva ${bookingId}`)
      await deleteTicket(bookingId, ticket.id_billete)
      console.log("Billete eliminado exitosamente")

      // Mostrar notificación de éxito
      toast.success(t("bookings.ticketCancelledSuccessfully"))

      // Cerrar el diálogo de confirmación
      setShowDeleteDialog(false)

      // Llamar al callback para actualizar la UI padre
      onDelete(bookingId, ticket.id_billete)

      // Recargar la página
      window.location.reload()
    } catch (err) {
      console.error("Error al eliminar el billete:", err)
      setError(err instanceof Error ? err.message : "Error al eliminar el billete")
      toast.error(t("bookings.errorCancellingTicket"))
    } finally {
      // Siempre resetear el estado de carga
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Card>
        <CardContent className="p-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center mb-2 flex-wrap gap-2">
                <Plane className="h-5 w-5 mr-2 text-primary" />
                <h3 className="font-semibold">
                  {t("bookings.flight")} {ticket.vuelo.numero_vuelo}
                </h3>
                <span className="mx-2">·</span>
                <span className="text-sm">
                  {t("bookings.locator")}: {ticket.localizador}
                </span>
                <span className="mx-2">·</span>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(ticket.vuelo.estado_vuelo)}`}>
                  {getStatusText(ticket.vuelo.estado_vuelo)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-500">{t("bookings.departure")}</div>
                  <div className="font-medium">{format(departureTime, "HH:mm", { locale: es })}</div>
                  <div className="text-sm">{format(departureTime, "d MMM yyyy", { locale: es })}</div>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <div className="text-xs text-gray-500">
                    {durationHours}h {durationMinutes}m
                  </div>
                  <div className="relative w-full">
                    <div className="border-t border-gray-300 absolute w-full top-1/2"></div>
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                      <Plane className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">{t("bookings.direct")}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500">{t("bookings.arrival")}</div>
                  <div className="font-medium">{format(arrivalTime, "HH:mm", { locale: es })}</div>
                  <div className="text-sm">{format(arrivalTime, "d MMM yyyy", { locale: es })}</div>
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        {t("bookings.passengerInformation")}
                      </h4>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="text-gray-500">{t("common.name")}:</span> {ticket.pasajero?.nombre || "N/A"}{" "}
                          {ticket.pasajero?.apellidos || "N/A"}
                        </p>
                        <p>
                          <span className="text-gray-500">{t("common.email")}:</span> {ticket.pasajero?.email || "N/A"}
                        </p>
                        <p>
                          <span className="text-gray-500">{t("common.phone")}:</span>{" "}
                          {ticket.pasajero?.telefono || "N/A"}
                        </p>
                        <p>
                          <span className="text-gray-500">{t("common.nif")}:</span> {ticket.pasajero?.nif || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <CreditCard className="h-4 w-4 mr-2" />
                        {t("bookings.ticketDetails")}
                      </h4>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="text-gray-500">{t("bookings.seat")}:</span>{" "}
                          {ticket.asiento?.codigo_asiento || "N/A"}
                        </p>
                        <p>
                          <span className="text-gray-500">{t("bookings.class")}:</span>{" "}
                          {ticket.asiento?.clase === "business" ? t("bookings.business") : t("bookings.economy")}
                        </p>
                        <p>
                          <span className="text-gray-500">{t("common.price")}:</span>{" "}
                          {Number.parseFloat(ticket.precio).toFixed(2)} €
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col items-end space-y-2 w-full md:w-auto">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full md:w-auto min-h-[44px] text-sm md:text-base"
              >
                {isExpanded ? t("common.lessDetails") : t("common.moreDetails")}
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => setShowDeleteDialog(true)} 
                disabled={isDeleting}
                className="w-full md:w-auto min-h-[44px] text-sm md:text-base"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t("bookings.cancelling")}
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t("bookings.cancelTicket")}
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteTicket}
        title={t("bookings.confirmCancelTicket")}
        description={t("bookings.cancelTicketWarning")}
      />
    </>
  )
}
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Printer, Download, Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { downloadBookingPDF } from "@/modules/bookings/services/booking"

interface BookingConfirmationClientProps {
  locale: string
}

export function BookingConfirmationClient({ locale }: BookingConfirmationClientProps) {
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const t = useTranslations()
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false)

  useEffect(() => {
    try {
      const storedBookingId = sessionStorage.getItem("lastBookingId")

      if (!storedBookingId) {
        setError(`${t("booking.notInformation")}`)
        setLoading(false)
        return
      }

      setBookingId(storedBookingId)
      setLoading(false)
    } catch (err) {
      console.error(`${t("booking.errorLoadData")}`, err)
      setError(`${t("booking.errorLoadData")}`)
      setLoading(false)
    }
  }, [])

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = async () => {
    if (!bookingId) return

    setIsDownloadingPDF(true)
    try {
      await downloadBookingPDF(Number.parseInt(bookingId))
    } catch (err) {
      console.error("Error al descargar el PDF:", err)
      setError(err instanceof Error ? err.message : "Error al descargar el PDF de la reserva")
    } finally {
      setIsDownloadingPDF(false)
    }
  }

  const handleGoToHome = () => {
    router.push(`/${locale}/dashboard`)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4 text-center">
          <Button onClick={handleGoToHome}>`${t("booking.goToDashboard")}`</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold">{t("booking.successBooking")}</h1>
          <p className="text-gray-600 mt-2">{t("booking.successBookingDescription")}</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t("booking.bookingDetails")}</CardTitle>
            <CardDescription>{t("booking.bookingDetailsDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-md">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">{t("booking.bookingId")}</p>
                    <p className="font-bold">{bookingId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t("booking.bookingDate")}</p>
                    <p className="font-bold">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-md">
                <p className="text-blue-800">{t("booking.bookingDescription")}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <Button onClick={handlePrint} className="flex items-center">
                  <Printer className="mr-2 h-4 w-4" />
                  {t("booking.printConfirmation")}
                </Button>
                <Button
                  onClick={handleDownloadPDF}
                  variant="outline"
                  className="flex items-center"
                  disabled={isDownloadingPDF}
                >
                  {isDownloadingPDF ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("common.downloading")}
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      {t("booking.downloadPDF")}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button onClick={handleGoToHome} variant="outline">
            {t("booking.goToDashboard")}
          </Button>
        </div>
      </div>
    </div>
  )
}

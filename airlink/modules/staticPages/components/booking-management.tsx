"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, XCircle, Phone, Mail, Clock } from "lucide-react"

export function BookingManagement() {
  const t = useTranslations()

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">{t("bookingManagement.title")}</h1>
        <p className="text-lg text-muted-foreground">{t("bookingManagement.description")}</p>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              {t("bookingManagement.availableFeatures.title")}
            </CardTitle>
            <CardDescription>{t("bookingManagement.availableFeatures.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">{t("bookingManagement.availableFeatures.viewBookings.title")}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {t("bookingManagement.availableFeatures.viewBookings.description")}
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li>{t("bookingManagement.availableFeatures.viewBookings.feature1")}</li>
                <li>{t("bookingManagement.availableFeatures.viewBookings.feature2")}</li>
                <li>{t("bookingManagement.availableFeatures.viewBookings.feature3")}</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">{t("bookingManagement.availableFeatures.cancelBookings.title")}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {t("bookingManagement.availableFeatures.cancelBookings.description")}
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li>{t("bookingManagement.availableFeatures.cancelBookings.feature1")}</li>
                <li>{t("bookingManagement.availableFeatures.cancelBookings.feature2")}</li>
                <li>{t("bookingManagement.availableFeatures.cancelBookings.feature3")}</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">{t("bookingManagement.availableFeatures.downloadPdf.title")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("bookingManagement.availableFeatures.downloadPdf.description")}
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">{t("bookingManagement.availableFeatures.newBookings.title")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("bookingManagement.availableFeatures.newBookings.description")}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("bookingManagement.cancellationPolicy.title")}</CardTitle>
            <CardDescription>{t("bookingManagement.cancellationPolicy.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">{t("bookingManagement.cancellationPolicy.freeCancel.title")}</h4>
              <p className="text-sm text-muted-foreground">
                {t("bookingManagement.cancellationPolicy.freeCancel.description")}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">{t("bookingManagement.cancellationPolicy.process.title")}</h4>
              <p className="text-sm text-muted-foreground">
                {t("bookingManagement.cancellationPolicy.process.description")}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-yellow-800">{t("bookingManagement.cancellationPolicy.warning")}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("bookingManagement.contact.title")}</CardTitle>
            <CardDescription>{t("bookingManagement.contact.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">+34 678-323-040</p>
                  <p className="text-sm text-muted-foreground">{t("bookingManagement.contact.phone")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">info@airlink.com</p>
                  <p className="text-sm text-muted-foreground">{t("bookingManagement.contact.email")}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">{t("bookingManagement.contact.hours")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("Contact.weekdays")}: 8:00 - 22:00 | {t("Contact.weekends")}: 9:00 - 18:00
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

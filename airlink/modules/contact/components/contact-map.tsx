"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ContactMap() {
  const t = useTranslations("Contact")

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t("ourLocation")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[300px] rounded-md overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24278.5491964106!2d-3.594861390101631!3d40.47927687145943!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd4231d000000001%3A0x6e7725ea0f85ceef!2sAeropuerto%20Adolfo%20Su%C3%A1rez%20Madrid-Barajas!5e0!3m2!1ses!2ses!4v1748273838985!5m2!1ses!2ses"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación de AirBooking"
            className="rounded-md"
          ></iframe>
        </div>
        <p className="mt-4 text-muted-foreground">
          {t("addressLine1")}
          <br />
          {t("addressLine2")}
          <br />
          {t("addressLine3")}
        </p>
      </CardContent>
    </Card>
  )
}


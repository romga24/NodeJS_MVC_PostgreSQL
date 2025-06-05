"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Mail, Clock, Globe } from "lucide-react"

export function ContactInfo() {
  const t = useTranslations("Contact")

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t("contactInfo")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-start">
          <Phone className="h-5 w-5 mr-3 text-primary mt-0.5" />
          <div>
            <h3 className="font-medium">{t("phone")}</h3>
            <p className="text-muted-foreground">+34 912 345 678</p>
            <p className="text-muted-foreground">+34 912 345 679</p>
          </div>
        </div>

        <div className="flex items-start">
          <Mail className="h-5 w-5 mr-3 text-primary mt-0.5" />
          <div>
            <h3 className="font-medium">{t("email")}</h3>
            <p className="text-muted-foreground">info.airlinkvuelos@gmail.com</p>
          </div>
        </div>

        <div className="flex items-start">
          <Clock className="h-5 w-5 mr-3 text-primary mt-0.5" />
          <div>
            <h3 className="font-medium">{t("businessHours")}</h3>
            <p className="text-muted-foreground">{t("weekdays")}: 9:00 - 20:00</p>
            <p className="text-muted-foreground">{t("weekends")}: 10:00 - 18:00</p>
          </div>
        </div>

        <div className="flex items-start">
          <Globe className="h-5 w-5 mr-3 text-primary mt-0.5" />
          <div>
            <h3 className="font-medium">{t("socialMedia")}</h3>
            <div className="flex space-x-4 mt-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Twitter
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Facebook
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


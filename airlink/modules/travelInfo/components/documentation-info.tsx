"use client"

import { useTranslations } from "next-intl"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileText, AlertTriangle, CheckCircle } from "lucide-react"

export function DocumentationInfo() {
  const t = useTranslations("TravelInfo.documentation")

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">{t("title")}</h2>

      <p className="mb-4">{t("intro")}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-100 p-4 rounded-lg border border-sky-100">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-primary" />
            {t("nationalFlights")}
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t("nationalId")}</li>
            <li>{t("drivingLicense")}</li>
            <li>{t("passport")}</li>
          </ul>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg border border-sky-100">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-primary" />
            {t("internationalFlights")}
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t("validPassport")}</li>
            <li>{t("visa")}</li>
            <li>{t("returnTicket")}</li>
          </ul>
        </div>
      </div>

      <Alert className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{t("warning")}</AlertDescription>
      </Alert>

      <h3 className="text-xl font-semibold mb-4">{t("recommendationsTitle")}</h3>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>{t("recommendation1")}</li>
        <li>{t("recommendation2")}</li>
        <li>{t("recommendation3")}</li>
        <li>{t("recommendation4")}</li>
      </ul>

      <div className="bg-muted p-4 rounded-lg mb-6">
        <h4 className="font-semibold mb-2">{t("specialCasesTitle")}</h4>
        <p>{t("specialCasesDescription")}</p>
      </div>
      <div className="bg-green-50 p-4 rounded-lg border border-green-100">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
          {t("tipsTitle")}
        </h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>{t("tip1")}</li>
          <li>{t("tip2")}</li>
          <li>{t("tip3")}</li>
        </ul>
      </div>
    </div>
  )
}


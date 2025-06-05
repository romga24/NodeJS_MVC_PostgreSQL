"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SessionChecker } from "@/modules/shared/components/session-checker"
import { useTranslations } from "next-intl"

export default function AdminVuelosPage() {
  const t = useTranslations("common")

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <SessionChecker requiredRole="admin" />

      <h1 className="text-3xl font-bold mb-6 text-center">{t("adminActions")}</h1>

      <div className="flex flex-col space-y-4 max-w-sm mx-auto">
        <Button asChild>
          <Link href="/admin/vuelos/nuevo">{t("insertNewFlight")}</Link>
        </Button>
        <Button asChild>
          <Link href="/admin/vuelos/listadovuelos">{t("listFlights")}</Link>
        </Button>
      </div>
    </div>
  )
}

import { Button } from "@/components/ui/button"
import { SessionChecker } from "@/modules/shared/components/session-checker"
import Link from "next/link"
import { useTranslations } from "next-intl"  // <-- Importar el hook

export default function AdminDashboardPage() {
  const t = useTranslations("common")  // <-- Cargar traducciones de 'common'

  return (
    <div className="container mx-auto py-10">
      <SessionChecker requiredRole="admin" />

      <h1 className="text-3xl font-bold mb-6 text-center">{t("adminPanelTitle")}</h1>

      <div className="flex justify-center">
        <Button asChild>
          <Link href="/admin/vuelos">
            {t("flightSettings")}
          </Link>
        </Button>
      </div>
    </div>
  )
}

import { TravelInfo } from "@/modules/travelInfo/components/travel-info"
import { getTranslations } from "next-intl/server"

export default async function TravelInfoPage() {
  return <TravelInfo />
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "TravelInfo" })

  return {
    title: t("title"),
    description: t("description"),
  }
}

import { BookingManagement } from "@/modules/staticPages/components/booking-management"
import { getTranslations } from "next-intl/server"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return {
    title: t("bookingManagement.title"),
    description: t("bookingManagement.description"),
  }
}

export default function BookingManagementPage() {
  return <BookingManagement />
}

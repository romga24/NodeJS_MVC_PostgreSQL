import { BookingConfirmationPage } from "@/modules/booking/components/booking-confirmation-page"
import { use } from "react"

interface ConfirmationPageProps {
  params: Promise< {
    locale: string
  }>
}

export default async function ConfirmationPage({ params }: ConfirmationPageProps) {
  const { locale } = await params
	
  return <BookingConfirmationPage locale={locale} />
}

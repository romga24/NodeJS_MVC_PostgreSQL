import { BookingSuccessPage } from "@/modules/booking/components/booking-success-page"
import { use } from "react"

interface BookingSuccessPageProps {
  params: Promise< {
    locale: string
  }>
}

export default async function SuccessPage({ params }: BookingSuccessPageProps) {
  	const { locale } = await params
	
  return <BookingSuccessPage locale={locale} />
}

import { BookingsClient } from "@/modules/bookings/components/bookings-client"
import { use } from "react"

interface BookingsPageProps {
  params: Promise< {
    locale: string
  }>
}

export default async function BookingsPage({ params }: BookingsPageProps) {
  const { locale } = await params
	
  return <BookingsClient locale={locale} />
}

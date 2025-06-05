import { SeatSelectionClient } from "@/modules/seats/components/seat-selection-client"
import { use } from "react"

interface SeatSelectionPageProps {
  params: Promise<{
    locale: string
  }>
}

export default async function SeatSelectionPage({ params }: SeatSelectionPageProps) {
  	const { locale } = await params 
	
  return <SeatSelectionClient locale={locale} />
}

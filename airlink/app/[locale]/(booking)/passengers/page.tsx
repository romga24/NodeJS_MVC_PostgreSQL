import { PassengersClient } from "@/modules/passengers/components/passengers-client"
import { use } from "react"

interface PassengersPageProps {
  params: Promise< {
    locale: string
  }>
}

export default async function PassengersPage({ params }: PassengersPageProps) {
	const { locale } = await params
	
  return <PassengersClient locale={locale} />
}

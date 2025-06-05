import { SearchPageClient } from "@/modules/flights/components/search-page-client"
import { use } from "react"

interface SearchPageProps {
  params: Promise<{
    locale: string
  }>
}

export default async function SearchPage({ params }: SearchPageProps) {
  const { locale } = await params

  return <SearchPageClient locale={locale} />
}


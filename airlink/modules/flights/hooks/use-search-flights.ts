"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { searchFlights } from "@/modules/flights/services/flights"
import { Flight, SearchFlightsParams } from "../types/flights-types"

export function useSearchFlights() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [outboundFlights, setOutboundFlights] = useState<Flight[]>([])
  const [returnFlights, setReturnFlights] = useState<Flight[]>([])
  const router = useRouter()

  const searchAndNavigate = async (searchParams: SearchFlightsParams) => {
    setLoading(true)
    setError(null)

    try {
      console.log("Iniciando búsqueda de vuelos con parámetros:", searchParams)

      const results = await searchFlights(searchParams)
      console.log("Resultados de búsqueda:", results)

      if (results.ida) {
        setOutboundFlights(results.ida)
        sessionStorage.setItem("outboundFlights", JSON.stringify(results.ida))
      } else {
        setOutboundFlights([])
        sessionStorage.setItem("outboundFlights", JSON.stringify([]))
      }

      if (results.vuelta) {
        setReturnFlights(results.vuelta)
        sessionStorage.setItem("returnFlights", JSON.stringify(results.vuelta))
      } else {
        setReturnFlights([])
        sessionStorage.setItem("returnFlights", JSON.stringify([]))
      }

      sessionStorage.setItem("searchParams", JSON.stringify(searchParams))

      const locale = searchParams.locale || "es"
      router.push(`/${locale}/search`)
    } catch (err) {
      console.error("Error en la búsqueda de vuelos:", err)

      if (err instanceof Error) {
        setError(`Error al buscar vuelos: ${err.message}`)
      } else {
        setError("Error al buscar vuelos. Por favor, inténtelo de nuevo.")
      }
    } finally {
      setLoading(false)
    }
  }

  const getStoredFlights = () => {
    if (typeof window !== "undefined") {
      const storedOutbound = sessionStorage.getItem("outboundFlights")
      const storedReturn = sessionStorage.getItem("returnFlights")
      const storedParams = sessionStorage.getItem("searchParams")

      return {
        outboundFlights: storedOutbound ? JSON.parse(storedOutbound) : [],
        returnFlights: storedReturn ? JSON.parse(storedReturn) : [],
        searchParams: storedParams ? JSON.parse(storedParams) : null,
      }
    }

    return {
      outboundFlights: [],
      returnFlights: [],
      searchParams: null,
    }
  }

  return {
    loading,
    error,
    outboundFlights,
    returnFlights,
    searchAndNavigate,
    getStoredFlights,
  }
}


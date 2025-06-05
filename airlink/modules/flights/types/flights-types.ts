import type { Aircraft, Airline, Airport } from "@/modules/shared/types/shared-types"

export interface Flight {
  numero_vuelo: string
  fecha_salida: string
  fecha_llegada: string
  precio_vuelo: number
  aeropuerto_origen: Airport
  aeropuerto_destino: Airport
  avion: Aircraft
  aerolinea: Airline
  precio_total_ida: number | null
  precio_total_vuelta: number | null
}

export interface FlightLeg {
  numero_vuelo: string
  from: string
  to: string
  departureDate: string
  departureTime: string
  arrivalDate: string
  arrivalTime: string
  price: {
    economy: number
    business: number
  }
}

export interface SearchFlightsParams {
  locale: string
  originCode: string
  destinationCode: string
  departureDate: string
  returnDate?: string
  passengers: number
  tripType: "roundTrip" | "oneWay"
}

export interface FlightSearchParams {
  tripType: string
  origin: string
  destination: string
  departureDate: string
  returnDate: string | null
  passengers: string
}

import { getAuthHeaders } from "@/lib/auth-utils"
import type { Seat } from "../types/seat-types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "https://nodejs-mysql-mdzc.onrender.com"

function normalizeSeatData(seat: any): Seat {
  // Mapear el estado "reservado" a "ocupado" para compatibilidad
  let estado = seat.estado || "disponible"
  if (estado === "reservado") {
    estado = "ocupado"
  }

  return {
    id_asiento: seat.id_asiento || `seat-${Math.random().toString(36).substring(2, 9)}`,
    codigo_asiento: seat.codigo_asiento || "N/A",
    fila: seat.fila || 0,
    columna: seat.columna || "A",
    clase: seat.clase || "economy",
    estado: estado, // Usamos el estado mapeado
    precio:
      seat.clase === "business" || seat.clase === "Business" ? 50 : typeof seat.precio === "number" ? seat.precio : 0,
    id_avion: seat.id_avion || "",
    numero_vuelo: seat.numero_vuelo || "",
  }
}

export async function getFlightSeats(flightNumber: string): Promise<Seat[]> {
  try {
    console.log(`Obteniendo asientos para el vuelo ${flightNumber}...`)

    const url = `${API_BASE_URL}/api/asientos/vuelo/${flightNumber}`
    console.log("URL de solicitud de asientos:", url)

    const response = await fetch(url, {
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Error al obtener asientos: ${response.status} ${response.statusText}`, errorText)
      return []
    }

    const responseText = await response.text()
    console.log("Respuesta de asientos (primeros 200 caracteres):", responseText.substring(0, 200))

    let data
    try {
      data = JSON.parse(responseText)
      console.log("Tipo de datos recibidos:", typeof data)
      console.log("Es array:", Array.isArray(data))

      if (typeof data === "object" && data !== null) {
        console.log("Claves del objeto:", Object.keys(data))
      }
    } catch (parseError) {
      console.error("Error al parsear la respuesta JSON:", parseError)
      return []
    }

    let seatsArray: any[] = []

    if (data && data.distribucion_asientos && Array.isArray(data.distribucion_asientos)) {
      data.distribucion_asientos.forEach((row: any) => {
        if (row.asientos && Array.isArray(row.asientos)) {
          seatsArray = [...seatsArray, ...row.asientos]
        }
      })
    } else if (Array.isArray(data)) {
      seatsArray = data
    } else if (data && typeof data === "object") {
      for (const key in data) {
        if (Array.isArray(data[key])) {
          seatsArray = data[key]
          break
        }
      }

      if (seatsArray.length === 0 && data.asientos) {
        seatsArray = Array.isArray(data.asientos) ? data.asientos : [data.asientos]
      }
    }

    // Añadir logs para depuración
    console.log("Muestra de asientos recibidos:", seatsArray.slice(0, 3))
    console.log("Estados de asientos encontrados:", [...new Set(seatsArray.map((s) => s.estado))].filter(Boolean))

    const normalizedSeats = seatsArray.map((seat) => normalizeSeatData(seat))

    console.log(`Se procesaron ${normalizedSeats.length} asientos para el vuelo ${flightNumber}`)
    return normalizedSeats
  } catch (error) {
    console.error("Error al obtener asientos del vuelo:", error)
    return []
  }
}

export async function reserveSeats(flightNumber: string, seatIds: string[]): Promise<boolean> {
  try {
    console.log(`Reservando asientos para el vuelo ${flightNumber}:`, seatIds)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    return true
  } catch (error) {
    console.error("Error al reservar asientos:", error)
    throw error
  }
}

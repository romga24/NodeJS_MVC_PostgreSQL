import { Flight } from "../types/flights-types"

const API_BASE_URL_1 = "https://nodejs-mysql-railway-5qgv.onrender.com/api"
const API_BASE_URL_2 = "https://nodejs-mysql-mdzc.onrender.com/api"

interface TicketInfoResponse {
  success: boolean
  data: {
    billete: {
      localizador: string
      precio: string
    }
    reserva: {
      fecha: string
    }
    pasajero: {
      nombre: string
      apellidos: string
      email: string
      telefono: string
      nif: string
    }
    vuelo: {
      numero: string
      fecha_salida: string
      fecha_llegada: string
      precio_vuelo: number
      aerolinea: string
      avion: string
      origen: {
        aeropuerto: string
        ciudad: string
        pais: string
      }
      destino: {
        aeropuerto: string
        ciudad: string
        pais: string
      }
    }
    asiento: {
      codigo: string
      clase: string
      estado: string
    }
  }
}

export async function getTicketInfo(localizador: string, apellido: string): Promise<TicketInfoResponse> {
  try {
    const queryParams = new URLSearchParams()
    queryParams.append("localizador", localizador)
    queryParams.append("apellido", apellido)

    try {
      const url = `${API_BASE_URL_1}/billetes/obtener-info-vuelo?${queryParams.toString()}`
      console.log("Consultando información del billete (URL 1):", url)

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Error al obtener información del billete: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error1) {
      console.error("Error con la primera URL para información del billete:", error1)

      const url = `${API_BASE_URL_2}/billetes/obtener-info-vuelo?${queryParams.toString()}`
      console.log("Consultando información del billete (URL 2):", url)

      const response = await fetch(url)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error al obtener información del billete:", errorText)
        throw new Error(`Error al obtener información del billete: ${response.status}`)
      }

      const data = await response.json()
      return data
    }
  } catch (error) {
    console.error("Error al obtener información del billete:", error)
    throw error
  }
}

export function getFlightDetailedInfo(flight: Flight) {

  return {
    vuelo: flight,
    servicios: [
      "Wifi a bordo (de pago)",
      "Comida incluida",
      "Entretenimiento a bordo",
      "Toma de corriente en asientos",
    ],
    equipaje: {
      mano: "1 pieza de hasta 10kg",
      facturado: "1 pieza de hasta 23kg",
    },
  }
}


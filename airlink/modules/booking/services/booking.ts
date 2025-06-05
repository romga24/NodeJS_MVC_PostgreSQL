import { getAuthHeaders } from "@/lib/auth-utils"
import type { BookingData } from "../types/booking-types"

interface BookingResponse {
  success: boolean
  bookingId?: string
  error?: string
  warning?: string
}

export async function createBooking(bookingData: BookingData): Promise<BookingResponse> {
  try {
    console.log("Creando reserva:", bookingData)

    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")

    if (!apiUrl) {
      throw new Error("URL de API no configurada (NEXT_PUBLIC_API_URL)")
    }

    const requestData = {
      codigo_vuelo_ida: bookingData.outboundFlight.numero_vuelo,
      codigo_vuelo_vuelta: bookingData.returnFlight?.numero_vuelo,
      pasajeros: bookingData.passengers.map((p) => ({
        nombre: p.firstName,
        apellidos: p.lastName,
        email: bookingData.contactInfo.email,
        telefono: bookingData.contactInfo.phone,
        nif: p.documentNumber,
        ida: bookingData.outboundSeats.find((seat) => seat.codigo_asiento === p.seatOutbound)
          ? {
              fila: bookingData.outboundSeats.find((seat) => seat.codigo_asiento === p.seatOutbound)?.fila,
              columna: bookingData.outboundSeats.find((seat) => seat.codigo_asiento === p.seatOutbound)?.columna,
              codigo_asiento: p.seatOutbound,
              precio: bookingData.outboundFlight.precio_total_ida || 0,
            }
          : undefined,
        vuelta:
          bookingData.returnFlight &&
          p.seatReturn &&
          bookingData.returnSeats.find((seat) => seat.codigo_asiento === p.seatReturn)
            ? {
                fila: bookingData.returnSeats.find((seat) => seat.codigo_asiento === p.seatReturn)?.fila,
                columna: bookingData.returnSeats.find((seat) => seat.codigo_asiento === p.seatReturn)?.columna,
                codigo_asiento: p.seatReturn,
                precio: bookingData.returnFlight.precio_total_vuelta || 0,
              }
            : undefined,
				})),
			}

    const url = `${apiUrl}/api/reservas/realizar-reserva`
    console.log("Intentando crear reserva en:", url)
    console.log("Datos de la solicitud:", JSON.stringify(requestData, null, 2))

    const response = await fetch(url, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(requestData),
    })

    const responseText = await response.text()
    console.log("Respuesta de la API (texto):", responseText)

    if (!response.ok) {
      console.error(`Error al crear reserva: ${response.status}`, responseText)

      if (response.status === 500) {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const possibleIdMatch =
          responseText.match(/reservaId["\s:]+(\d+)/i) ||
          responseText.match(/id_reserva["\s:]+(\d+)/i) ||
          responseText.match(/localizador["\s:]+"([^"]+)"/i)

        if (possibleIdMatch && possibleIdMatch[1]) {
          console.log("Se encontró un posible ID de reserva en la respuesta de error:", possibleIdMatch[1])
          return {
            success: true,
            bookingId: possibleIdMatch[1],
            warning:
              "La reserva parece haberse creado a pesar del error 500. El correo de confirmación podría no haberse enviado.",
          }
        }
      }

      return {
        success: false,
        error: `Error ${response.status}: ${responseText.substring(0, 200)}...`,
      }
    }

    let data
    try {
      data = JSON.parse(responseText)
      console.log("Respuesta de la API (JSON):", data)
    } catch (parseError) {
      console.error("Error al parsear la respuesta JSON:", parseError)

      const possibleIdMatch =
        responseText.match(/reservaId["\s:]+(\d+)/i) ||
        responseText.match(/id_reserva["\s:]+(\d+)/i) ||
        responseText.match(/localizador["\s:]+"([^"]+)"/i)

      if (possibleIdMatch && possibleIdMatch[1]) {
        console.log("Se encontró un posible ID de reserva en la respuesta no-JSON:", possibleIdMatch[1])
        return {
          success: true,
          bookingId: possibleIdMatch[1],
          warning: "La reserva parece haberse creado, pero la respuesta no es JSON válido.",
        }
      }

      return {
        success: false,
        error: `Error al parsear la respuesta: ${responseText.substring(0, 200)}...`,
      }
    }

    const bookingId =
      data.id_reserva ||
      data.localizador ||
      (data.reserva && (data.reserva.reservaId || data.reserva.id)) ||
      data.id ||
      (data.message && data.message.match(/reserva.*?(\d+)/i)?.[1])

    if (!bookingId) {
      console.error("No se pudo extraer el ID de reserva de la respuesta:", data)
      return {
        success: false,
        error: "No se pudo extraer el ID de reserva de la respuesta",
      }
    }

    return {
      success: true,
      bookingId: bookingId.toString(),
    }
  } catch (error) {
    console.error("Error al crear la reserva:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    }
  }
}

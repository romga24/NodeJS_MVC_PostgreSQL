import type { Booking } from "../types/booking-types"
import type { BookingsResponse } from "../types/booking-types"
import { getAuthToken } from "@/lib/auth-utils"

export async function getUserBookings(): Promise<Booking[]> {
  try {
    const token = getAuthToken()

    if (!token) {
      throw new Error("No autenticado")
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")
    if (!apiUrl) {
      throw new Error("URL de API no configurada")
    }

    const response = await fetch(`${apiUrl}/api/reservas/mis-reservas`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`)
    }

    const data: BookingsResponse = await response.json()
    return data.reservas || []
  } catch (error) {
    console.error("Error al obtener las reservas:", error)
    throw error
  }
}

export async function deleteBooking(bookingId: number): Promise<void> {
  try {
    const token = getAuthToken()

    if (!token) {
      throw new Error("No autenticado")
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")
    if (!apiUrl) {
      throw new Error("URL de API no configurada")
    }

    const response = await fetch(`${apiUrl}/api/reservas/${bookingId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`)
    }
  } catch (error) {
    console.error(`Error al eliminar la reserva ${bookingId}:`, error)
    throw error
  }
}

export async function deleteTicket(bookingId: number, ticketId: number): Promise<void> {
  try {
    const token = getAuthToken()

    if (!token) {
      throw new Error("No autenticado")
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")
    if (!apiUrl) {
      throw new Error("URL de API no configurada")
    }

    const response = await fetch(`${apiUrl}/api/reservas/${bookingId}/billetes/${ticketId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`)
    }
  } catch (error) {
    console.error(`Error al eliminar el billete ${ticketId} de la reserva ${bookingId}:`, error)
    throw error
  }
}

export async function downloadBookingPDF(bookingId: number): Promise<void> {
  try {
    const token = getAuthToken()

    if (!token) {
      throw new Error("No autenticado")
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")
    if (!apiUrl) {
      throw new Error("URL de API no configurada")
    }

    // Realizar la solicitud a la API para obtener el PDF
    const response = await fetch(`${apiUrl}/api/reservas/${bookingId}/pdf`, {
      method: "GET",
      headers: {
        Accept: "application/pdf",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      // Intentar obtener el mensaje de error si está disponible
      let errorMessage = `Error ${response.status}: ${response.statusText}`
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorMessage
      } catch (e) {
        // Si no se puede parsear como JSON, usar el mensaje de error por defecto
      }
      throw new Error(errorMessage)
    }

    // Obtener el blob del PDF
    const blob = await response.blob()

    // Crear una URL para el blob
    const url = window.URL.createObjectURL(blob)

    // Crear un elemento <a> para descargar el archivo
    const a = document.createElement("a")
    a.href = url
    a.download = `reserva-${bookingId}.pdf`
    document.body.appendChild(a)
    a.click()

    // Limpiar
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (error) {
    console.error(`Error al descargar el PDF de la reserva ${bookingId}:`, error)
    throw error
  }
}

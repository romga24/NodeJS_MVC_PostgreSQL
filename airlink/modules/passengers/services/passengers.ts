import type { Passenger } from "../types/passenger-types"
import type { BookingData } from "@/modules/booking/types/booking-types"
import { createBooking as createBookingFromBookingModule } from "@/modules/booking/services/booking"

const API_BASE_URL = "https://nodejs-mysql-mdzc.onrender.com/api"

export async function savePassengerInfo(passengers: Passenger[]): Promise<boolean> {
  try {
    console.log("Guardando información de pasajeros:", passengers)

    // Guardar en sessionStorage
    sessionStorage.setItem("passengers", JSON.stringify(passengers))

    return true
  } catch (error) {
    console.error("Error al guardar información de pasajeros:", error)
    throw error
  }
}

export function getPassengerInfo(): Passenger[] {
  try {
    const storedPassengers = sessionStorage.getItem("passengers")
    if (storedPassengers) {
      return JSON.parse(storedPassengers)
    }
    return []
  } catch (error) {
    console.error("Error al obtener información de pasajeros:", error)
    return []
  }
}

// Usar la función del módulo booking para evitar duplicación
export async function createBooking(
  bookingData: BookingData,
): Promise<{ success: boolean; bookingId?: string; error?: string; warning?: string }> {
  // Redirigir a la implementación en el módulo booking
  return createBookingFromBookingModule(bookingData)
}

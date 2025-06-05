import { Airport } from "@/modules/shared/types/shared-types"

const API_BASE_URL = "https://nodejs-mysql-mdzc.onrender.com"

export async function getAirports(): Promise<Airport[]> {
  console.log("Obteniendo lista de aeropuertos...")

  const attempts = [
    async () => {
      const url = `${API_BASE_URL}/api/aeropuertos`
      console.log("Intento 1 - GET /api/aeropuertos:", url)

      const response = await fetch(url)
      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error en intento 1:", errorText)
        throw new Error(`Error en intento 1: ${response.status} - ${errorText}`)
      }

      return await response.json()
    },

    async () => {
      const url = `${API_BASE_URL}/aeropuertos`
      console.log("Intento 2 - GET /aeropuertos:", url)

      const response = await fetch(url)
      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error en intento 2:", errorText)
        throw new Error(`Error en intento 2: ${response.status} - ${errorText}`)
      }

      return await response.json()
    },

    async () => {
      const url = `${API_BASE_URL}/api/v1/aeropuertos`
      console.log("Intento 3 - GET /api/v1/aeropuertos:", url)

      const response = await fetch(url)
      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error en intento 3:", errorText)
        throw new Error(`Error en intento 3: ${response.status} - ${errorText}`)
      }

      return await response.json()
    },
  ]

  const errors: Error[] = []
  for (const attempt of attempts) {
    try {
      const result = await attempt()
      console.log("Intento exitoso, aeropuertos obtenidos:", result.length)
      return result
    } catch (error) {
      console.error("Intento fallido:", error)
      errors.push(error instanceof Error ? error : new Error(String(error)))
    }
  }

  const errorDetails = errors.map((e, i) => `Intento ${i + 1}: ${e.message}`).join("\n")
  throw new Error(`Todos los intentos fallaron:\n${errorDetails}`)
}

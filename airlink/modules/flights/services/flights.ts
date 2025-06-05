import { Flight, SearchFlightsParams } from "../types/flights-types";

const API_BASE_URL = "https://nodejs-mysql-mdzc.onrender.com"

export async function searchFlights(params: SearchFlightsParams): Promise<{ ida: Flight[]; vuelta: Flight[] }> {
  console.log("searchFlights service called with params:", params)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || API_BASE_URL

  try {
    const attempts = [
      async () => {
        const requestBody: {
          codigo_origen: string
          codigo_destino: string
          fecha_ida: string
          numero_pasajeros: number
          fecha_vuelta?: string
        } = {
          codigo_origen: params.originCode,
          codigo_destino: params.destinationCode,
          fecha_ida: params.departureDate,
          numero_pasajeros: params.passengers,
        }

        if (params.tripType === "roundTrip" && params.returnDate) {
          requestBody.fecha_vuelta = params.returnDate
        }

        const url = `${apiUrl}/api/vuelos/buscador-vuelos`
        console.log(`Intento 1 - POST con formato YYYY-MM-DD:`, requestBody)

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(requestBody),
        })

        const contentType = response.headers.get("content-type")
        console.log("Content-Type de la respuesta:", contentType)

        const responseText = await response.text()
        console.log("Respuesta en texto plano:", responseText.substring(0, 500))

        if (!response.ok) {
          console.error(`Error en intento 1: ${response.status} - ${responseText}`)
          throw new Error(`Error en intento 1: ${response.status} - ${responseText}`)
        }

        let responseData
        try {
          responseData = JSON.parse(responseText)
        } catch (e) {
          console.error("Error al parsear la respuesta como JSON:", e)
          throw new Error(`Respuesta no es JSON válido: ${responseText.substring(0, 100)}...`)
        }

        console.log("Respuesta completa del servidor (Intento 1):", responseData)
        console.log("Contenido de ida:", responseData.ida)
        console.log("Contenido de vuelta:", responseData.vuelta)
        console.log("Tipo de datos de ida:", Array.isArray(responseData.ida) ? "Array" : typeof responseData.ida)
        console.log(
          "Tipo de datos de vuelta:",
          Array.isArray(responseData.vuelta) ? "Array" : typeof responseData.vuelta,
        )

        if (responseData.error || responseData.message) {
          console.warn("Mensaje del servidor:", responseData.error || responseData.message)
        }

        return responseData
      },

      async () => {
        const formatDate = (dateStr: string) => {
          const [year, month, day] = dateStr.split("-")
          return `${day}/${month}/${year}`
        }

        const requestBody: {
          codigo_origen: string
          codigo_destino: string
          fecha_ida: string
          numero_pasajeros: number
          fecha_vuelta?: string
        } = {
          codigo_origen: params.originCode,
          codigo_destino: params.destinationCode,
          fecha_ida: formatDate(params.departureDate),
          numero_pasajeros: params.passengers,
        }

        if (params.tripType === "roundTrip" && params.returnDate) {
          requestBody.fecha_vuelta = formatDate(params.returnDate)
        }

        const url = `${apiUrl}/api/vuelos/buscador-vuelos`
        console.log(`Intento 2 - POST con formato DD/MM/YYYY:`, requestBody)

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(requestBody),
        })

        const contentType = response.headers.get("content-type")
        console.log("Content-Type de la respuesta:", contentType)

        const responseText = await response.text()
        console.log("Respuesta en texto plano:", responseText.substring(0, 500))

        if (!response.ok) {
          console.error(`Error en intento 2: ${response.status} - ${responseText}`)
          throw new Error(`Error en intento 2: ${response.status} - ${responseText}`)
        }

        let responseData
        try {
          responseData = JSON.parse(responseText)
        } catch (e) {
          console.error("Error al parsear la respuesta como JSON:", e)
          throw new Error(`Respuesta no es JSON válido: ${responseText.substring(0, 100)}...`)
        }

        console.log("Respuesta completa del servidor (Intento 2):", responseData)
        console.log("Contenido de ida:", responseData.ida)
        console.log("Contenido de vuelta:", responseData.vuelta)

        if (responseData.error || responseData.message) {
          console.warn("Mensaje del servidor:", responseData.error || responseData.message)
        }

        return responseData
      },

      async () => {
        const today = new Date()
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        const dayAfterTomorrow = new Date(today)
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2)

        const formatDateToYYYYMMDD = (date: Date) => {
          return date.toISOString().split("T")[0]
        }

        const requestBody: {
          codigo_origen: string
          codigo_destino: string
          fecha_ida: string
          numero_pasajeros: number
          fecha_vuelta?: string
        } = {
          codigo_origen: params.originCode,
          codigo_destino: params.destinationCode,
          fecha_ida: formatDateToYYYYMMDD(tomorrow),
          numero_pasajeros: params.passengers,
        }

        if (params.tripType === "roundTrip") {
          requestBody.fecha_vuelta = formatDateToYYYYMMDD(dayAfterTomorrow)
        }

        const url = `${apiUrl}/api/vuelos/buscador-vuelos`
        console.log(`Intento 3 - POST con fechas cercanas:`, requestBody)

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(requestBody),
        })

        const contentType = response.headers.get("content-type")
        console.log("Content-Type de la respuesta:", contentType)

        const responseText = await response.text()
        console.log("Respuesta en texto plano:", responseText.substring(0, 500))

        if (!response.ok) {
          console.error(`Error en intento 3: ${response.status} - ${responseText}`)
          throw new Error(`Error en intento 3: ${response.status} - ${responseText}`)
        }

        let responseData
        try {
          responseData = JSON.parse(responseText)
        } catch (e) {
          console.error("Error al parsear la respuesta como JSON:", e)
          throw new Error(`Respuesta no es JSON válido: ${responseText.substring(0, 100)}...`)
        }

        console.log("Respuesta completa del servidor (Intento 3):", responseData)
        console.log("Contenido de ida:", responseData.ida)
        console.log("Contenido de vuelta:", responseData.vuelta)

        if (responseData.error || responseData.message) {
          console.warn("Mensaje del servidor:", responseData.error || responseData.message)
        }

        return responseData
      },

      async () => {
        const queryParams = new URLSearchParams({
          codigo_origen: params.originCode,
          codigo_destino: params.destinationCode,
          fecha_ida: params.departureDate,
          numero_pasajeros: params.passengers.toString(),
        })

        if (params.tripType === "roundTrip" && params.returnDate) {
          queryParams.append("fecha_vuelta", params.returnDate)
        }

        const url = `${apiUrl}/api/vuelos/buscador-vuelos?${queryParams.toString()}`
        console.log(`Intento 4 - GET con parámetros de consulta:`, url)

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        })

        const contentType = response.headers.get("content-type")
        console.log("Content-Type de la respuesta:", contentType)

        const responseText = await response.text()
        console.log("Respuesta en texto plano:", responseText.substring(0, 500))

        if (!response.ok) {
          console.error(`Error en intento 4: ${response.status} - ${responseText}`)
          throw new Error(`Error en intento 4: ${response.status} - ${responseText}`)
        }

        let responseData
        try {
          responseData = JSON.parse(responseText)
        } catch (e) {
          console.error("Error al parsear la respuesta como JSON:", e)
          throw new Error(`Respuesta no es JSON válido: ${responseText.substring(0, 100)}...`)
        }

        console.log("Respuesta completa del servidor (Intento 4):", responseData)
        console.log("Contenido de ida:", responseData.ida)
        console.log("Contenido de vuelta:", responseData.vuelta)

        if (responseData.error || responseData.message) {
          console.warn("Mensaje del servidor:", responseData.error || responseData.message)
        }

        return responseData
      },
    ]

    const errors = []
    for (const attempt of attempts) {
      try {
        const result = await attempt()

        if (result && (Array.isArray(result.ida) || Array.isArray(result.vuelta))) {
          if ((!result.ida || result.ida.length === 0) && (!result.vuelta || result.vuelta.length === 0)) {
            console.warn("La API respondió correctamente pero no se encontraron vuelos")
          }

          return {
            ida: Array.isArray(result.ida) ? result.ida : [],
            vuelta: Array.isArray(result.vuelta) ? result.vuelta : [],
          }
        } else {
          console.warn("La respuesta no tiene la estructura esperada:", result)
          errors.push("Respuesta con formato incorrecto")
        }
      } catch (error) {
        console.error("Intento fallido:", error)
        errors.push(error instanceof Error ? error.message : String(error))
      }
    }

    console.error("Todos los intentos fallaron:", errors)
    console.warn("Devolviendo arrays vacíos")
    return { ida: [], vuelta: [] }
  } catch (error) {
    console.error("Error general al buscar vuelos:", error)
    console.warn("Devolviendo arrays vacíos debido a un error")
    return { ida: [], vuelta: [] }
  }
}

export async function getFlightDetails(flightNumber: string): Promise<Flight> {
  const possiblePaths = [`/api/vuelos/${flightNumber}`]

  let lastError = null

  for (const path of possiblePaths) {
    try {
      const url = `${API_BASE_URL}${path}`
      console.log(`Intentando obtener detalles del vuelo: ${url}`)

      const response = await fetch(url)

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Error con ${path}:`, errorText)
        lastError = new Error(`Error con ${path}: ${response.status} - ${errorText}`)
        continue
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error(`Error con ${path}:`, error)
      lastError = error
    }
  }

  throw lastError || new Error("No se pudo obtener detalles del vuelo")
}


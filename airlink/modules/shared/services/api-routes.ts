/**
 * Obtiene la URL base de la API
 */
export function getApiBaseUrl(): string {
  // Intentar obtener la URL de la API desde las variables de entorno
  const envApiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")

  if (envApiUrl) {
    console.log("Usando URL de API desde variables de entorno:", envApiUrl)
    return envApiUrl
  }

  // Si no está definida, usar la URL base actual
  if (typeof window !== "undefined") {
    // En el cliente, usar la URL base actual
    const origin = window.location.origin
    console.log("Usando URL base actual como URL de API:", origin)
    return origin
  }

  // Fallback para SSR
  console.log("Fallback: Usando URL de API predeterminada")
  return "https://nodejs-mysql-mdzc.onrender.com"
}

/**
 * Verifica si una respuesta es JSON
 */
export function isJsonResponse(response: Response): boolean {
  const contentType = response.headers.get("content-type")
  return Boolean(contentType && contentType.includes("application/json"))
}

/**
 * Maneja errores de respuesta HTTP
 */
export async function handleApiError(response: Response): Promise<string> {
  let errorMessage = `Error ${response.status}: ${response.statusText}`

  try {
    if (isJsonResponse(response)) {
      const errorData = await response.json()
      errorMessage = errorData.message || errorMessage
    }
  } catch (error) {
    console.error("Error al analizar la respuesta de error:", error)
  }

  return errorMessage
}

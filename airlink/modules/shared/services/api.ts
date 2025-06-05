/**
 * Obtiene la URL base de la API
 */
export function getApiBaseUrl(): string {
  // Primero intentamos obtener la URL de la API desde las variables de entorno
  let apiUrl = process.env.NEXT_PUBLIC_API_URL

  // Si no está definida, usamos la URL base actual
  if (!apiUrl) {
    // En desarrollo, podríamos usar una URL específica
    if (process.env.NODE_ENV === "development") {
      apiUrl = "http://localhost:3000"
    } else {
      // En producción, usamos la URL actual
      apiUrl = window.location.origin
    }
  }

  // Eliminamos cualquier barra final
  return apiUrl.replace(/\/$/, "")
}

/**
 * Verifica si una respuesta es JSON
 */
export function isJsonResponse(response: Response): boolean {
  const contentType = response.headers.get("content-type")
  return contentType !== null && contentType.includes("application/json")
}

/**
 * Maneja errores de respuesta HTTP
 */
export async function handleApiError(response: Response): Promise<{ message: string }> {
  if (isJsonResponse(response)) {
    try {
      const errorData = await response.json()
      return {
        message: errorData.message || `Error ${response.status}: ${response.statusText}`,
      }
    } catch (error) {
      return {
        message: `Error ${response.status}: ${response.statusText}`,
      }
    }
  }

  return {
    message: `Error ${response.status}: ${response.statusText}`,
  }
}

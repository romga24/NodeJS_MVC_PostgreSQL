interface RegisterData {
  nombre: string
  apellidos: string
  email: string
  telefono: string
  nif: string
  nombre_usuario: string
  contraseña: string
}

interface RegisterResponse {
  success: boolean
  message?: string
  data?: any
  error?: string
}

// Modificar la función registerUser para asegurarnos de que siempre use el prefijo /api/
export async function registerUser(userData: RegisterData): Promise<RegisterResponse> {
  console.log("Iniciando registro con datos:", { ...userData, contraseña: "***" })

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")
    if (!apiUrl) {
      return {
        success: false,
        message: "URL de API no configurada",
      }
    }

    // Modificamos para usar siempre el prefijo /api/
    const endpoint = "/api/clientes"

    try {
      console.log(`Intentando endpoint: ${apiUrl}${endpoint}`)

      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json()
          return {
            success: false,
            message: errorData.message || `Error ${response.status}: ${response.statusText}`,
            data: errorData,
          }
        } else {
          const text = await response.text()
          return {
            success: false,
            message: `Error ${response.status}: ${response.statusText}`,
            error: text.substring(0, 500),
          }
        }
      }

      const data = await response.json()
      return {
        success: true,
        message: data.message || "Registro exitoso",
        data,
      }
    } catch (error) {
      console.error(`Error con endpoint ${endpoint}:`, error)
      return {
        success: false,
        message: "Error de conexión con el servidor",
        error: error instanceof Error ? error.message : String(error),
      }
    }
  } catch (error) {
    console.error("Error al realizar la solicitud de registro:", error)
    return {
      success: false,
      message: "Error de conexión con el servidor",
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

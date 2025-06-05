import { storeAuthToken } from "./login"
import { setAuthToken } from "@/lib/auth-utils"

interface SendCodeRequest {
  emailOUsuario: string
}

interface VerifyCodeRequest {
  codigo: string
}

interface ResetPasswordRequest {
  nueva_contrasena: string
}

interface ApiResponse {
  success: boolean
  message?: string
  token?: string
}

/**
 * Envía una solicitud para generar un código de recuperación de contraseña
 */
export async function sendRecoveryCode(data: SendCodeRequest): Promise<ApiResponse> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")
    console.log("Enviando solicitud para recuperar contraseña:", data)

    const response = await fetch(`${apiUrl}/api/clientes/enviar-codigo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    console.log("Respuesta recibida:", response.status, response.statusText)

    // Manejo de errores mejorado
    if (!response.ok) {
      let errorMessage = `Error ${response.status}: ${response.statusText}`

      try {
        // Intentar obtener el mensaje de error del cuerpo de la respuesta
        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        }
      } catch (parseError) {
        console.error("Error al analizar la respuesta de error:", parseError)
      }

      return {
        success: false,
        message: errorMessage,
      }
    }

    // Intentar analizar la respuesta como JSON
    try {
      const responseData = await response.json()
      return {
        success: true,
        message: responseData.message || "Código enviado correctamente",
      }
    } catch (parseError) {
      console.error("Error al analizar la respuesta:", parseError)
      return {
        success: true,
        message: "Código enviado correctamente (no se pudo analizar la respuesta)",
      }
    }
  } catch (error: any) {
    console.error("Error al enviar código de recuperación:", error)
    return {
      success: false,
      message: error.message || "Error al enviar el código de recuperación",
    }
  }
}

/**
 * Verifica el código de recuperación enviado al usuario
 */
export async function verifyRecoveryCode(data: VerifyCodeRequest): Promise<ApiResponse> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")
    console.log("Verificando código:", data)

    const response = await fetch(`${apiUrl}/api/clientes/verificar-codigo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    console.log("Respuesta de verificación:", response.status, response.statusText)

    // Manejo de errores mejorado
    if (!response.ok) {
      let errorMessage = `Error ${response.status}: ${response.statusText}`

      try {
        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        }
      } catch (parseError) {
        console.error("Error al analizar la respuesta de error:", parseError)
      }

      return {
        success: false,
        message: errorMessage,
      }
    }

    try {
      const responseData = await response.json()

      // Si la respuesta incluye un token, lo almacenamos
      if (responseData.token) {
        console.log("Token recibido, almacenando para autenticación:", responseData.token.substring(0, 20) + "...")

        // Almacenar el token usando ambas funciones para asegurar la compatibilidad
        storeAuthToken(responseData.token)
        setAuthToken(responseData.token)

        // También almacenamos en sessionStorage para mayor seguridad
        if (typeof window !== "undefined") {
          sessionStorage.setItem("token", responseData.token)
        }
      } else {
        console.error("No se recibió token en la respuesta de verificación")
      }

      return {
        success: true,
        message: responseData.message || "Código verificado correctamente",
        token: responseData.token,
      }
    } catch (parseError) {
      console.error("Error al analizar la respuesta:", parseError)
      return {
        success: true,
        message: "Código verificado correctamente (no se pudo analizar la respuesta)",
      }
    }
  } catch (error: any) {
    console.error("Error al verificar código:", error)
    return {
      success: false,
      message: error.message || "Error al verificar el código",
    }
  }
}

/**
 * Restablece la contraseña del usuario
 */
export async function resetPassword(data: ResetPasswordRequest): Promise<ApiResponse> {
  try {
    console.log("Restableciendo contraseña")

    // Obtener el token almacenado
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")

    if (!token) {
      return {
        success: false,
        message: "No autorizado. Debe verificar el código primero.",
      }
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")

    // Enviar la solicitud a través de nuestra API proxy
    const response = await fetch(`/api/clientes/restablecer-contraseña`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    console.log("Respuesta de restablecimiento:", response.status, response.statusText)

    // Manejo de errores mejorado
    if (!response.ok) {
      let errorMessage = `Error ${response.status}: ${response.statusText}`

      try {
        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        }
      } catch (parseError) {
        console.error("Error al analizar la respuesta de error:", parseError)
      }

      return {
        success: false,
        message: errorMessage,
      }
    }

    try {
      const responseData = await response.json()

      // Si la operación fue exitosa, eliminamos el token
      localStorage.removeItem("token")
      sessionStorage.removeItem("token")

      return {
        success: true,
        message: responseData.message || "Contraseña restablecida correctamente",
      }
    } catch (parseError) {
      console.error("Error al analizar la respuesta:", parseError)

      // Aún así, eliminamos el token
      localStorage.removeItem("token")
      sessionStorage.removeItem("token")

      return {
        success: true,
        message: "Contraseña restablecida correctamente (no se pudo analizar la respuesta)",
      }
    }
  } catch (error: any) {
    console.error("Error al restablecer contraseña:", error)
    return {
      success: false,
      message: error.message || "Error al restablecer la contraseña",
    }
  }
}

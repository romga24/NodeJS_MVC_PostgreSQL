interface LoginCredentials {
  usuarioOEmail: string
  contraseña: string
}

interface LoginResponse {
  message?: string
  token?: string
  estaLogueado?: boolean
  id_cliente?: string
  nombre?: string
  email?: string
  apellidos?: string
  telefono?: string
  success?: boolean
  esAdmin?: boolean
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")
    if (!apiUrl) {
      console.error("Error: NEXT_PUBLIC_API_URL no está definida")
      return {
        success: false,
        message: "Error de configuración: URL de API no definida",
      }
    }

    const possibleEndpoints = ["/clientes/login", "/api/clientes/login", "/v1/clientes/login"]

    let response = null
    let endpointUsed = ""

    try {
      endpointUsed = "/clientes/login"
      console.log(`Intentando conectar a: ${apiUrl}${endpointUsed}`)

      response = await fetch(`${apiUrl}${endpointUsed}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuarioOEmail: credentials.usuarioOEmail,
          contraseña: credentials.contraseña,
        }),
      })

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("No es JSON")
      }
    } catch (error) {
      console.log("El endpoint principal falló, probando alternativas...")

      for (const endpoint of possibleEndpoints.slice(1)) {
        try {
          endpointUsed = endpoint
          console.log(`Intentando conectar a: ${apiUrl}${endpointUsed}`)

          response = await fetch(`${apiUrl}${endpointUsed}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              usuarioOEmail: credentials.usuarioOEmail,
              contraseña: credentials.contraseña,
            }),
          })

          const contentType = response.headers.get("content-type")
          if (contentType && contentType.includes("application/json")) {
            console.log(`Endpoint exitoso: ${endpointUsed}`)
            break
          }
        } catch (e) {
          console.log(`Endpoint ${endpoint} falló:`, e)
        }
      }
    }

    if (!response) {
      return {
        success: false,
        message: "No se pudo conectar a ning��n endpoint de la API",
      }
    }

    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text()
      console.error(`La respuesta de ${endpointUsed} no es JSON:`, text.substring(0, 200) + "...")
      return {
        success: false,
        message: "La API no devolvió una respuesta JSON válida",
      }
    }

    const data = await response.json()
    console.log("Respuesta de la API:", data)

    if (data.token) {
      // Decodificar el token para verificar si el usuario es administrador
      let esAdmin = false
      try {
        const tokenParts = data.token.split(".")
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]))
          console.log("Payload del token:", payload)
          // Verificar todas las posibles propiedades de admin
          esAdmin = Boolean(payload.is_admin || payload.esAdmin || payload.admin || payload.role === "admin")
          console.log("Es administrador:", esAdmin)
        }
      } catch (e) {
        console.error("Error al decodificar el token:", e)
      }

      return {
        ...data,
        success: true,
        esAdmin,
      }
    }

    return {
      success: false,
      message: data.message || "Error al iniciar sesión",
    }
  } catch (error) {
    console.error("Error en el servicio de login:", error)
    return {
      success: false,
      message: "Error de conexión con el servidor",
    }
  }
}

/**
 * Stores the authentication token in localStorage
 */
export function storeAuthToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token)
  }
}

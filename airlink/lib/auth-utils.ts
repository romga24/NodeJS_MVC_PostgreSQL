export function getAuthToken(): string | null {
  if (typeof window === "undefined") {
    return null
  }

  const localToken = localStorage.getItem("token")
  if (localToken) {
    try {
      const tokenParts = localToken.split(".")
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]))
        const expirationTime = payload.exp * 1000

        if (Date.now() >= expirationTime) {
          console.warn("Token expirado, eliminando...")
          removeAuthToken()
          return null
        }
      }
    } catch (e) {
      console.error("Error al verificar la expiración del token:", e)
    }
    return localToken
  }

  const sessionToken = sessionStorage.getItem("token")
  if (sessionToken) {
    try {
      const tokenParts = sessionToken.split(".")
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]))
        const expirationTime = payload.exp * 1000

        if (Date.now() >= expirationTime) {
          console.warn("Token expirado, eliminando...")
          removeAuthToken()
          return null
        }
      }
    } catch (e) {
      console.error("Error al verificar la expiración del token:", e)
    }
    return sessionToken
  }

  return null
}

export function setAuthToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token)
  }
}

export function removeAuthToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token")
    sessionStorage.removeItem("token")
  }
}

export function getAuthHeaders(): HeadersInit {
  const token = getAuthToken()

  if (!token) {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
    }
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  }
}

export function decodeJWT(token: string): any {
  try {
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error("Error decoding JWT:", error)
    return null
  }
}

export function isAdmin(token: string | null): boolean {
  if (!token) return false

  try {
    const tokenParts = token.split(".")
    if (tokenParts.length === 3) {
      const payload = JSON.parse(atob(tokenParts[1]))
      // Verificar todas las posibles propiedades de admin
      return Boolean(payload.is_admin || payload.esAdmin || payload.admin || payload.role === "admin")
    }
    return false
  } catch (error) {
    console.error("Error checking admin status:", error)
    return false
  }
}

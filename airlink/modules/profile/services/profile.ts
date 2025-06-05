import { signOut } from "next-auth/react"
import { removeAuthToken } from "@/lib/auth-utils"


interface ProfileData {
  nombre?: string
  apellidos?: string
  email?: string
  telefono?: string
  nif?: string
  contraseña?: string
  nombre_usuario?: string
}

interface ProfileResponse {
  success: boolean
  message?: string
  data?: any
}

export async function fetchUserProfile(): Promise<ProfileResponse> {
  try {
    const response = await fetch("/api/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    return {
      success: true,
      data,
    }
  } catch (error: any) {
    console.error("Error al obtener el perfil:", error)
    return {
      success: false,
      message: error.message || "No se pudo obtener la información del perfil",
    }
  }
}

export async function updateProfile(data: ProfileData): Promise<ProfileResponse> {
  try {
    console.log("Enviando datos para actualizar perfil:", data)

    const response = await fetch("/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Error al actualizar perfil: ${response.status} ${response.statusText}`)
    }

    const responseData = await response.json()

    return {
      success: true,
      message: "Perfil actualizado correctamente",
      data: responseData,
    }
  } catch (error: any) {
    console.error("Error al actualizar el perfil:", error)
    return {
      success: false,
      message: error.message || "No se pudo actualizar la información del perfil",
    }
  }
}

export async function deleteAccount(): Promise<ProfileResponse> {
  try {
    const response = await fetch("/api/profile", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`)
    }

    const responseData = await response.json()
    //Deslogueo al eliminar la cuenta del usuario 
    await signOut({ redirect: false })
    removeAuthToken()
    return {
      success: true,
      message: "Cuenta eliminada correctamente",
      data: responseData,
    }
  } catch (error: any) {
    console.error("Error al eliminar la cuenta:", error)
    return {
      success: false,
      message: error.message || "No se pudo eliminar la cuenta",
    }
  }
}

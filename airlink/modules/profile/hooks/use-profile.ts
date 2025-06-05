"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { fetchUserProfile, updateProfile, deleteAccount } from "@/modules/profile/services/profile"
import { useToast } from "@/modules/shared/hooks/use-toast"
import { useSessionStatus } from "@/modules/shared/components/session-checker"

interface ProfileData {
  id_cliente?: number | string
  nombre?: string
  apellidos?: string
  email?: string
  telefono?: string
  nif?: string
  nombre_usuario?: string
}

export function useProfile() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { data: session, status } = useSession()
  const router = useRouter()
  const { success, error: showError } = useToast()
  const { isSessionExpired } = useSessionStatus()

  const loadProfile = async () => {
    if (status !== "authenticated" || !session?.user?.token || isSessionExpired) {
      setError("No hay sesión activa")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await fetchUserProfile()
      if (result.success && result.data) {
        setProfileData(result.data)
      } else {
        const errorMessage = result.message || "Error al cargar el perfil"
        setError(errorMessage)
        showError(errorMessage)

        if (errorMessage.includes("401") || errorMessage.toLowerCase().includes("token")) {
          await handleSessionExpired()
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido"
      setError(errorMessage)
      showError(errorMessage)

      if (errorMessage.includes("401") || errorMessage.toLowerCase().includes("token")) {
        await handleSessionExpired()
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSessionExpired = async () => {
    showError("Sesión expirada", {
      description: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    })

    await signOut({ redirect: false })
    router.push("/login?error=expired")
  }

  const updateUserProfile = async (data: Partial<ProfileData>) => {
    if (status !== "authenticated" || !session?.user?.token) {
      showError("No hay sesión activa")
      return false
    }

    setIsLoading(true)
    setError(null)

    try {
      const apiData = {
        nombre: data.nombre,
        apellidos: data.apellidos,
        email: data.email,
        telefono: data.telefono,
        nombre_usuario: data.nombre_usuario,
        contraseña: (data as any).contraseña,
      }

      const filteredData = Object.fromEntries(
        Object.entries(apiData).filter(([_, value]) => value !== undefined && value !== ""),
      )

      const result = await updateProfile(filteredData as any)
      if (result.success) {
        setProfileData((prev) => (prev ? { ...prev, ...data } : null))
        success(result.message || "Perfil actualizado con éxito")
        return true
      } else {
        setError(result.message || "Error al actualizar el perfil")
        showError(result.message || "Error al actualizar el perfil")
        return false
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido"
      setError(errorMessage)
      showError(errorMessage)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const deleteUserAccount = async () => {
    if (status !== "authenticated" || !session?.user?.token) {
      showError("No hay sesión activa")
      return false
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await deleteAccount()
      if (result.success) {
        success(result.message || "Cuenta eliminada con éxito")
        router.push("/login")
        return true
      } else {
        setError(result.message || "Error al eliminar la cuenta")
        showError(result.message || "Error al eliminar la cuenta")
        return false
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido"
      setError(errorMessage)
      showError(errorMessage)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (status === "authenticated" && session?.user?.token && !isSessionExpired) {
      if (typeof window !== "undefined") {
        localStorage.setItem("token", session.user.token)
      }
      loadProfile()
    }
  }, [status, session, isSessionExpired])

  return {
    profileData,
    isLoading,
    error,
    loadProfile,
    updateProfile: updateUserProfile,
    deleteAccount: deleteUserAccount,
  }
}

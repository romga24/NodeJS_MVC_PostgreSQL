"use client"

import type React from "react"

import { useEffect, useState, createContext, useContext } from "react"
import { useSession, signOut } from "next-auth/react"
import { useToast } from "@/modules/shared/hooks/use-toast"
import { removeAuthToken } from "@/lib/auth-utils"
import { useRouter, usePathname } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

// Mantener la compatibilidad con el código existente
type SessionStatusContextType = {
  isSessionExpired: boolean
  checkSession: () => Promise<void>
}

const SessionStatusContext = createContext<SessionStatusContextType>({
  isSessionExpired: false,
  checkSession: async () => {},
})

export const useSessionStatus = () => useContext(SessionStatusContext)

export function SessionChecker({
  children,
  requiredRole,
}: { children?: React.ReactNode; requiredRole?: "admin" | "user" }) {
  const { data: session, status } = useSession()
  const { error } = useToast()
  const [isChecking, setIsChecking] = useState(false)
  const [isSessionExpired, setIsSessionExpired] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const locale = pathname?.split("/")[1] || "es"

  console.log("SessionChecker - session:", session)
  console.log("SessionChecker - requiredRole:", requiredRole)
  console.log("SessionChecker - esAdmin:", session?.user?.esAdmin)

  const checkSession = async () => {
    if (status !== "authenticated" || !session?.user?.token || isChecking) {
      return
    }

    setIsChecking(true)
    try {
      // Verificar expiración del token
      const tokenParts = session.user.token.split(".")
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]))
        const expirationTime = payload.exp * 1000

        if (Date.now() >= expirationTime) {
          console.log("Token expirado, actualizando estado...")
          await handleSessionExpired()
          return
        }
      }

      // Verificar sesión con el servidor usando fetch con credentials
      const response = await fetch("/api/auth/session", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Importante para cookies en producción
      })

      if (!response.ok) {
        console.log("Sesión expirada o token inválido, actualizando estado...")
        await handleSessionExpired()
      } else {
        setIsSessionExpired(false)
      }
    } catch (err) {
      console.error("Error al verificar la sesión:", err)
      // En caso de error de red, no cerrar sesión inmediatamente
    } finally {
      setIsChecking(false)
    }
  }

  const handleSessionExpired = async () => {
    error("Sesión expirada", {
      description: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    })

    removeAuthToken()
    setIsSessionExpired(true)
    await signOut({ redirect: false })
  }

  useEffect(() => {
    checkSession()

    const intervalId = setInterval(
      () => {
        checkSession()
      },
      5 * 60 * 1000,
    )

    return () => clearInterval(intervalId)
  }, [status, session])

  // Verificación de rol para rutas protegidas
  useEffect(() => {
    if (status === "loading") return

    if (status === "unauthenticated" && requiredRole) {
      router.push(`/${locale}/login?callbackUrl=${encodeURIComponent(pathname || "/")}`)
    } else if (status === "authenticated" && requiredRole === "admin") {
      // Verificar si el usuario es administrador
      const isAdmin = session.user.esAdmin === true
      console.log("Verificando admin:", isAdmin)

      if (!isAdmin) {
        router.push(`/${locale}/dashboard`)
      }
    }
  }, [status, router, pathname, locale, session, requiredRole])

  if (requiredRole) {
    if (status === "loading") {
      return (
        <div className="flex justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
        </div>
      )
    }

    if (status === "unauthenticated") {
      return (
        <Alert variant="destructive" className="m-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Sesión no iniciada</AlertTitle>
          <AlertDescription>Debe iniciar sesión para acceder a esta página. Redirigiendo...</AlertDescription>
        </Alert>
      )
    }

    if (requiredRole === "admin" && !session?.user?.esAdmin) {
      return (
        <Alert variant="destructive" className="m-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Acceso denegado</AlertTitle>
          <AlertDescription>
            No tiene permisos de administrador para acceder a esta página. Redirigiendo...
          </AlertDescription>
        </Alert>
      )
    }
  }

  return (
    <SessionStatusContext.Provider value={{ isSessionExpired, checkSession }}>{children}</SessionStatusContext.Provider>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/modules/shared/hooks/use-toast"
import { AlertTriangle } from "lucide-react"
import { registerUser } from "@/modules/auth/services/register"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RegisterFormFields } from "./register-form-fields"
import { useTranslations } from "next-intl"

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [showDebug, setShowDebug] = useState(false)
  const router = useRouter()
  const { success, error } = useToast()
  const t = useTranslations()

  const handleRegister = async (data: {
    firstName: string
    lastName: string
    email: string
    phone: string
    nif: string
    nombre_usuario: string
    password: string
    acceptTerms: boolean
  }) => {
    setIsLoading(true)
    setFormError(null)
    setDebugInfo(null)

    try {
      const formData = {
        nombre: data.firstName,
        apellidos: data.lastName,
        email: data.email,
        telefono: data.phone,
        nif: data.nif,
        nombre_usuario: data.nombre_usuario,
        contraseña: data.password,
      }

      const result = await registerUser(formData)

      if (result.success) {
        success(`${t("auth.accountCreated")}`)
        router.push("/login")
        return true
      } else {
        setDebugInfo(result.data || result.error)

        const errorMessage = result.message || `${t("auth.errorRegister")}`
        setFormError(errorMessage)
        error(errorMessage)
        console.error("Detalles del error:", result.data || result.error)
        return false
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `${t("auth.errorProcess")}`
      console.error("Error al registrar:", err)
      setFormError(errorMessage)
      error(errorMessage)
      setDebugInfo(err)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">{t("auth.createAccount")}</CardTitle>
        <CardDescription>{t("auth.createAccountTitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        {formError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{formError}</AlertDescription>

            {debugInfo && (
              <div className="mt-2">
                <Button variant="outline" size="sm" onClick={() => setShowDebug(!showDebug)} className="text-xs">
                  {showDebug ? t("common.hideDetails") : t("common.showDetails")}
                </Button>

                {showDebug && (
                  <pre className="mt-2 p-2 bg-red-950 text-white rounded text-xs overflow-auto max-h-40">
                    {typeof debugInfo === "string" ? debugInfo : JSON.stringify(debugInfo, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </Alert>
        )}
        <RegisterFormFields onSubmit={handleRegister} isLoading={isLoading} />
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-center text-sm">
          {t("auth.alreadyAnAccount")}{" "}
          <Link href="/login" className="text-primary hover:underline">
            {t("common.login")}
          </Link>
        </div>

        {/* <div className="text-center text-xs text-muted-foreground">
          <Link href="/register-data-test" className="hover:underline">
            Diagnosticar problemas de registro
          </Link>
        </div> */}
      </CardFooter>
    </Card>
  )
}

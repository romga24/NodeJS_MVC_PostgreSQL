"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/modules/shared/hooks/use-toast"
import { signIn } from "next-auth/react"
import { storeAuthToken } from "@/modules/auth/services/login"
import { login } from "@/modules/auth/services/login"
import { LoginFormFields } from "./login-form-fields"
import { useLocale, useTranslations } from "next-intl"

export default function LoginForm() {
	const t = useTranslations()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { error: showError, success } = useToast()
  const searchParams = useSearchParams()
  const locale = useLocale()

  useEffect(() => {
    const error = searchParams.get("error")
    if (error === "expired") {
      showError("Expired", {
        description: `${t('auth.sessionExpired')}`,
      })
    }
  }, [searchParams, showError])

  const handleLogin = async (data: { usuarioOEmail: string; contraseña: string }) => {
    setIsLoading(true)
    try {
      const loginResult = await login({
        usuarioOEmail: data.usuarioOEmail,
        contraseña: data.contraseña,
      })

      console.log("Login result:", loginResult)

      if (loginResult.token) {
        storeAuthToken(loginResult.token)
      }

      const result = await signIn("credentials", {
        usuarioOEmail: data.usuarioOEmail,
        contraseña: data.contraseña,
        redirect: false,
      })

      if (result?.error) {
        console.error("Error en inicio de sesión:", result.error)
        showError(result.error)
        return false
      } else {
        console.log("Inicio de sesión exitoso")
        success(`${t('auth.successLogin')}`)

        // Determinar la URL de redirección basada en si el usuario es administrador
        let redirectUrl = searchParams.get("callbackUrl") || `/${locale}/dashboard`

        // Si el usuario es administrador, redirigir a la página de administrador
        if (loginResult.esAdmin) {
          console.log("Redirigiendo a administrador")
          redirectUrl = `/${locale}/admin/dashboard`
        }

        console.log("Redirigiendo a:", redirectUrl)
        setTimeout(() => {
          router.push(redirectUrl)
          router.refresh()
        }, 500)
        return true
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err)
      showError("Error", {
        description: `${t('auth.errorProcess')}`,
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">{t('common.login')}</CardTitle>
        <CardDescription>{t('auth.loginTitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginFormFields onSubmit={handleLogin} isLoading={isLoading} />
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-center text-sm">
          {t('auth.dontHaveAccount')}{" "}
          <Link href="/register" className="text-primary hover:underline">
            {t('auth.register')}
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}

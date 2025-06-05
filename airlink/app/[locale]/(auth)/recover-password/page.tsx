"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/modules/shared/hooks/use-toast"
import { sendRecoveryCode, verifyRecoveryCode } from "@/modules/auth/services/password-recovery"
import { Loader2, ArrowLeft, Check } from "lucide-react"
import Link from "next/link"
import { useLocale, useTranslations } from "next-intl"
import { signIn } from "next-auth/react"

enum RecoveryStep {
  REQUEST_CODE = 0,
  VERIFY_CODE = 1,
  SUCCESS = 2,
}

export default function RecoverPasswordPage() {
  const [step, setStep] = useState<RecoveryStep>(RecoveryStep.REQUEST_CODE)
  const [isLoading, setIsLoading] = useState(false)
  const [emailOrUsername, setEmailOrUsername] = useState("")
  const [code, setCode] = useState("")
  const { toast } = useToast()
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations("recover")

  const showError = (title: string, description = "") => {
    toast.error(title, { description })
  }

  const showSuccess = (title: string, description = "") => {
    toast.success(title, { description })
  }

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailOrUsername) {
      showError(t("errors.missingEmailOrUsername"))
      return
    }

    setIsLoading(true)
    try {
      const result = await sendRecoveryCode({ emailOUsuario: emailOrUsername })
      if (result.success) {
        showSuccess(t("success.codeSent.title"), t("success.codeSent.description"))
        setStep(RecoveryStep.VERIFY_CODE)
      } else {
        showError(t("errors.sendCodeFailed"), result.message)
      }
    } catch (err: any) {
      console.error("Error:", err)
      showError(t("errors.generic"), err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code) {
      showError(t("errors.missingCode"))
      return
    }

    setIsLoading(true)
    try {
      const result = await verifyRecoveryCode({ codigo: code })
      if (result.success && result.token) {
        showSuccess(t("success.codeVerified.title"), t("success.codeVerified.description"))

        const signInResult = await signIn("credentials", {
          redirect: false,
          token: result.token,
          callbackUrl: `/${locale}/dashboard`,
        })

        if (signInResult?.error) {
          console.error("Error al iniciar sesión:", signInResult.error)
          showError(t("errors.signInFailed"))
        } else {
          showSuccess(t("success.loggedIn.title"), t("success.loggedIn.description"))
          setStep(RecoveryStep.SUCCESS)
          setTimeout(() => {
            router.push(`/${locale}/dashboard`)
          }, 2000)
        }
      } else {
        showError(t("errors.invalidCode"), result.message)
      }
    } catch (err: any) {
      console.error("Error al verificar código:", err)
      showError(t("errors.generic"), err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (step) {
      case RecoveryStep.REQUEST_CODE:
        return (
          <form onSubmit={handleRequestCode}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emailOrUsername">{t("form.emailOrUsernameLabel")}</Label>
                <Input
                  id="emailOrUsername"
                  type="text"
                  placeholder={t("form.emailOrUsernamePlaceholder")}
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("buttons.sending")}
                  </>
                ) : (
                  t("buttons.sendCode")
                )}
              </Button>
            </CardFooter>
          </form>
        )

      case RecoveryStep.VERIFY_CODE:
        return (
          <form onSubmit={handleVerifyCode}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">{t("form.codeLabel")}</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder={t("form.codePlaceholder")}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("buttons.verifying")}
                  </>
                ) : (
                  t("buttons.verifyAndLogin")
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setStep(RecoveryStep.REQUEST_CODE)}
                disabled={isLoading}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("buttons.back")}
              </Button>
            </CardFooter>
          </form>
        )

      case RecoveryStep.SUCCESS:
        return (
          <>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center justify-center py-4">
                <div className="rounded-full bg-green-100 p-3 mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-center">{t("success.loggedIn.title")}</h3>
                <p className="text-center text-muted-foreground mt-2">
                  {t("success.loggedIn.description")}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => router.push(`/${locale}/dashboard`)}>
                {t("buttons.goToDashboard")}
              </Button>
            </CardFooter>
          </>
        )
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">{t("title")}</CardTitle>
          <CardDescription>
            {step === RecoveryStep.REQUEST_CODE && t("description.request")}
            {step === RecoveryStep.VERIFY_CODE && t("description.verify")}
            {step === RecoveryStep.SUCCESS && t("description.success")}
          </CardDescription>
        </CardHeader>
        {renderStepContent()}
        {step !== RecoveryStep.SUCCESS && (
          <div className="px-6 pb-6 text-center text-sm">
            <Link href={`/${locale}/login`} className="text-primary hover:underline">
              {t("buttons.backToLogin")}
            </Link>
          </div>
        )}
      </Card>
    </div>
  )
}

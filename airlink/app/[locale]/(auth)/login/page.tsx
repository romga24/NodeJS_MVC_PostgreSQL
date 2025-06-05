"use client"

import LoginForm from "@/modules/auth/components/login-form"
import { EnvChecker } from "@/modules/shared/components/env-checker"
import { useSearchParams } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12">
      <EnvChecker />
      <SessionExpiredAlert />
      <LoginForm />
    </div>
  )
}

function SessionExpiredAlert() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  if (error === "expired") {
    return (
      <Alert variant="destructive" className="mb-6 max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Su sesión ha expirado. Por favor, inicie sesión nuevamente.</AlertDescription>
      </Alert>
    )
  }

  return null
}


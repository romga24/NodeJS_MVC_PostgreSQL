"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function EnvChecker() {
  const [missingEnvVars, setMissingEnvVars] = useState<string[]>([])

  useEffect(() => {
    const requiredEnvVars = [{ name: "NEXT_PUBLIC_API_URL", value: process.env.NEXT_PUBLIC_API_URL }]

    const missing = requiredEnvVars.filter((env) => !env.value).map((env) => env.name)

    setMissingEnvVars(missing)
  }, [])

  if (missingEnvVars.length === 0) return null

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error de configuración</AlertTitle>
      <AlertDescription>
        Las siguientes variables de entorno son necesarias pero no están definidas:
        <ul className="mt-2 list-disc pl-5">
          {missingEnvVars.map((envVar) => (
            <li key={envVar}>{envVar}</li>
          ))}
        </ul>
        Asegúrate de crear un archivo .env.local con estas variables.
      </AlertDescription>
    </Alert>
  )
}


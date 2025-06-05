"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"

export default function ApiConfigPage() {
  const [apiUrl, setApiUrl] = useState<string | null>(null)
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_API_URL
    setApiUrl(url || null)

    if (url) {
      try {
        new URL(url)
        setIsValid(true)
      } catch (e) {
        setIsValid(false)
        setError("La URL no tiene un formato válido")
      }
    } else {
      setIsValid(false)
      setError("La variable de entorno NEXT_PUBLIC_API_URL no está definida")
    }
  }, [])

  return (
    <div className="container py-12">
      <h1 className="text-2xl font-bold mb-6 text-center">Configuración de API</h1>

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Configuración de la API</CardTitle>
          <CardDescription>Verifica la configuración de la API para el registro y autenticación</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
            <p className="font-medium">URL de la API:</p>
            <p className="break-all mt-1">{apiUrl || "No definida"}</p>
          </div>

          {isValid === true && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-600">Configuración válida</AlertTitle>
              <AlertDescription className="text-green-600">La URL de la API tiene un formato válido.</AlertDescription>
            </Alert>
          )}

          {isValid === false && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error de configuración</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="font-medium">Información importante:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>La URL de la API debe incluir el protocolo (http:// o https://)</li>
              <li>No debe terminar con una barra (/)</li>
              <li>Debe ser accesible desde el navegador</li>
              <li>
                Ejemplo correcto: <code>https://api.example.com</code>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


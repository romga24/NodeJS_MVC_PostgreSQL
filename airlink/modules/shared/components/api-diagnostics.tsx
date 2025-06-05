"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ApiDiagnostics() {
  const [apiUrl, setApiUrl] = useState<string | null>(null)
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [isTesting, setIsTesting] = useState(false)

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_API_URL
    setApiUrl(url || null)

    if (url) {
      try {
        new URL(url)
        setIsValid(true)
      } catch (e) {
        setIsValid(false)
      }
    } else {
      setIsValid(false)
    }
  }, [])

  const testApiConnection = async () => {
    setIsTesting(true)
    setTestResult(null)

    try {
      const url = `${apiUrl}/api/aeropuertos`
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        setTestResult({
          success: true,
          message: "Conexión exitosa con la API",
        })
      } else {
        setTestResult({
          success: false,
          message: `Error ${response.status}: ${response.statusText}`,
        })
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : "Error desconocido",
      })
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Diagnóstico de API</CardTitle>
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
            <AlertDescription>
              {apiUrl
                ? "La URL de la API no tiene un formato válido"
                : "La variable de entorno NEXT_PUBLIC_API_URL no está definida"}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-center">
          <Button onClick={testApiConnection} disabled={!isValid || isTesting} className="mt-2">
            {isTesting ? "Probando conexión..." : "Probar conexión con la API"}
          </Button>
        </div>

        {testResult && (
          <Alert className={testResult.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}>
            {testResult.success ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertTitle className={testResult.success ? "text-green-600" : "text-red-600"}>
              {testResult.success ? "Prueba exitosa" : "Error en la prueba"}
            </AlertTitle>
            <AlertDescription className={testResult.success ? "text-green-600" : "text-red-600"}>
              {testResult.message}
            </AlertDescription>
          </Alert>
        )}

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="font-medium">Información importante:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>La URL de la API debe incluir el protocolo (http:// o https://)</li>
            <li>Para la búsqueda de vuelos, se utilizará la ruta: /api/vuelos/buscador-vuelos</li>
            <li>Los parámetros se envían como query parameters en la URL</li>
            <li>Parámetros requeridos: codigo_origen, codigo_destino, fecha_ida, numero_pasajeros</li>
            <li>Parámetro opcional: fecha_vuelta (para viajes de ida y vuelta)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}


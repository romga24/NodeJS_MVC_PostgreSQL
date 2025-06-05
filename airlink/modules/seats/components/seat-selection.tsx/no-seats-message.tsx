"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

interface NoSeatsMessageProps {
  onSkip: () => void
}

export function NoSeatsMessage({ onSkip }: NoSeatsMessageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Selección de asientos</h1>

      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No hay asientos disponibles</AlertTitle>
        <AlertDescription>
          No se encontraron asientos disponibles para los vuelos seleccionados. Se le asignarán asientos automáticamente
          durante el check-in.
        </AlertDescription>
      </Alert>

      <div className="flex justify-center">
        <Button onClick={onSkip}>Continuar sin seleccionar asientos</Button>
      </div>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface Vuelo {
  id: number
  numero_vuelo: string
  origen: string
  destino: string
  fecha: string
  hora: string
  estado: string
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function VueloDetallePage({ params }: PageProps) {
  const router = useRouter()
  const [vuelo, setVuelo] = useState<Vuelo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [nuevoEstado, setNuevoEstado] = useState("")
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null)

  useEffect(() => {
    async function resolveParams() {
      const resolved = await params
      setResolvedParams(resolved)
    }
    resolveParams()
  }, [params])

  useEffect(() => {
    if (!resolvedParams) return

    async function fetchVuelo() {
      if (!resolvedParams) return

      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/vuelos/${resolvedParams.id}`)
        if (!res.ok) throw new Error("No se encontró el vuelo")
        const data = await res.json()
        setVuelo(data)
        setNuevoEstado(data.estado)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    fetchVuelo()
  }, [resolvedParams])

  async function handleGuardarEstado() {
    if (!resolvedParams) return

    try {
      // Aquí iría la llamada PUT para actualizar solo el estado
      // Por ahora, simulamos con alert y actualización local

      // Ejemplo de PUT:
      // const res = await fetch(`/api/vuelos/${resolvedParams.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ estado: nuevoEstado }),
      // })
      // if (!res.ok) throw new Error('Error al actualizar estado')
      // const updated = await res.json()
      // setVuelo(updated)

      setVuelo((prev) => (prev ? { ...prev, estado: nuevoEstado } : prev))
      setEditMode(false)
      alert("Estado actualizado correctamente")
    } catch (e: any) {
      alert(`Error: ${e.message}`)
    }
  }

  if (!resolvedParams || loading) return <p className="p-4">Cargando...</p>
  if (error) return <p className="p-4 text-red-600">Error: {error}</p>
  if (!vuelo) return <p className="p-4">Vuelo no encontrado</p>

  return (
    <div className="max-w-xl mx-auto p-6 border rounded shadow mt-10">
      <h1 className="text-2xl font-bold mb-4">Detalles del vuelo {vuelo.numero_vuelo}</h1>

      <p>
        <strong>Origen:</strong> {vuelo.origen}
      </p>
      <p>
        <strong>Destino:</strong> {vuelo.destino}
      </p>
      <p>
        <strong>Fecha:</strong> {vuelo.fecha}
      </p>
      <p>
        <strong>Hora:</strong> {vuelo.hora}
      </p>

      <p className="mt-4">
        <strong>Estado:</strong>{" "}
        {editMode ? (
          <select
            value={nuevoEstado}
            onChange={(e) => setNuevoEstado(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="Programado">Programado</option>
            <option value="Retrasado">Retrasado</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        ) : (
          vuelo.estado
        )}
      </p>

      {editMode ? (
        <div className="mt-4 space-x-2">
          <button
            onClick={handleGuardarEstado}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Guardar
          </button>
          <button
            onClick={() => {
              setEditMode(false)
              setNuevoEstado(vuelo.estado)
            }}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancelar
          </button>
        </div>
      ) : (
        <button
          onClick={() => setEditMode(true)}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Modificar Estado
        </button>
      )}
    </div>
  )
}

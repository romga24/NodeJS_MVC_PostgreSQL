import { type NextRequest, NextResponse } from "next/server"

// GET - Obtener un vuelo específico
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // Aquí iría la lógica para obtener el vuelo de la base de datos
    // Por ahora, devolvemos datos de ejemplo
    const vuelo = {
      id: Number.parseInt(id),
      numero_vuelo: `VL${id}`,
      origen: "Madrid",
      destino: "Barcelona",
      fecha: "2024-01-15",
      hora: "10:30",
      estado: "Programado",
    }

    return NextResponse.json(vuelo)
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener el vuelo" }, { status: 500 })
  }
}

// PUT - Actualizar estado del vuelo
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { estado } = body

    // Aquí iría la lógica para actualizar el vuelo en la base de datos
    // Por ahora, devolvemos el vuelo actualizado
    const vueloActualizado = {
      id: Number.parseInt(id),
      numero_vuelo: `VL${id}`,
      origen: "Madrid",
      destino: "Barcelona",
      fecha: "2024-01-15",
      hora: "10:30",
      estado: estado,
    }

    return NextResponse.json(vueloActualizado)
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar el vuelo" }, { status: 500 })
  }
}

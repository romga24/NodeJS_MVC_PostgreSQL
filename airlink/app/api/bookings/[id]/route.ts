import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const resolvedParams = await params

    if (!session?.user?.token) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")
    if (!apiUrl) {
      return NextResponse.json({ error: "URL de API no configurada" }, { status: 500 })
    }

    const bookingId = resolvedParams.id
    console.log(`Eliminando reserva ${bookingId}`)

    const response = await fetch(`${apiUrl}/api/reservas/${bookingId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${session.user.token}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Error al eliminar reserva: ${response.status} ${response.statusText}`, errorText)
      return NextResponse.json(
        { error: `Error al eliminar reserva: ${response.status} ${response.statusText}` },
        { status: response.status },
      )
    }

    const contentType = response.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json()
      return NextResponse.json(data)
    }

    return NextResponse.json({ message: "Reserva eliminada correctamente" })
  } catch (error) {
    console.error("Error en el endpoint de eliminación de reserva:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Error desconocido" }, { status: 500 })
  }
}

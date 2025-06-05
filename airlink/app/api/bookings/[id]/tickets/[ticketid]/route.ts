import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string; ticketId: string }> }) {
  try {
    const session = await auth()

    if (!session?.user?.token) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")
    if (!apiUrl) {
      return NextResponse.json({ error: "URL de API no configurada" }, { status: 500 })
    }

    const resolvedParams = await params
    const bookingId = resolvedParams.id
    const ticketId = resolvedParams.ticketId
    console.log(`Eliminando billete ${ticketId} de la reserva ${bookingId}`)

    const response = await fetch(`${apiUrl}/api/reservas/${bookingId}/billetes/${ticketId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${session.user.token}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Error al eliminar billete: ${response.status} ${response.statusText}`, errorText)
      return NextResponse.json(
        { error: `Error al eliminar billete: ${response.status} ${response.statusText}` },
        { status: response.status },
      )
    }

    const contentType = response.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json()
      return NextResponse.json(data)
    }

    return NextResponse.json({ message: "Billete eliminado correctamente" })
  } catch (error) {
    console.error("Error en el endpoint de eliminación de billete:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Error desconocido" }, { status: 500 })
  }
}

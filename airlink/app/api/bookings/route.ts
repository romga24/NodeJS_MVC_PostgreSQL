import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.token) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")
    if (!apiUrl) {
      return NextResponse.json({ error: "URL de API no configurada" }, { status: 500 })
    }

    console.log(`Obteniendo reservas del usuario desde: ${apiUrl}/api/reservas/mis-reservas`)

    const response = await fetch(`${apiUrl}/api/reservas/mis-reservas`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${session.user.token}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Error al obtener reservas: ${response.status} ${response.statusText}`, errorText)
      return NextResponse.json(
        { error: `Error al obtener reservas: ${response.status} ${response.statusText}` },
        { status: response.status },
      )
    }

    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text()
      console.error("Respuesta no es JSON:", text)
      return NextResponse.json({ error: "La respuesta no es JSON" }, { status: 500 })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error en el endpoint de reservas:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Error desconocido" }, { status: 500 })
  }
}

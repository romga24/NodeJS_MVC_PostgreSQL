import { NextResponse } from "next/server"
import { auth } from "@/auth"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.token) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")
    if (!apiUrl) {
      return NextResponse.json({ error: "URL de API no configurada" }, { status: 500 })
    }

    const response = await fetch(`${apiUrl}/api/vuelos`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${session.user.token}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: `Error al obtener vuelos: ${response.status} ${response.statusText}`, details: errorText },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error en /api/vuelos GET:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

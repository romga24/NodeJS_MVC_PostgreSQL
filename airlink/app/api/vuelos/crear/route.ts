import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.token) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const rawBody = await request.text()
    console.log("🧾 Raw body:", rawBody)

    if (!rawBody) {
      return NextResponse.json({ error: "⚠️ Cuerpo vacío recibido en el backend" }, { status: 400 })
    }

    let body
    try {
      body = JSON.parse(rawBody)
      console.log("📥 Datos como JSON:", body)
    } catch (err) {
      console.error("❌ Error al parsear JSON:", err)
      return NextResponse.json({ error: "JSON inválido", details: rawBody }, { status: 400 })
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")
    if (!apiUrl) {
      return NextResponse.json({ error: "URL de API no configurada" }, { status: 500 })
    }

    // Reenvío de la petición a la API real
    const proxyRequest = new Request(`${apiUrl}/api/vuelos/crear`, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.user.token}`,
      }),
      body: rawBody,
    })

    const response = await fetch(proxyRequest)

    // Leemos la respuesta del servidor externo
    const text = await response.text()
    console.log("🌐 Respuesta desde Render:", response.status, response.statusText, text)

    // Intentamos convertir la respuesta a JSON para devolverla al frontend
    try {
      const parsed = JSON.parse(text)
      return NextResponse.json(parsed, { status: response.status })
    } catch (jsonErr) {
      return NextResponse.json(
        { error: "Respuesta no es JSON", details: text },
        { status: response.status }
      )
    }

  } catch (error) {
    console.error("❌ ERROR DETALLADO AL CREAR VUELO:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

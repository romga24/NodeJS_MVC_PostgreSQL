import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { emailOUsuario } = data

    if (!emailOUsuario) {
      return NextResponse.json({ message: "El email o nombre de usuario es requerido" }, { status: 400 })
    }

    // Obtener la URL base de la API
    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")
    if (!apiUrl) {
      return NextResponse.json({ message: "URL de API no configurada" }, { status: 500 })
    }

    // Hacer la solicitud al backend
    const response = await fetch(`${apiUrl}/clientes/enviar-codigo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ emailOUsuario }),
    })

    // Obtener la respuesta como JSON
    const responseData = await response.json()

    // Devolver la respuesta con el mismo código de estado
    return NextResponse.json(responseData, { status: response.status })
  } catch (error: any) {
    console.error("Error al enviar código:", error)
    return NextResponse.json({ message: error.message || "Error al enviar el código" }, { status: 500 })
  }
}

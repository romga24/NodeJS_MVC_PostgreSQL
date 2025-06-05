import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { nueva_contrasena } = data

    if (!nueva_contrasena) {
      return NextResponse.json({ message: "La nueva contraseña es requerida" }, { status: 400 })
    }

    // Obtener la URL base de la API
    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")
    if (!apiUrl) {
      return NextResponse.json({ message: "URL de API no configurada" }, { status: 500 })
    }

    // Obtener el token de autorización
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    // Modificar la URL de la API para incluir el prefijo /api/
    const response = await fetch(`${apiUrl}/api/clientes/restablecer-contrasena`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({ nueva_contrasena }),
    })

    // Obtener la respuesta como JSON
    const responseData = await response.json()

    // Devolver la respuesta con el mismo código de estado
    return NextResponse.json(responseData, { status: response.status })
  } catch (error: any) {
    console.error("Error al restablecer contraseña:", error)
    return NextResponse.json({ message: error.message || "Error al restablecer la contraseña" }, { status: 500 })
  }
}

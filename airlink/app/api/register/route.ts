import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")
    if (!apiUrl) {
      return NextResponse.json({ error: "URL de API no configurada" }, { status: 500 })
    }

    console.log(`Registrando usuario en: ${apiUrl}/api/clientes`, {
      ...userData,
      contraseña: userData.contraseña ? "***" : undefined,
    })

    // Modificamos para usar siempre el prefijo /api/
    const endpoint = "/api/clientes"

    try {
      console.log(`Intentando endpoint: ${apiUrl}${endpoint}`)

      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json()
          return NextResponse.json(errorData, { status: response.status })
        } else {
          const text = await response.text()
          return NextResponse.json(
            {
              error: `Error ${response.status}: ${response.statusText}`,
              details: text.substring(0, 500),
            },
            { status: response.status },
          )
        }
      }

      const data = await response.json()
      return NextResponse.json(data)
    } catch (error) {
      console.error(`Error con endpoint ${endpoint}:`, error)
      return NextResponse.json(
        {
          error: error instanceof Error ? error.message : String(error),
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error en el endpoint de registro:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}

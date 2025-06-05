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

    console.log(`Obteniendo perfil del usuario desde: ${apiUrl}/api/clientes/perfil-cliente`)

    const response = await fetch(`${apiUrl}/api/clientes/perfil-cliente`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${session.user.token}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Error al obtener perfil: ${response.status} ${response.statusText}`, errorText)
      return NextResponse.json(
        { error: `Error al obtener perfil: ${response.status} ${response.statusText}` },
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
    console.error("Error en el endpoint de perfil:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Error desconocido" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.token) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")
    if (!apiUrl) {
      return NextResponse.json({ error: "URL de API no configurada" }, { status: 500 })
    }

    const data = await request.json()
    console.log(`Actualizando perfil del usuario en: ${apiUrl}/api/clientes/actualizar-datos-cliente`, data)

    const response = await fetch(`${apiUrl}/api/clientes/actualizar-datos-cliente`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${session.user.token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Error al actualizar perfil: ${response.status} ${response.statusText}`, errorText)
      return NextResponse.json(
        { error: `Error al actualizar perfil: ${response.status} ${response.statusText}` },
        { status: response.status },
      )
    }

    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text()
      console.error("Respuesta no es JSON:", text)
      return NextResponse.json({ error: "La respuesta no es JSON" }, { status: 500 })
    }

    const responseData = await response.json()
    return NextResponse.json(responseData)
  } catch (error) {
    console.error("Error en el endpoint de actualización de perfil:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Error desconocido" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.token) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")
    if (!apiUrl) {
      return NextResponse.json({ error: "URL de API no configurada" }, { status: 500 })
    }

    console.log(`Eliminando cuenta de usuario en: ${apiUrl}/api/clientes/eliminar-cuenta`)

    const response = await fetch(`${apiUrl}/api/clientes/eliminar-cuenta`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${session.user.token}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Error al eliminar cuenta: ${response.status} ${response.statusText}`, errorText)
      return NextResponse.json(
        { error: `Error al eliminar cuenta: ${response.status} ${response.statusText}` },
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
    console.error("Error en el endpoint de eliminación de cuenta:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Error desconocido" }, { status: 500 })
  }
}

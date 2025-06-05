import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params
  return handleApiRequest(request, "GET", resolvedParams.path)
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params
  return handleApiRequest(request, "POST", resolvedParams.path)
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params
  return handleApiRequest(request, "PUT", resolvedParams.path)
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params
  return handleApiRequest(request, "DELETE", resolvedParams.path)
}

async function handleApiRequest(request: NextRequest, method: string, pathSegments: string[]) {
  const path = `/${pathSegments.join("/")}`

  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")
  if (!apiUrl) {
    return NextResponse.json({ error: "URL de API no configurada" }, { status: 500 })
  }

  const requiresAuth = [
    "/clientes/perfil-cliente",
    "/clientes/actualizar-datos-cliente",
    "/clientes/eliminar-cuenta",
    "/clientes/verificar-codigo",

    "/reservas/realizar-reserva",
    "/reservas/realizar-reserva-aleatoria",
    "/reservas/mis-reservas",
    "/reservas",
  ].some((route) => {
    if (route.endsWith("/")) {
      return path.startsWith(route)
    }
    if (route.includes(":")) {
      const routeBase = route.split(":")[0]
      return path.startsWith(routeBase)
    }
    return path === route
  })

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }

  if (requiresAuth) {
    const session = await auth()

    if (!session?.user?.token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    headers["Authorization"] = `Bearer ${session.user.token}`
  }

  let body: BodyInit | null = null
  if (method !== "GET" && method !== "HEAD") {
    body = await request.text()
  }

  try {
    console.log(`Enviando solicitud a ${apiUrl}${path}`, {
      method,
      headers: { ...headers, Authorization: headers.Authorization ? "Bearer ***" : undefined },
      body: body ? body.substring(0, 100) + "..." : null,
    })

    const response = await fetch(`${apiUrl}${path}`, {
      method,
      headers,
      body,
    })

    const contentType = response.headers.get("content-type")
    let data

    const responseText = await response.text()
    console.log(`Respuesta de ${apiUrl}${path} (status ${response.status}):`, responseText.substring(0, 200))

    if (!response.ok && path.includes("/reservas/realizar-reserva")) {
      console.log("Detectado error en realizar-reserva, verificando si la reserva se creó de todos modos")

      try {
        data = JSON.parse(responseText)

        if (data.reserva || data.id_reserva || data.localizador || (data.message && data.message.includes("éxito"))) {
          console.log("La reserva parece haberse creado a pesar del error")
          return NextResponse.json(data, { status: 201 })
        }
      } catch (e) {
        if (
          responseText.includes("éxito") ||
          responseText.includes("reserva") ||
          responseText.includes("id_reserva") ||
          responseText.includes("localizador")
        ) {
          console.log("La respuesta no es JSON pero parece indicar éxito")
          return NextResponse.json(
            {
              message: "Reserva posiblemente creada",
              rawResponse: responseText.substring(0, 500),
            },
            { status: 201 },
          )
        }
      }
    }

    if (contentType && contentType.includes("application/json")) {
      try {
        data = JSON.parse(responseText)
      } catch (e) {
        console.error("Error al parsear JSON:", e)
        data = { text: responseText }
      }
    } else {
      data = { text: responseText }
    }

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error(`Error al realizar solicitud a ${apiUrl}${path}:`, error)

    return NextResponse.json({ error: "Error al comunicarse con la API externa" }, { status: 500 })
  }
}

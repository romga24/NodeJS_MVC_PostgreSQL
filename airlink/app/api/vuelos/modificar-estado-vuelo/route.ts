import { NextResponse } from "next/server"
import { auth } from "@/auth"

export async function PUT(request: Request) {
  const session = await auth()
  console.log("Sesión completa:", session)
  console.log("Token usado:", session?.user?.token)
  console.log("esAdmin:", session?.user?.esAdmin)

  if (!session?.user?.token) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const body = await request.json()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")

  const response = await fetch(`${apiUrl}/api/vuelos/modificar-estado-vuelo`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.user.token}`,
    },
    body: JSON.stringify(body),
  })

  const data = await response.json()

  if (!response.ok) {
    return NextResponse.json({ error: data.error || "Error al modificar estado" }, { status: response.status })
  }

  return NextResponse.json(data)
}

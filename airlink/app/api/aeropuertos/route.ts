import { NextResponse } from "next/server"
import { auth } from "@/auth"

export async function GET() {
  const session = await auth()
  const token = session?.user?.token

  if (!token) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")

  // Verificar que la URL de la API esté definida
  if (!apiUrl) {
    return NextResponse.json({ error: "La variable de entorno NEXT_PUBLIC_API_URL no está definida." }, { status: 500 });
  }

  try {
    // En un entorno real, aquí se haría el fetch a la API externa
    const res = await fetch(`${apiUrl}/api/aeropuertos`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || `Error al obtener aeropuertos: ${res.statusText}`);
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error al obtener aeropuertos:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message || "Error interno del servidor al obtener aeropuertos." }, { status: 500 });
    }
    return NextResponse.json({ error: "Error interno del servidor al obtener aeropuertos." }, { status: 500 });
  }
}

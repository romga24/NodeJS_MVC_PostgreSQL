import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user?.token || !session.user.esAdmin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

  try {
    const response = await fetch(`${apiUrl}/api/clientes`, {
      headers: {
        Authorization: `Bearer ${session.user.token}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error al cargar clientes:", errorText);
      return NextResponse.json({ error: "Error al cargar clientes" }, { status: 500 });
    }

    const clientes = await response.json();
    return NextResponse.json(clientes);
  } catch (error) {
    console.error("Error al obtener los clientes:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}

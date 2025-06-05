"use client"

import { useSession } from "next-auth/react"

export default function VerToken() {
  const { data: session, status } = useSession()

  if (status === "loading") return <p>Cargando sesión...</p>
  if (!session?.user?.token) return <p>No estás autenticado o no hay token.</p>

  return (
    <div style={{ padding: "1rem", backgroundColor: "#f3f4f6", borderRadius: "8px", margin: "1rem 0" }}>
      <h3>🔐 Tu token:</h3>
      <textarea readOnly value={session.user.token} rows={4} style={{ width: "100%" }} />
    </div>
  )
}

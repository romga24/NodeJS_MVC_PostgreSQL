"use client"

import { ApiDiagnostics } from "@/modules/shared/components/api-diagnostics"


export default function ApiDiagnosticsPage() {
  return (
    <div className="container py-12">
      <h1 className="text-2xl font-bold mb-6 text-center">Diagnóstico de API</h1>
      <ApiDiagnostics />
    </div>
  )
}


"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SessionChecker } from "@/modules/shared/components/session-checker"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import { useSession } from "next-auth/react"

export default function InsertarVueloPage() {
  const router = useRouter()
  const t = useTranslations("common")
  const { data: session } = useSession() 

  const [aerolineas, setAerolineas] = useState<any[]>([])
  const [aviones, setAviones] = useState<any[]>([])
  const [aeropuertos, setAeropuertos] = useState<any[]>([])

  const [formData, setFormData] = useState({
    numero_vuelo: "",
    fecha_salida: "",
    fecha_llegada: "",
    id_aeropuerto_origen: "",
    id_aeropuerto_destino: "",
    id_avion: "",
    id_aerolinea: "",
    precio_vuelo: "",
  })

useEffect(() => {
  const fetchData = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")

      const [aero, avs, aerop] = await Promise.all([
        fetch(`${apiUrl}/api/aerolineas`).then(res => res.json()),
        fetch(`${apiUrl}/api/aviones`).then(res => res.json()),
        fetch(`${apiUrl}/api/aeropuertos`).then(res => res.json()),
      ])

      setAerolineas(Array.isArray(aero) ? aero : aero.aerolineas || [])
      setAviones(Array.isArray(avs) ? avs : avs.aviones || [])
      setAeropuertos(Array.isArray(aerop) ? aerop : aerop.aeropuertos || [])

    } catch (error) {
      console.error("Error cargando datos:", error)
    }
  }

  fetchData()
}, [])


const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
}

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session?.user?.token) {
      alert(t("unauthorized"))
      return
    }

    const payload = {
      numero_vuelo: formData.numero_vuelo,
      fecha_salida: formData.fecha_salida + ":00.000Z",
      fecha_llegada: formData.fecha_llegada + ":00.000Z",
      precio_vuelo: parseFloat(formData.precio_vuelo),
      id_aeropuerto_origen: parseInt(formData.id_aeropuerto_origen),
      id_aeropuerto_destino: parseInt(formData.id_aeropuerto_destino),
      id_avion: parseInt(formData.id_avion),
      id_aerolinea: parseInt(formData.id_aerolinea),
      estado_vuelo: "Programado",
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")
      const res = await fetch(`${apiUrl}/api/vuelos/crear`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.token}`,
        },
        body: JSON.stringify(payload),
      })

      let data = null;

      const text = await res.text();
      if (text) data = JSON.parse(text);

      if (res.ok) {
        alert(t('flightCreatedSuccessfully'));
        router.push('/admin/vuelos');
      } else {
        alert(t('errorCreatingFlight') + (data?.error || ' desconocido'));
      }
    } catch (err) {
      console.error('Error de red o servidor:', err);
      alert(t('networkError'));
    }
  }

  const inputClass = "w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
  const labelClass = "block mb-1 font-medium text-gray-700"

  return (
      <div className="container mx-auto py-12 max-w-3xl px-4">
        <div className="mb-6">
      <Button type="button" onClick={() => router.back()}>
        ← {t("goBack") || "Volver"}
      </Button>
    </div>
    <SessionChecker requiredRole="admin" />
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h1 className="text-3xl font-bold text-indigo-600 mb-8 text-center">
        {t('insertNewFlight')}
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="col-span-1">
          <label htmlFor="numero_vuelo" className={labelClass}>{t("flightNumber")}</label>
          <input id="numero_vuelo" name="numero_vuelo" placeholder={t("flightNumber")} onChange={handleChange} required className={inputClass} />
        </div>

        <div className="col-span-1">
          <label htmlFor="precio_vuelo" className={labelClass}>{t("price")}</label>
          <input id="precio_vuelo" name="precio_vuelo" type="number" placeholder={t("price")} onChange={handleChange} required className={inputClass} min="0" step="0.01" />
        </div>

        <div className="col-span-1">
          <label htmlFor="fecha_salida" className={labelClass}>{t("departureDate")}</label>
          <input id="fecha_salida" name="fecha_salida" type="datetime-local" onChange={handleChange} required className={inputClass} />
        </div>

        <div className="col-span-1">
          <label htmlFor="fecha_llegada" className={labelClass}>{t("arrivalDate")}</label>
          <input id="fecha_llegada" name="fecha_llegada" type="datetime-local" onChange={handleChange} required className={inputClass} />
        </div>

        <div className="col-span-1">
          <label htmlFor="id_aerolinea" className={labelClass}>{t("airline")}</label>
          <select id="id_aerolinea" name="id_aerolinea" onChange={handleChange} required className={inputClass} defaultValue="">
            <option value="" disabled>{t("selectAirline")}</option>
            {aerolineas.map((a: any) => (
              <option key={a.id_aerolinea} value={a.id_aerolinea}>{a.nombre}</option>
            ))}
          </select>
        </div>

        <div className="col-span-1">
          <label htmlFor="id_avion" className={labelClass}>{t("airplane")}</label>
          <select id="id_avion" name="id_avion" onChange={handleChange} required className={inputClass} defaultValue="">
            <option value="" disabled>{t("selectAirplane")}</option>
            {aviones.map((a: any) => (
              <option key={a.id_avion} value={a.id_avion}>{a.modelo}</option>
            ))}
          </select>
        </div>

        <div className="col-span-1">
          <label htmlFor="id_aeropuerto_origen" className={labelClass}>{t("origin")}</label>
          <select id="id_aeropuerto_origen" name="id_aeropuerto_origen" onChange={handleChange} required className={inputClass} defaultValue="">
            <option value="" disabled>{t("selectOrigin")}</option>
            {aeropuertos.map((a: any) => (
              <option key={a.id_aeropuerto} value={a.id_aeropuerto}>{a.nombre}</option>
            ))}
          </select>
        </div>

        <div className="col-span-1">
          <label htmlFor="id_aeropuerto_destino" className={labelClass}>{t("destination")}</label>
          <select id="id_aeropuerto_destino" name="id_aeropuerto_destino" onChange={handleChange} required className={inputClass} defaultValue="">
            <option value="" disabled>{t("selectDestination")}</option>
            {aeropuertos.map((a: any) => (
              <option key={a.id_aeropuerto} value={a.id_aeropuerto}>{a.nombre}</option>
            ))}
          </select>
        </div>

        <div className="col-span-1 md:col-span-2">
          <label htmlFor="estado_vuelo" className={labelClass}>{t("flightStatus")}</label>
          <input
            id="estado_vuelo"
            name="estado_vuelo"
            value={t("scheduled")}
            disabled
            readOnly
            className={`${inputClass} bg-green-100 text-green-800 cursor-not-allowed`}
          />
        </div>

        <div className="col-span-1 md:col-span-2 text-center mt-4">
          <Button type="submit">
            {t("createFlight")}
          </Button>
        </div>
      </form>
    </div>
  </div>
)
}

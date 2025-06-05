"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

function mapEstadoToCode(estado: string) {
  if (estado === "Programado") return "S";
  if (estado === "Cancelado") return "C";
  return "U";
}

export default function ListadoVuelosPage() {
  const [vuelos, setVuelos] = useState<any[]>([]);
  const [filteredVuelos, setFilteredVuelos] = useState<any[]>([]);

  const [estadoFilter, setEstadoFilter] = useState<string>("");
  const [fechaFilter, setFechaFilter] = useState<string>("");
  const [fechaLlegadaFilter, setFechaLlegadaFilter] = useState<string>("");
  const [origenFilter, setOrigenFilter] = useState<string>("");
  const [destinoFilter, setDestinoFilter] = useState<string>("");

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const t = useTranslations("flightList");
  const tc = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    async function fetchVuelos() {
      try {
        const res = await fetch("/api/vuelos");
        if (!res.ok) throw new Error(t("errorFetchingFlights"));
        const data = await res.json();

        const vuelosNormalizados = (Array.isArray(data) ? data : data.vuelos || []).map(
          (vuelo: any) => ({
            ...vuelo,
            estado_vuelo_code: mapEstadoToCode(vuelo.estado_vuelo),
          })
        );
        setVuelos(vuelosNormalizados);
        setFilteredVuelos(vuelosNormalizados);
      } catch (error) {
        console.error(t("errorFetchingFlights"), error);
      }
    }

    fetchVuelos();
  }, [locale]);

  useEffect(() => {
    let filtrados = [...vuelos];

    if (estadoFilter) {
      filtrados = filtrados.filter((v) => v.estado_vuelo_code === estadoFilter);
    }

    if (fechaFilter && fechaLlegadaFilter) {
      // Rango ida y vuelta
      const salidaDesde = new Date(fechaFilter);
      const llegadaHasta = new Date(fechaLlegadaFilter);

      filtrados = filtrados.filter((v) => {
        const salida = new Date(v.fecha_salida);
        const llegada = new Date(v.fecha_llegada);
        return salida >= salidaDesde && llegada <= llegadaHasta;
      });
    } else if (fechaFilter) {
      // Solo fecha de salida >= fechaFilter
      const salidaDesde = new Date(fechaFilter);
      filtrados = filtrados.filter((v) => {
        const salida = new Date(v.fecha_salida);
        return salida >= salidaDesde;
      });
    } else if (fechaLlegadaFilter) {
      // Solo fecha de llegada >= fechaLlegadaFilter
      const llegadaDesde = new Date(fechaLlegadaFilter);
      filtrados = filtrados.filter((v) => {
        const llegada = new Date(v.fecha_llegada);
        return llegada >= llegadaDesde;
      });
    }

    if (origenFilter) {
      filtrados = filtrados.filter((v) =>
        v.aeropuerto_origen?.nombre?.toLowerCase().includes(origenFilter.toLowerCase())
      );
    }

    if (destinoFilter) {
      filtrados = filtrados.filter((v) =>
        v.aeropuerto_destino?.nombre?.toLowerCase().includes(destinoFilter.toLowerCase())
      );
    }

    setFilteredVuelos(filtrados);
  }, [estadoFilter, fechaFilter, fechaLlegadaFilter, origenFilter, destinoFilter, vuelos]);



  async function modificarEstado(numero_vuelo: string) {
    setUpdatingId(numero_vuelo);
    setUpdateError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
      const res = await fetch(`${apiUrl}/api/vuelos/modificar-estado-vuelo`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user.token}`,
        },
        body: JSON.stringify({
          codigo_vuelo: numero_vuelo,
          estado_vuelo: "C",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("errorUpdatingStatus"));

      const updated = vuelos.map((v) =>
        v.numero_vuelo === numero_vuelo
          ? { ...v, estado_vuelo_code: "C", estado_vuelo: "Cancelado" }
          : v
      );
      setVuelos(updated);
    } catch (err: any) {
      setUpdateError(err.message || t("unknownError"));
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <Button type="button" onClick={() => router.back()}>
        ← {tc("goBack")}
      </Button>

      <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">{t("flightListTitle")}</h1>

      <div className="mb-6 grid grid-cols-1 sm:grid-cols-6 gap-4 items-end">
        <div>
          <label htmlFor="estadoFilter" className="block font-medium mb-1">
            {tc("filterByStatus")}:
          </label>
          <select
            id="estadoFilter"
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1"
          >
            <option value="">{tc("all")}</option>
            <option value="S">{t("scheduled")}</option>
            <option value="C">{t("cancelled")}</option>
          </select>
        </div>

        <div>
          <label htmlFor="fechaFilter" className="block font-medium mb-1">
            {tc("filterByDepartureDate")}:
          </label>
          <input
            type="date"
            id="fechaFilter"
            value={fechaFilter}
            onChange={(e) => setFechaFilter(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1"
          />
        </div>

        <div>
          <label htmlFor="fechaLlegadaFilter" className="block font-medium mb-1">
            {tc("filterByArrivalDate")}:
          </label>
          <input
            type="date"
            id="fechaLlegadaFilter"
            value={fechaLlegadaFilter}
            onChange={(e) => setFechaLlegadaFilter(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1"
          />
        </div>

        <div>
          <label htmlFor="origenFilter" className="block font-medium mb-1">
            {tc("filterByOrigin")}:
          </label>
          <input
            type="text"
            id="origenFilter"
            value={origenFilter}
            onChange={(e) => setOrigenFilter(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1"
          />
        </div>

        <div>
          <label htmlFor="destinoFilter" className="block font-medium mb-1">
            {tc("filterByDestination")}:
          </label>
          <input
            type="text"
            id="destinoFilter"
            value={destinoFilter}
            onChange={(e) => setDestinoFilter(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1"
          />
        </div>
      </div>

      {updateError && (
        <p className="text-red-600 mb-6 text-center font-medium">
          {t("errorUpdatingStatus")}: {updateError}
        </p>
      )}

      {filteredVuelos.length === 0 ? (
        <p className="text-center text-gray-600">{t("noFlightsAvailable")}</p>
      ) : (
        <div className="space-y-6">
          {filteredVuelos.map((vuelo) => {
            const vueloCancelado = vuelo.estado_vuelo_code === "C";

            return (
              <div
                key={vuelo.numero_vuelo || vuelo.id}
                className="bg-white border border-gray-200 rounded-md shadow-sm p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center"
              >
                <div className="sm:col-span-2">
                  <p className="text-lg font-semibold mb-4 text-gray-800">
                    {t("flight")}: {vuelo.numero_vuelo || vuelo.id}
                  </p>

                  <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-gray-700">
                    <p>
                      <strong>{t("origin")}:</strong> {vuelo?.aeropuerto_origen?.nombre}
                    </p>
                    <p>
                      <strong>{t("destination")}:</strong> {vuelo?.aeropuerto_destino?.nombre}
                    </p>
                    <p>
                      <strong>{t("departureDate")}:</strong> {vuelo?.fecha_salida?.split("T")[0]}
                    </p>
                    <p>
                      <strong>{t("departureTime")}:</strong> {vuelo?.fecha_salida?.split("T")[1]?.slice(0, 5)}
                    </p>
                    <p>
                      <strong>{t("arrivalDate")}:</strong> {vuelo?.fecha_llegada?.split("T")[0]}
                    </p>
                    <p>
                      <strong>{t("arrivalTime")}:</strong> {vuelo?.fecha_llegada?.split("T")[1]?.slice(0, 5)}
                    </p>
                    <p>
                      <strong>{t("price")}:</strong> €{vuelo?.precio_vuelo}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center sm:items-end gap-4">
                  <div
                    className={`w-28 text-center text-white font-semibold py-1 rounded-md ${
                      vueloCancelado ? "bg-red-600" : "bg-green-600"
                    }`}
                  >
                    {vueloCancelado ? t("cancelled") : t("scheduled")}
                  </div>

                  <Button
                    onClick={() => modificarEstado(vuelo.numero_vuelo)}
                    disabled={updatingId === vuelo.numero_vuelo || vueloCancelado}
                    className="bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white"
                  >
                    {updatingId === vuelo.numero_vuelo ? t("updating") : tc("cancelFlight")}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

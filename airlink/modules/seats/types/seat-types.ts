export interface Seat {
  id_asiento: string
  codigo_asiento: string
  fila: number
  columna: string
  clase: "business" | "economy" | "Business" | "Economy"
  estado: "disponible" | "ocupado" | "reservado"
  precio: number
  id_avion: string
  numero_vuelo: string
}

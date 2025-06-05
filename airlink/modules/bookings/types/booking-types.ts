export interface Ticket {
  id_billete: number
  localizador: string
  precio: string
  vuelo: {
    numero_vuelo: string
    fecha_salida: string
    fecha_llegada: string
    precio_vuelo: number
    estado_vuelo: string
    origen?: {
      aeropuerto: string
      ciudad: string
      pais: string
      codigo_iata?: string
    }
    destino?: {
      aeropuerto: string
      ciudad: string
      pais: string
      codigo_iata?: string
    }
  }
  asiento: {
    codigo_asiento: string
    fila: number
    columna: string
    clase: string
  }
  pasajero: {
    nombre: string
    apellidos: string
    email: string
    telefono: string
    nif: string
  }
}

export interface Booking {
  id_reserva: number
  fecha_reserva: string
  billetes: Ticket[]
}

export interface BookingsResponse {
  reservas: Booking[]
}
export interface Booking {
  id_reserva: number
  fecha_reserva: string
  billetes: Ticket[]
}

export interface BookingsResponse {
  reservas: Booking[]
}

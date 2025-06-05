export interface Airport {
  id_aeropuerto: number;
  nombre: string;
  ciudad: string;
  pais: string;
  codigo_iata: string;
}

export interface Airline {
  nombre: string;
  codigo_iata: string;
}

export interface Aircraft {
  modelo: string;
  capacidad: number;
  distribucion_asientos: string;
  total_asientos: number;
}

export interface ApiError {
  message: string;
  status?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
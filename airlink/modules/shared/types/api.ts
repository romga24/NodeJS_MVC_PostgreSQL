export interface ClienteProfile {
  id_cliente: number
  nombre: string
  apellidos: string
  email: string
  telefono: string
  nif: string
  nombre_usuario: string
}

export interface ClienteCreationResponse {
  message: string
}

export interface LoginResponse {
  message: string
  token: string
  estaLogueado: boolean
}

export interface ClienteUpdateResponse {
  message: string
}

export interface ClienteDeleteResponse {
  message: string
}

export interface ApiError {
  message: string
  status?: number
}


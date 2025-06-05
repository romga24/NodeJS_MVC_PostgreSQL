export interface ProfileData {
  id_cliente?: number | string
  nombre?: string
  apellidos?: string
  email?: string
  telefono?: string
  nif?: string
  nombre_usuario?: string
  contraseña?: string
}

export interface ClienteProfile {
  id_cliente: number
  nombre: string
  apellidos: string
  email: string
  telefono: string
  nif: string
  nombre_usuario: string
}

export interface ClienteUpdateResponse {
  message: string
}

export interface ClienteDeleteResponse {
  message: string
}

export interface ProfileResponse {
  success: boolean
  message?: string
  data?: any
}

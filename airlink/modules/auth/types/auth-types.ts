export interface LoginCredentials {
  usuarioOEmail: string
  contraseña: string
}

export interface LoginResponse {
  message?: string
  token?: string
  estaLogueado?: boolean
  id_cliente?: string
  nombre?: string
  email?: string
  apellidos?: string
  telefono?: string
  success?: boolean
}

export interface RegisterFormData {
  nombre: string
  apellidos: string
  email: string
  telefono: string
  nif: string
  nombre_usuario: string
  contraseña: string
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    token: string
    estaLogueado: boolean 
  }
}

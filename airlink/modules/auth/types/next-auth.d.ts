import "next-auth"
import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      token: string
      estaLogueado: boolean
      esAdmin: boolean
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    token: string
    estaLogueado: boolean
    esAdmin: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    token: string
    estaLogueado: boolean
    esAdmin: boolean
  }
}

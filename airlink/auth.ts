import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { login } from "@/modules/auth/services/login"
import type { NextAuthConfig } from "next-auth"

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        usuarioOEmail: { label: "Usuario o Email", type: "text" },
        contraseña: { label: "Contraseña", type: "password" },
        token: { label: "Token", type: "text" },
      },
      async authorize(credentials, req) {
        console.log("🔐 AUTHORIZE - Starting authentication")

        if (credentials?.token) {
          try {
            let userId = "temp_id"
            let userEmail = null
            let userName = null
            let esAdmin = false
            const tokenValue = credentials.token.toString()

            try {
              const tokenParts = tokenValue.split(".")
              if (tokenParts.length === 3) {
                const payload = JSON.parse(atob(tokenParts[1]))
                userId = payload.sub?.toString() || "temp_id"
                userEmail = payload.email || null
                userName = payload.name || "Usuario"
                esAdmin = Boolean(payload.is_admin || payload.esAdmin || payload.admin || payload.role === "admin")
                console.log("🔐 AUTHORIZE - Token auth - Es administrador:", esAdmin, "Payload:", payload)
              }
            } catch (e) {
              console.error("Error al decodificar el token:", e)
            }

            const user = {
              id: userId,
              name: userName,
              email: userEmail,
              token: tokenValue,
              estaLogueado: true,
              esAdmin,
            }
            console.log("🔐 AUTHORIZE - Token auth result:", user)
            return user
          } catch (error) {
            console.error("Error al autenticar con token:", error)
            return null
          }
        }

        if (!credentials?.usuarioOEmail || !credentials?.contraseña) {
          console.error("Error: Credenciales incompletas")
          return null
        }

        try {
          console.log("🔐 AUTHORIZE - Attempting login with credentials")
          const data = await login({
            usuarioOEmail: credentials.usuarioOEmail.toString(),
            contraseña: credentials.contraseña.toString(),
          })

          if (data.token) {
            let userId = "temp_id"
            let userEmail = null
            let userName = null
            let esAdmin = false

            try {
              const tokenParts = data.token.split(".")
              if (tokenParts.length === 3) {
                const payload = JSON.parse(atob(tokenParts[1]))
                userId = payload.sub?.toString() || "temp_id"
                userEmail = payload.email || null
                userName = payload.name || credentials.usuarioOEmail.toString()
                esAdmin = Boolean(payload.is_admin || payload.esAdmin || payload.admin || payload.role === "admin")
                console.log("🔐 AUTHORIZE - Credentials auth - Es administrador:", esAdmin, "Payload:", payload)
              }
            } catch (e) {
              console.error("Error al decodificar el token:", e)
            }

            const user = {
              id: userId,
              name: userName,
              email: userEmail,
              token: data.token,
              estaLogueado: true,
              esAdmin,
            }
            console.log("🔐 AUTHORIZE - Credentials auth result:", user)
            return user
          }

          return null
        } catch (error: any) {
          console.error("Error en authorize:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id || "unknown_id"
        token.token = user.token
        token.estaLogueado = user.estaLogueado
        token.email = user.email || undefined
        token.esAdmin = user.esAdmin || false
        console.log("🔐 JWT callback - esAdmin:", token.esAdmin, "Full token:", token)
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) || "unknown_id"
        session.user.token = token.token as string
        session.user.email = token.email as string
        session.user.estaLogueado = token.estaLogueado as boolean
        session.user.esAdmin = token.esAdmin as boolean
        console.log("🔐 SESSION callback - esAdmin:", session.user.esAdmin, "Full session:", session)

        // Solo usar localStorage en el cliente
        if (typeof window !== "undefined" && token.token) {
          localStorage.setItem("token", token.token as string)
        }
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" ? "__Secure-next-auth.session-token" : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        // Para Vercel, no especificar dominio deja que Vercel lo maneje automáticamente
        domain: undefined,
      },
    },
    callbackUrl: {
      name: process.env.NODE_ENV === "production" ? "__Secure-next-auth.callback-url" : "next-auth.callback-url",
      options: {
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    csrfToken: {
      name: process.env.NODE_ENV === "production" ? "__Host-next-auth.csrf-token" : "next-auth.csrf-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
}

export const { handlers, auth, signOut } = NextAuth(authConfig)

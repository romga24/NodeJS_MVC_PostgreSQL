import createIntlMiddleware from "next-intl/middleware"
import { type NextRequest, NextResponse } from "next/server"
import { locales, localePrefix } from "./i18n/routing"
import { getToken } from "next-auth/jwt"

const intlMiddleware = createIntlMiddleware({
  locales,
  localePrefix,
  defaultLocale: "en",
})

export default async function middleware(request: NextRequest) {
  console.log("🔍 MIDDLEWARE - URL:", request.nextUrl.pathname)

  // Si la ruta es /, redirigir al locale por defecto
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL(`/es`, request.url))
  }

  // Permitir rutas de API de NextAuth sin restricciones
  if (request.nextUrl.pathname.startsWith("/api/auth")) {
    return NextResponse.next()
  }

  // Obtener token con configuración mejorada para producción
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: process.env.NODE_ENV === "production" ? "__Secure-next-auth.session-token" : "next-auth.session-token",
  })

  console.log("🔍 MIDDLEWARE - Token completo:", token)
  console.log("🔍 MIDDLEWARE - Token esAdmin:", token?.esAdmin)
  console.log("🔍 MIDDLEWARE - Token is_admin:", token?.is_admin)

  const isLoggedIn = !!token
  const isAdmin = token?.esAdmin === true || token?.is_admin === true

  // Verificar si la ruta es de administrador
  const adminRouteRegex = RegExp(`^(/(${locales.join("|")}))?(/admin).*$`, "i")
  const isAdminRoute = adminRouteRegex.test(request.nextUrl.pathname)

  console.log("🔍 MIDDLEWARE - isLoggedIn:", isLoggedIn)
  console.log("🔍 MIDDLEWARE - isAdmin:", isAdmin)
  console.log("🔍 MIDDLEWARE - isAdminRoute:", isAdminRoute)

  // Si intenta acceder a ruta de admin sin ser admin, redirigir a dashboard normal
  if (isAdminRoute && (!isLoggedIn || !isAdmin)) {
    console.log("❌ Redirigiendo: no es admin o no está logueado")
    const locale = request.nextUrl.pathname.split("/")[1] || "es"
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url))
  }

  // Manejar redirecciones de locale raíz SOLO si no es una ruta de admin
  const localePatterns = locales.map((locale) => `/${locale}/?$`)
  const localeRootRegex = new RegExp(`^(${localePatterns.join("|")})`, "i")

  if (localeRootRegex.test(request.nextUrl.pathname) && !isAdminRoute) {
    const locale = request.nextUrl.pathname.split("/")[1]

    console.log("🔍 MIDDLEWARE - Locale redirect para:", locale)
    console.log("🔍 MIDDLEWARE - isAdmin:", isAdmin)

    if (isAdmin) {
      return NextResponse.redirect(new URL(`/${locale}/admin/dashboard`, request.url))
    } else {
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url))
    }
  }

  // Rutas protegidas normales
  const protectedRoutes = ["/profile", "/settings", "/seats"]
  const isOnProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.replace(/^\/[a-z]{2}/, "").startsWith(route),
  )

  if (isOnProtectedRoute && !isLoggedIn) {
    const locale = request.nextUrl.pathname.split("/")[1] || "es"
    const loginUrl = new URL(`/${locale}/login`, request.url)
    loginUrl.searchParams.set("callbackUrl", request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Continuar con el middleware de internacionalización
  const response = intlMiddleware(request)
  return response
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)", "/"],
}

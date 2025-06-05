// Crear un nuevo archivo para centralizar la configuración de auth
export const getAuthConfig = () => {
  const isProduction = process.env.NODE_ENV === "production"

  return {
    cookieName: isProduction ? "__Secure-next-auth.session-token" : "next-auth.session-token",
    secure: isProduction,
    domain: isProduction ? process.env.NEXTAUTH_URL?.replace(/https?:\/\//, "") : undefined,
  }
}
